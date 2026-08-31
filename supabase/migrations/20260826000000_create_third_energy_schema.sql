-- ==========================================================
-- 3RD ENERGY DIGITAL PLATFORM — SUPABASE DATABASE SCHEMA
-- Isolated table namespace: third_energy_*
-- Compatible with PostgreSQL / Supabase
-- ==========================================================

-- Enable UUID extension if not present
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. USERS TABLE (Admin & Commercial Customers)
CREATE TABLE IF NOT EXISTS third_energy_users (
  id TEXT PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'CUSTOMER', -- 'SUPER_ADMIN' | 'ADMIN' | 'OPERATIONS' | 'SALES' | 'CUSTOMER'
  first_name TEXT,
  last_name TEXT,
  phone TEXT,
  company TEXT,
  status TEXT DEFAULT 'ACTIVE', -- 'ACTIVE' | 'SUSPENDED' | 'PENDING'
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. CUSTOMER PROFILES & MULTI-SITE LOCATIONS
CREATE TABLE IF NOT EXISTS third_energy_customer_profiles (
  id TEXT PRIMARY KEY,
  customer_id TEXT NOT NULL REFERENCES third_energy_users(id) ON DELETE CASCADE,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  company_name TEXT,
  industry TEXT DEFAULT 'Commercial',
  job_title TEXT,
  locations JSONB DEFAULT '[]'::jsonb, -- Array of CustomerLocation objects
  notification_preferences JSONB DEFAULT '{"email":true,"sms":true,"whatsapp":true,"maintenanceReminders":true,"orderUpdates":true,"ticketResponses":true}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. INSTALLED ENERGY SYSTEMS & TELEMETRY
CREATE TABLE IF NOT EXISTS third_energy_systems (
  id TEXT PRIMARY KEY,
  customer_id TEXT NOT NULL REFERENCES third_energy_users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  system_type TEXT NOT NULL DEFAULT 'HYBRID_SOLAR', -- 'HYBRID_SOLAR' | 'OFF_GRID' | 'GRID_TIED' | 'BATTERY_STORAGE'
  location_id TEXT,
  location_name TEXT NOT NULL,
  installation_date TIMESTAMPTZ NOT NULL,
  installed_by TEXT,
  total_capacity_kva NUMERIC NOT NULL,
  battery_capacity_kwh NUMERIC NOT NULL,
  solar_capacity_kwp NUMERIC DEFAULT 0,
  health_status TEXT NOT NULL DEFAULT 'OPTIMAL', -- 'OPTIMAL' | 'ATTENTION_REQUIRED' | 'FAULT'
  components JSONB DEFAULT '[]'::jsonb, -- Array of SystemComponent objects (serials, models)
  telemetry JSONB DEFAULT '{}'::jsonb, -- Live telemetry metrics (kWh yield, SOC %, etc.)
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. SERVICE HISTORY & FIELD ENGINEERING LOGS
CREATE TABLE IF NOT EXISTS third_energy_service_records (
  id TEXT PRIMARY KEY,
  customer_id TEXT NOT NULL REFERENCES third_energy_users(id) ON DELETE CASCADE,
  system_id TEXT REFERENCES third_energy_systems(id) ON DELETE SET NULL,
  system_name TEXT NOT NULL,
  service_date TIMESTAMPTZ NOT NULL,
  technician_name TEXT NOT NULL,
  department TEXT DEFAULT 'Field Operations & Maintenance',
  issue_description TEXT NOT NULL,
  work_performed TEXT NOT NULL,
  parts_replaced JSONB DEFAULT '[]'::jsonb,
  status TEXT DEFAULT 'COMPLETED', -- 'SCHEDULED' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED'
  next_recommended_service_date TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. MAINTENANCE REMINDERS & INTERVALS
CREATE TABLE IF NOT EXISTS third_energy_maintenance_reminders (
  id TEXT PRIMARY KEY,
  customer_id TEXT NOT NULL REFERENCES third_energy_users(id) ON DELETE CASCADE,
  system_id TEXT REFERENCES third_energy_systems(id) ON DELETE SET NULL,
  system_name TEXT NOT NULL,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  due_date TIMESTAMPTZ NOT NULL,
  recommended_action TEXT NOT NULL,
  status TEXT DEFAULT 'PENDING', -- 'PENDING' | 'OVERDUE' | 'SCHEDULED' | 'COMPLETED'
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. WARRANTY REGISTRATION & SERIAL TRACKING
CREATE TABLE IF NOT EXISTS third_energy_warranties (
  id TEXT PRIMARY KEY,
  customer_id TEXT NOT NULL REFERENCES third_energy_users(id) ON DELETE CASCADE,
  system_id TEXT REFERENCES third_energy_systems(id) ON DELETE SET NULL,
  product_name TEXT NOT NULL,
  serial_number TEXT NOT NULL,
  warranty_period_months INT NOT NULL,
  start_date TIMESTAMPTZ NOT NULL,
  end_date TIMESTAMPTZ NOT NULL,
  terms_summary TEXT NOT NULL,
  claim_procedure TEXT NOT NULL,
  status TEXT DEFAULT 'ACTIVE', -- 'ACTIVE' | 'EXPIRING_SOON' | 'EXPIRED' | 'CLAIM_IN_PROGRESS'
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. DOCUMENT VAULT (Invoices, Schematics, Manuals)
CREATE TABLE IF NOT EXISTS third_energy_documents (
  id TEXT PRIMARY KEY,
  customer_id TEXT NOT NULL REFERENCES third_energy_users(id) ON DELETE CASCADE,
  system_id TEXT REFERENCES third_energy_systems(id) ON DELETE SET NULL,
  title TEXT NOT NULL,
  type TEXT NOT NULL, -- 'INVOICE' | 'SINGLE_LINE_DIAGRAM' | 'USER_MANUAL' | 'WARRANTY_CERTIFICATE' | 'SERVICE_REPORT'
  file_url TEXT NOT NULL,
  file_size_kb INT DEFAULT 1200,
  reference_number TEXT,
  issued_date TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 8. SUPPORT TICKETS & THREADED MESSAGES
CREATE TABLE IF NOT EXISTS third_energy_support_tickets (
  id TEXT PRIMARY KEY,
  customer_id TEXT NOT NULL REFERENCES third_energy_users(id) ON DELETE CASCADE,
  ticket_number TEXT UNIQUE NOT NULL,
  subject TEXT NOT NULL,
  category TEXT NOT NULL, -- 'INVERTER_FAULT' | 'BATTERY_ISSUE' | 'SOLAR_OUTPUT' | 'MAINTENANCE_REQUEST' | 'BILLING' | 'GENERAL_INQUIRY'
  priority TEXT NOT NULL DEFAULT 'MEDIUM', -- 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT'
  status TEXT NOT NULL DEFAULT 'NEW_REQUEST', -- 'NEW_REQUEST' | 'OPEN' | 'IN_PROGRESS' | 'WAITING_FOR_CUSTOMER' | 'RESOLVED' | 'CLOSED'
  initial_description TEXT NOT NULL,
  assigned_engineer TEXT,
  system_id TEXT REFERENCES third_energy_systems(id) ON DELETE SET NULL,
  system_name TEXT,
  messages JSONB DEFAULT '[]'::jsonb, -- Array of TicketMessage objects
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 9. LEADS & PIPELINE (CRM)
CREATE TABLE IF NOT EXISTS third_energy_leads (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  company TEXT,
  role TEXT,
  estimated_volume TEXT,
  message TEXT,
  status TEXT DEFAULT 'NEW',
  score INT DEFAULT 50,
  stage TEXT DEFAULT 'PROSPECT',
  tags JSONB DEFAULT '[]'::jsonb,
  assigned_to TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 10. PROCUREMENT ORDERS
CREATE TABLE IF NOT EXISTS third_energy_orders (
  id TEXT PRIMARY KEY,
  order_number TEXT UNIQUE NOT NULL,
  customer_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  items JSONB DEFAULT '[]'::jsonb,
  pricing JSONB DEFAULT '{}'::jsonb,
  status TEXT DEFAULT 'CONFIRMED',
  payment_status TEXT DEFAULT 'PENDING',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 11. INSTALLATION AUDITS & PROJECTS
CREATE TABLE IF NOT EXISTS third_energy_installations (
  id TEXT PRIMARY KEY,
  customer_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  system_size_kva NUMERIC NOT NULL,
  battery_type TEXT,
  location JSONB DEFAULT '{}'::jsonb,
  roof_type TEXT,
  electrical_phase TEXT,
  preferred_date TEXT,
  status TEXT DEFAULT 'SUBMITTED',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 12. SECURITY AUDIT LOGS
CREATE TABLE IF NOT EXISTS third_energy_audit_logs (
  id TEXT PRIMARY KEY,
  user_id TEXT,
  user_email TEXT,
  action TEXT NOT NULL,
  details JSONB DEFAULT '{}'::jsonb,
  ip_address TEXT,
  user_agent TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- INDEXES FOR MAXIMUM QUERY PERFORMANCE
CREATE INDEX IF NOT EXISTS idx_te_users_email ON third_energy_users(email);
CREATE INDEX IF NOT EXISTS idx_te_profiles_customer_id ON third_energy_customer_profiles(customer_id);
CREATE INDEX IF NOT EXISTS idx_te_systems_customer_id ON third_energy_systems(customer_id);
CREATE INDEX IF NOT EXISTS idx_te_service_customer_id ON third_energy_service_records(customer_id);
CREATE INDEX IF NOT EXISTS idx_te_maint_customer_id ON third_energy_maintenance_reminders(customer_id);
CREATE INDEX IF NOT EXISTS idx_te_warranties_customer_id ON third_energy_warranties(customer_id);
CREATE INDEX IF NOT EXISTS idx_te_documents_customer_id ON third_energy_documents(customer_id);
CREATE INDEX IF NOT EXISTS idx_te_tickets_customer_id ON third_energy_support_tickets(customer_id);
CREATE INDEX IF NOT EXISTS idx_te_tickets_number ON third_energy_support_tickets(ticket_number);
CREATE INDEX IF NOT EXISTS idx_te_leads_email ON third_energy_leads(email);
CREATE INDEX IF NOT EXISTS idx_te_orders_number ON third_energy_orders(order_number);
