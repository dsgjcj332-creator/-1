-- ============================================================
-- ALA EL SAREE (عالسريع) - PRODUCTION POSTGRESQL DDL SPECIFICATION
-- Full PostgreSQL 15+ Schema with UUIDs, NUMERIC(10,2), TIMESTAMPTZ, and Foreign Keys
-- ============================================================

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. USERS & ROLES
CREATE TABLE IF NOT EXISTS roles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(50) NOT NULL UNIQUE,
  description TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  phone VARCHAR(20) NOT NULL UNIQUE,
  name VARCHAR(150) NOT NULL,
  email VARCHAR(255),
  password_hash VARCHAR(255),
  role_id UUID NOT NULL REFERENCES roles(id),
  merchant_id UUID,
  driver_id UUID,
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS customer_profiles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL UNIQUE REFERENCES users(id) ON DELETE CASCADE,
  full_name VARCHAR(150) NOT NULL,
  phone VARCHAR(20) NOT NULL,
  default_address_id UUID,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS addresses (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  customer_id UUID NOT NULL REFERENCES customer_profiles(id) ON DELETE CASCADE,
  title VARCHAR(100) NOT NULL,
  governorate VARCHAR(100) NOT NULL,
  city VARCHAR(100) NOT NULL,
  district VARCHAR(100) NOT NULL,
  street VARCHAR(255) NOT NULL,
  building_no VARCHAR(50),
  floor_no VARCHAR(50),
  apartment_no VARCHAR(50),
  landmark TEXT,
  is_default BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 2. MERCHANTS & BRANCHES
CREATE TABLE IF NOT EXISTS merchants (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name_ar VARCHAR(200) NOT NULL,
  name_en VARCHAR(200) NOT NULL,
  commercial_reg_no VARCHAR(100) NOT NULL,
  tax_number VARCHAR(100) NOT NULL,
  owner_name VARCHAR(150) NOT NULL,
  phone VARCHAR(20) NOT NULL,
  governorate VARCHAR(100) NOT NULL,
  city VARCHAR(100) NOT NULL,
  district VARCHAR(100) NOT NULL,
  address TEXT NOT NULL,
  status VARCHAR(30) NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'suspended', 'onboarding')),
  commission_rate NUMERIC(5, 4) NOT NULL DEFAULT 0.0800, -- 8%
  service_fee_payer VARCHAR(20) NOT NULL DEFAULT 'customer' CHECK (service_fee_payer IN ('customer', 'merchant')),
  capacity_bags_per_day INTEGER NOT NULL DEFAULT 60,
  active_hours VARCHAR(100) NOT NULL DEFAULT '08:00 AM - 11:00 PM',
  payout_method VARCHAR(50) NOT NULL DEFAULT 'instapay',
  payout_details TEXT NOT NULL,
  rating NUMERIC(3, 2) NOT NULL DEFAULT 4.80,
  total_orders_fulfilled INTEGER NOT NULL DEFAULT 0,
  is_accepting_orders BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS merchant_applications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  reference_number VARCHAR(50) NOT NULL UNIQUE,
  applicant_name VARCHAR(150) NOT NULL,
  business_name VARCHAR(200) NOT NULL,
  mobile VARCHAR(20) NOT NULL,
  governorate VARCHAR(100) NOT NULL,
  city VARCHAR(100) NOT NULL,
  address TEXT NOT NULL,
  services JSONB NOT NULL DEFAULT '[]'::jsonb,
  operating_status VARCHAR(100) NOT NULL,
  contact_method VARCHAR(50) NOT NULL,
  email VARCHAR(255),
  whatsapp VARCHAR(20),
  website VARCHAR(255),
  capacity VARCHAR(100),
  notes TEXT,
  privacy_consent BOOLEAN NOT NULL DEFAULT TRUE,
  status VARCHAR(30) NOT NULL DEFAULT 'new' CHECK (status IN ('new', 'under_review', 'info_requested', 'approved', 'rejected')),
  reviewed_by VARCHAR(150),
  reviewer_notes TEXT,
  decision_reason TEXT,
  onboarding_stage VARCHAR(50) DEFAULT 'pending_docs',
  received_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 3. SERVICES CATALOG & PRICING
CREATE TABLE IF NOT EXISTS service_categories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name_ar VARCHAR(100) NOT NULL,
  name_en VARCHAR(100) NOT NULL,
  display_order INTEGER NOT NULL DEFAULT 0
);

CREATE TABLE IF NOT EXISTS services (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  category_id UUID NOT NULL REFERENCES service_categories(id),
  name_ar VARCHAR(150) NOT NULL,
  name_en VARCHAR(150) NOT NULL,
  base_wash_iron_price INTEGER NOT NULL, -- minor units (piastres) or EGP
  base_dry_clean_price INTEGER,
  base_iron_only_price INTEGER,
  est_duration_hours INTEGER NOT NULL DEFAULT 8,
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 4. ORDERS & ITEM DETAILS
CREATE TABLE IF NOT EXISTS orders (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_number VARCHAR(50) NOT NULL UNIQUE,
  customer_id UUID NOT NULL REFERENCES customer_profiles(id),
  customer_name VARCHAR(150) NOT NULL,
  customer_phone VARCHAR(20) NOT NULL,
  merchant_id UUID NOT NULL REFERENCES merchants(id),
  merchant_name VARCHAR(200) NOT NULL,
  city VARCHAR(100) NOT NULL,
  neighborhood VARCHAR(100) NOT NULL,
  pickup_address TEXT NOT NULL,
  delivery_address TEXT NOT NULL,
  status VARCHAR(40) NOT NULL DEFAULT 'awaiting_laundry_confirmation',
  payment_status VARCHAR(30) NOT NULL DEFAULT 'pending',
  payment_method VARCHAR(30) NOT NULL DEFAULT 'cash_on_delivery',
  laundry_subtotal INTEGER NOT NULL,
  adjustments_total INTEGER NOT NULL DEFAULT 0,
  commission_rate NUMERIC(5, 4) NOT NULL DEFAULT 0.0800,
  commission_amount INTEGER NOT NULL DEFAULT 0,
  platform_fee INTEGER NOT NULL DEFAULT 20,
  platform_fee_payer VARCHAR(20) NOT NULL DEFAULT 'customer',
  delivery_fee_customer INTEGER NOT NULL DEFAULT 25,
  driver_payout_pickup INTEGER NOT NULL DEFAULT 20,
  driver_payout_delivery INTEGER NOT NULL DEFAULT 20,
  customer_total_paid INTEGER NOT NULL,
  merchant_payable_amount INTEGER NOT NULL,
  is_settled BOOLEAN NOT NULL DEFAULT FALSE,
  settlement_id UUID,
  special_instructions TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS order_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  service_id UUID REFERENCES services(id),
  name_ar VARCHAR(150) NOT NULL,
  name_en VARCHAR(150) NOT NULL,
  service_type VARCHAR(30) NOT NULL,
  quantity INTEGER NOT NULL,
  unit_price INTEGER NOT NULL,
  subtotal INTEGER NOT NULL,
  received_quantity INTEGER,
  stain_damage_notes TEXT,
  condition_status VARCHAR(30) DEFAULT 'good',
  fragrance VARCHAR(50),
  starch VARCHAR(50),
  packaging VARCHAR(50),
  customer_notes TEXT
);

CREATE TABLE IF NOT EXISTS order_item_photos (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  order_item_id UUID REFERENCES order_items(id),
  uploaded_by_user_id UUID NOT NULL REFERENCES users(id),
  photo_type VARCHAR(50) NOT NULL,
  storage_key VARCHAR(255) NOT NULL,
  photo_url TEXT NOT NULL,
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS order_status_history (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  from_status VARCHAR(40),
  to_status VARCHAR(40) NOT NULL,
  actor_name VARCHAR(150) NOT NULL,
  actor_role VARCHAR(50) NOT NULL,
  note TEXT,
  timestamp TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 5. DELIVERY & FLEET DISPATCH
CREATE TABLE IF NOT EXISTS drivers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  driver_code VARCHAR(50) NOT NULL UNIQUE,
  name VARCHAR(150) NOT NULL,
  mobile VARCHAR(20) NOT NULL UNIQUE,
  service_zone VARCHAR(100) NOT NULL,
  vehicle_type VARCHAR(30) NOT NULL DEFAULT 'motorcycle',
  status VARCHAR(30) NOT NULL DEFAULT 'available',
  cash_in_hand_egp INTEGER NOT NULL DEFAULT 0,
  max_cash_limit_egp INTEGER NOT NULL DEFAULT 1500,
  completed_jobs_count INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS delivery_tasks (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  job_reference VARCHAR(50) NOT NULL UNIQUE,
  order_id UUID NOT NULL REFERENCES orders(id),
  order_number VARCHAR(50) NOT NULL,
  job_type VARCHAR(30) NOT NULL, -- pickup, return_delivery
  origin_name VARCHAR(150) NOT NULL,
  origin_address TEXT NOT NULL,
  origin_phone VARCHAR(20) NOT NULL,
  destination_name VARCHAR(150) NOT NULL,
  destination_address TEXT NOT NULL,
  destination_phone VARCHAR(20) NOT NULL,
  service_zone VARCHAR(100) NOT NULL,
  scheduled_window VARCHAR(100) NOT NULL,
  status VARCHAR(30) NOT NULL DEFAULT 'awaiting_assignment',
  assigned_driver_id UUID REFERENCES drivers(id),
  attempt_count INTEGER NOT NULL DEFAULT 0,
  failure_reason TEXT,
  proof_note TEXT,
  proof_photo_url TEXT,
  cash_to_collect_egp INTEGER NOT NULL DEFAULT 0,
  cash_collected BOOLEAN NOT NULL DEFAULT FALSE,
  assigned_at TIMESTAMPTZ,
  completed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 6. FINANCIAL LEDGER & DOUBLE-ENTRY
CREATE TABLE IF NOT EXISTS ledger_accounts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  account_code VARCHAR(50) NOT NULL UNIQUE,
  account_name VARCHAR(150) NOT NULL,
  account_type VARCHAR(30) NOT NULL CHECK (account_type IN ('asset', 'liability', 'equity', 'revenue', 'expense')),
  balance_egp INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS ledger_entries (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  transaction_ref VARCHAR(100) NOT NULL,
  order_id UUID REFERENCES orders(id),
  account_id UUID NOT NULL REFERENCES ledger_accounts(id),
  entry_type VARCHAR(10) NOT NULL CHECK (entry_type IN ('debit', 'credit')),
  amount_egp INTEGER NOT NULL,
  narration TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS settlement_statements (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  statement_number VARCHAR(50) NOT NULL UNIQUE,
  merchant_id UUID NOT NULL REFERENCES merchants(id),
  period_start TIMESTAMPTZ NOT NULL,
  period_end TIMESTAMPTZ NOT NULL,
  total_orders_count INTEGER NOT NULL,
  gross_laundry_volume_egp INTEGER NOT NULL,
  commission_deducted_egp INTEGER NOT NULL,
  platform_fees_deducted_egp INTEGER NOT NULL DEFAULT 0,
  net_payable_egp INTEGER NOT NULL,
  status VARCHAR(30) NOT NULL DEFAULT 'calculated',
  payout_method VARCHAR(50) NOT NULL,
  payout_reference VARCHAR(100),
  generated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  paid_at TIMESTAMPTZ
);
