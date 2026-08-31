import { supabaseAdmin } from '@/lib/supabase/client';

/**
 * 3RD ENERGY SUPABASE DATABASE SERVICE
 * Enterprise-grade PostgreSQL persistence layer for all platform collections.
 */

// Helper to convert camelCase JavaScript objects to snake_case PostgreSQL records
function toSnakeCase(obj: Record<string, unknown>): Record<string, unknown> {
  const result: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(obj)) {
    const snakeKey = key.replace(/[A-Z]/g, letter => `_${letter.toLowerCase()}`);
    result[snakeKey] = value;
  }
  return result;
}

// Helper to convert snake_case PostgreSQL records to camelCase JavaScript objects
function toCamelCase<T>(obj: Record<string, unknown>): T {
  const result: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(obj)) {
    const camelKey = key.replace(/_([a-z])/g, (_, letter) => letter.toUpperCase());
    result[camelKey] = value;
  }
  return result as T;
}

export class SupabaseCollection<T extends { id: string }> {
  private tableName: string;

  constructor(tableName: string) {
    this.tableName = tableName;
  }

  async getAll(): Promise<T[]> {
    try {
      const { data, error } = await supabaseAdmin
        .from(this.tableName)
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.warn(`[Supabase:${this.tableName}] Select error:`, error.message);
        return [];
      }

      return (data || []).map(row => toCamelCase<T>(row));
    } catch (err) {
      console.warn(`[Supabase:${this.tableName}] Connection exception:`, err);
      return [];
    }
  }

  async getById(id: string): Promise<T | null> {
    try {
      const { data, error } = await supabaseAdmin
        .from(this.tableName)
        .select('*')
        .eq('id', id)
        .single();

      if (error || !data) return null;
      return toCamelCase<T>(data);
    } catch {
      return null;
    }
  }

  async upsert(item: T): Promise<T> {
    try {
      const record = toSnakeCase(item as unknown as Record<string, unknown>);
      const { data, error } = await supabaseAdmin
        .from(this.tableName)
        .upsert(record, { onConflict: 'id' })
        .select()
        .single();

      if (error) {
        console.warn(`[Supabase:${this.tableName}] Upsert error:`, error.message);
        return item;
      }

      return toCamelCase<T>(data);
    } catch (err) {
      console.warn(`[Supabase:${this.tableName}] Upsert exception:`, err);
      return item;
    }
  }

  async delete(id: string): Promise<boolean> {
    try {
      const { error } = await supabaseAdmin
        .from(this.tableName)
        .delete()
        .eq('id', id);

      return !error;
    } catch {
      return false;
    }
  }
}

// Export collections for all 3rd Energy entities
export const supabaseDb = {
  users: new SupabaseCollection('third_energy_users'),
  customerProfiles: new SupabaseCollection('third_energy_customer_profiles'),
  systems: new SupabaseCollection('third_energy_systems'),
  serviceRecords: new SupabaseCollection('third_energy_service_records'),
  maintenanceReminders: new SupabaseCollection('third_energy_maintenance_reminders'),
  warranties: new SupabaseCollection('third_energy_warranties'),
  documents: new SupabaseCollection('third_energy_documents'),
  supportTickets: new SupabaseCollection('third_energy_support_tickets'),
  leads: new SupabaseCollection('third_energy_leads'),
  orders: new SupabaseCollection('third_energy_orders'),
  installations: new SupabaseCollection('third_energy_installations'),
  auditLogs: new SupabaseCollection('third_energy_audit_logs'),
};
