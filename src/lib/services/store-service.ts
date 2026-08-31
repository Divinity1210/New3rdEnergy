/**
 * Store Service — Hybrid File/Supabase Persistence Layer
 * 
 * Enterprise-grade data layer:
 * - Supabase PostgreSQL cloud sync when credentials are configured
 * - Atomic local JSON persistence & in-memory caching fallback
 * - Full CRUD, soft deletion, auditability, and zero downtime
 */

import { promises as fs } from 'fs';
import path from 'path';
import os from 'os';
import { supabaseAdmin } from '@/lib/supabase/client';

// Store directory — uses /tmp on serverless / Vercel, .data/ locally
const isServerless = process.env.VERCEL === '1' || process.env.AWS_LAMBDA_FUNCTION_NAME !== undefined;
const STORE_DIR = isServerless
  ? path.join(os.tmpdir(), '3e_data')
  : path.join(process.cwd(), '.data');

// In-memory fallback cache to ensure zero-crash operations
const memoryStore = new Map<string, unknown[]>();
const hydratedFromSupabase = new Set<string>();

// Map internal store collection names to Supabase tables
const COLLECTION_TO_SUPABASE_TABLE: Record<string, string> = {
  'users': 'third_energy_users',
  'customer-users': 'third_energy_users',
  'customer-profiles': 'third_energy_customer_profiles',
  'customer-systems': 'third_energy_systems',
  'service-records': 'third_energy_service_records',
  'maintenance-reminders': 'third_energy_maintenance_reminders',
  'warranties': 'third_energy_warranties',
  'customer-documents': 'third_energy_documents',
  'support-tickets': 'third_energy_support_tickets',
  'leads': 'third_energy_leads',
  'orders': 'third_energy_orders',
  'installations': 'third_energy_installations',
  'audit-log': 'third_energy_audit_logs',
};

// Helper: Convert camelCase to snake_case for Supabase
function toSnakeCase(obj: Record<string, unknown>): Record<string, unknown> {
  const result: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(obj)) {
    const snakeKey = key.replace(/[A-Z]/g, letter => `_${letter.toLowerCase()}`);
    result[snakeKey] = value;
  }
  return result;
}

// Helper: Convert snake_case to camelCase from Supabase
function toCamelCase<T>(obj: Record<string, unknown>): T {
  const result: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(obj)) {
    const camelKey = key.replace(/_([a-z])/g, (_, letter) => letter.toUpperCase());
    result[camelKey] = value;
  }
  return result as T;
}

// Ensure store directory exists
async function ensureStoreDir(): Promise<void> {
  try {
    await fs.mkdir(STORE_DIR, { recursive: true });
  } catch {
    // Directory already exists
  }
}

// Get file path for a collection
function getCollectionPath(collection: string): string {
  return path.join(STORE_DIR, `${collection}.json`);
}

// Sync single item to Supabase in background
async function syncItemToSupabase(collection: string, item: Record<string, unknown>): Promise<void> {
  const tableName = COLLECTION_TO_SUPABASE_TABLE[collection];
  if (!tableName || !process.env.NEXT_PUBLIC_SUPABASE_URL) return;

  try {
    const record = toSnakeCase(item);
    await supabaseAdmin
      .from(tableName)
      .upsert(record, { onConflict: 'id' });
  } catch (err) {
    console.warn(`[StoreService] Supabase sync warning for ${collection}:`, err);
  }
}

// Sync soft delete to Supabase in background
async function syncDeleteToSupabase(collection: string, id: string): Promise<void> {
  const tableName = COLLECTION_TO_SUPABASE_TABLE[collection];
  if (!tableName || !process.env.NEXT_PUBLIC_SUPABASE_URL) return;

  try {
    await supabaseAdmin
      .from(tableName)
      .update({ deleted_at: new Date().toISOString() })
      .eq('id', id);
  } catch (err) {
    console.warn(`[StoreService] Supabase delete sync warning for ${collection}:`, err);
  }
}

// Read a collection with Supabase hydration
async function readCollection<T>(collection: string): Promise<T[]> {
  const memItems = (memoryStore.get(collection) as T[]) || [];

  // Try hydrating from Supabase if not yet hydrated in this runtime
  const tableName = COLLECTION_TO_SUPABASE_TABLE[collection];
  if (tableName && !hydratedFromSupabase.has(collection) && process.env.NEXT_PUBLIC_SUPABASE_URL) {
    try {
      const { data, error } = await supabaseAdmin
        .from(tableName)
        .select('*')
        .order('created_at', { ascending: false });

      if (!error && data && data.length > 0) {
        const parsed = data.map(row => toCamelCase<T>(row));
        memoryStore.set(collection, parsed);
        hydratedFromSupabase.add(collection);
        return parsed;
      }
    } catch {
      // Graceful fallback to file/memory
    }
  }

  try {
    await ensureStoreDir();
    const filePath = getCollectionPath(collection);
    const data = await fs.readFile(filePath, 'utf-8');
    const parsed = JSON.parse(data) as T[];
    memoryStore.set(collection, parsed);
    return parsed;
  } catch {
    return memItems;
  }
}

// Write a collection atomically
async function writeCollection<T>(collection: string, data: T[]): Promise<void> {
  memoryStore.set(collection, data);

  try {
    await ensureStoreDir();
    const filePath = getCollectionPath(collection);
    const tempPath = `${filePath}.tmp.${Date.now()}`;
    
    await fs.writeFile(tempPath, JSON.stringify(data, null, 2), 'utf-8');
    await fs.rename(tempPath, filePath);
  } catch (error) {
    console.warn(`[StoreService] Storage write warning for '${collection}':`, error);
  }
}

// ===== GENERIC STORE OPERATIONS =====

export interface StoreEntity {
  id: string;
  createdAt: string;
  updatedAt: string;
  deletedAt?: string;
}

export interface StoreFilters {
  limit?: number;
  offset?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  includeDeleted?: boolean;
  [key: string]: unknown;
}

export class Store<T extends StoreEntity> {
  constructor(private collection: string) {}

  /** Get all items (excluding soft-deleted by default) */
  async list(filters?: StoreFilters): Promise<T[]> {
    let items = await readCollection<T>(this.collection);

    // Filter out soft-deleted unless explicitly requested
    if (!filters?.includeDeleted) {
      items = items.filter(item => !item.deletedAt);
    }

    // Apply sorting
    if (filters?.sortBy) {
      const key = filters.sortBy as keyof T;
      const order = filters.sortOrder === 'asc' ? 1 : -1;
      items.sort((a, b) => {
        const aVal = String(a[key] ?? '');
        const bVal = String(b[key] ?? '');
        return aVal.localeCompare(bVal) * order;
      });
    } else {
      // Default: newest first
      items.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
    }

    // Apply pagination
    const offset = filters?.offset ?? 0;
    const limit = filters?.limit ?? items.length;
    return items.slice(offset, offset + limit);
  }

  /** Get a single item by ID */
  async get(id: string): Promise<T | null> {
    const items = await readCollection<T>(this.collection);
    return items.find(item => item.id === id && !item.deletedAt) ?? null;
  }

  /** Create a new item */
  async create(item: T): Promise<T> {
    const items = await readCollection<T>(this.collection);
    items.push(item);
    await writeCollection(this.collection, items);
    
    // Asynchronous Supabase PostgreSQL sync
    syncItemToSupabase(this.collection, item as unknown as Record<string, unknown>);
    return item;
  }

  /** Update an item */
  async update(id: string, updates: Partial<T>): Promise<T | null> {
    const items = await readCollection<T>(this.collection);
    const index = items.findIndex(item => item.id === id);
    
    if (index === -1) return null;

    const updated = {
      ...items[index],
      ...updates,
      id, // Prevent ID overwrite
      createdAt: items[index].createdAt, // Prevent creation date overwrite
      updatedAt: new Date().toISOString(),
    };

    items[index] = updated;
    await writeCollection(this.collection, items);
    
    // Asynchronous Supabase PostgreSQL sync
    syncItemToSupabase(this.collection, updated as unknown as Record<string, unknown>);
    return updated;
  }

  /** Soft delete an item */
  async softDelete(id: string): Promise<boolean> {
    const items = await readCollection<T>(this.collection);
    const index = items.findIndex(item => item.id === id);
    
    if (index === -1) return false;

    items[index] = {
      ...items[index],
      deletedAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    await writeCollection(this.collection, items);
    syncDeleteToSupabase(this.collection, id);
    return true;
  }

  /** Count items */
  async count(filters?: StoreFilters): Promise<number> {
    const items = await this.list(filters);
    return items.length;
  }

  /** Find items by a field value */
  async findBy(field: keyof T, value: unknown): Promise<T[]> {
    const items = await readCollection<T>(this.collection);
    return items.filter(item => !item.deletedAt && item[field] === value);
  }

  /** Search items by a text field */
  async search(fields: (keyof T)[], query: string): Promise<T[]> {
    const items = await readCollection<T>(this.collection);
    const normalised = query.toLowerCase();
    return items.filter(item => {
      if (item.deletedAt) return false;
      return fields.some(field => {
        const val = item[field];
        if (typeof val === 'string') {
          return val.toLowerCase().includes(normalised);
        }
        return false;
      });
    });
  }
}

// ===== COLLECTION INSTANCES =====

export const leadsStore = new Store<StoreEntity & Record<string, unknown>>('leads');
export const contactsStore = new Store<StoreEntity & Record<string, unknown>>('contacts');
export const companiesStore = new Store<StoreEntity & Record<string, unknown>>('companies');
export const opportunitiesStore = new Store<StoreEntity & Record<string, unknown>>('opportunities');
export const quotesStore = new Store<StoreEntity & Record<string, unknown>>('quotes');
export const ordersStore = new Store<StoreEntity & Record<string, unknown>>('orders');
export const installationsStore = new Store<StoreEntity & Record<string, unknown>>('installations');
export const serviceRecordsStore = new Store<StoreEntity & Record<string, unknown>>('service-records');
export const communicationsStore = new Store<StoreEntity & Record<string, unknown>>('communications');
export const usersStore = new Store<StoreEntity & Record<string, unknown>>('users');
export const auditStore = new Store<StoreEntity & Record<string, unknown>>('audit-log');
export const automationActionsStore = new Store<StoreEntity & Record<string, unknown>>('automation-actions');
export const knowledgeStore = new Store<StoreEntity & Record<string, unknown>>('knowledge-base');

// Phase 4: My Energy Customer Stores
export const customerUsersStore = new Store<StoreEntity & Record<string, unknown>>('customer-users');
export const customerProfilesStore = new Store<StoreEntity & Record<string, unknown>>('customer-profiles');
export const customerSystemsStore = new Store<StoreEntity & Record<string, unknown>>('customer-systems');
export const supportTicketsStore = new Store<StoreEntity & Record<string, unknown>>('support-tickets');
export const maintenanceStore = new Store<StoreEntity & Record<string, unknown>>('maintenance-reminders');
export const warrantiesStore = new Store<StoreEntity & Record<string, unknown>>('warranties');
export const documentsStore = new Store<StoreEntity & Record<string, unknown>>('customer-documents');
export const customerNotificationsStore = new Store<StoreEntity & Record<string, unknown>>('customer-notifications');
