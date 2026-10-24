-- ============================================================
-- ALA EL SAREE (عالسريع) - AUTHORITATIVE RELATIONAL DATABASE SCHEMA
-- PostgreSQL compatible
-- ============================================================

-- 1. USERS & ROLES
CREATE TABLE IF NOT EXISTS roles (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  description TEXT,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS users (
  id TEXT PRIMARY KEY,
  phone TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  email TEXT,
  password_hash TEXT,
  role_id TEXT NOT NULL REFERENCES roles(id),
  merchant_id TEXT,
  driver_id TEXT,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS customer_profiles (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL UNIQUE REFERENCES users(id),
  full_name TEXT NOT NULL,
  phone TEXT NOT NULL,
  default_address_id TEXT,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS addresses (
  id TEXT PRIMARY KEY,
  customer_id TEXT NOT NULL REFERENCES customer_profiles(id),
  title TEXT NOT NULL,
  governorate TEXT NOT NULL,
  city TEXT NOT NULL,
  district TEXT NOT NULL,
  street TEXT NOT NULL,
  building_no TEXT,
  floor_no TEXT,
  apartment_no TEXT,
  landmark TEXT,
  is_default BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- 2. MERCHANTS & BRANCHES
CREATE TABLE IF NOT EXISTS merchants (
  id TEXT PRIMARY KEY,
  name_ar TEXT NOT NULL,
  name_en TEXT NOT NULL,
  commercial_reg_no TEXT NOT NULL,
  tax_number TEXT NOT NULL,
  owner_name TEXT NOT NULL,
  phone TEXT NOT NULL,
  governorate TEXT NOT NULL,
  city TEXT NOT NULL,
  district TEXT NOT NULL,
  address TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'active', -- active, suspended, onboarding
  commission_rate REAL NOT NULL DEFAULT 0.08, -- 8%
  service_fee_payer TEXT NOT NULL DEFAULT 'customer', -- customer or merchant
  capacity_bags_per_day INTEGER NOT NULL DEFAULT 60,
  active_hours TEXT NOT NULL DEFAULT '08:00 AM - 11:00 PM',
  payout_method TEXT NOT NULL DEFAULT 'instapay', -- instapay, bank_transfer
  payout_details TEXT NOT NULL,
  rating REAL NOT NULL DEFAULT 4.8,
  total_orders_fulfilled INTEGER NOT NULL DEFAULT 0,
  is_accepting_orders BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS merchant_applications (
  id TEXT PRIMARY KEY,
  reference_number TEXT NOT NULL UNIQUE,
  applicant_name TEXT NOT NULL,
  business_name TEXT NOT NULL,
  mobile TEXT NOT NULL,
  governorate TEXT NOT NULL,
  city TEXT NOT NULL,
  address TEXT NOT NULL,
  services TEXT NOT NULL, -- JSON string or comma-separated
  operating_status TEXT NOT NULL,
  contact_method TEXT NOT NULL,
  email TEXT,
  whatsapp TEXT,
  website TEXT,
  capacity TEXT,
  notes TEXT,
  privacy_consent BOOLEAN NOT NULL DEFAULT true,
  status TEXT NOT NULL DEFAULT 'new', -- new, under_review, info_requested, approved, rejected
  reviewed_by TEXT,
  reviewer_notes TEXT,
  decision_reason TEXT,
  onboarding_stage TEXT DEFAULT 'pending_docs',
  received_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- 3. SERVICES CATALOG & PRICING
CREATE TABLE IF NOT EXISTS service_categories (
  id TEXT PRIMARY KEY,
  name_ar TEXT NOT NULL,
  name_en TEXT NOT NULL,
  display_order INTEGER NOT NULL DEFAULT 0
);

CREATE TABLE IF NOT EXISTS services (
  id TEXT PRIMARY KEY,
  category_id TEXT NOT NULL REFERENCES service_categories(id),
  name_ar TEXT NOT NULL,
  name_en TEXT NOT NULL,
  base_wash_iron_price INTEGER NOT NULL, -- in minor currency (pennies/piastres) or whole EGP
  base_dry_clean_price INTEGER,
  base_iron_only_price INTEGER,
  est_duration_hours INTEGER NOT NULL DEFAULT 2,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS merchant_service_prices (
  id TEXT PRIMARY KEY,
  merchant_id TEXT NOT NULL REFERENCES merchants(id),
  service_id TEXT NOT NULL REFERENCES services(id),
  wash_iron_price INTEGER NOT NULL,
  dry_clean_price INTEGER,
  iron_only_price INTEGER,
  is_available BOOLEAN NOT NULL DEFAULT true,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(merchant_id, service_id)
);

-- 4. ORDERS & ITEM DETAILS
CREATE TABLE IF NOT EXISTS orders (
  id TEXT PRIMARY KEY,
  order_number TEXT NOT NULL UNIQUE,
  customer_id TEXT NOT NULL REFERENCES users(id),
  customer_name TEXT NOT NULL,
  customer_phone TEXT NOT NULL,
  merchant_id TEXT NOT NULL REFERENCES merchants(id),
  merchant_name TEXT NOT NULL,
  city TEXT NOT NULL,
  neighborhood TEXT NOT NULL,
  pickup_address TEXT NOT NULL,
  delivery_address TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'awaiting_laundry_confirmation',
  payment_status TEXT NOT NULL DEFAULT 'cod_pending',
  payment_method TEXT NOT NULL DEFAULT 'cash_on_delivery',
  cod_amount INTEGER NOT NULL DEFAULT 0,
  cod_collected_at TIMESTAMP,
  laundry_subtotal INTEGER NOT NULL, -- EGP
  adjustments_total INTEGER NOT NULL DEFAULT 0,
  commission_rate REAL NOT NULL DEFAULT 0.08,
  commission_amount INTEGER NOT NULL DEFAULT 0,
  platform_fee INTEGER NOT NULL DEFAULT 20,
  platform_fee_payer TEXT NOT NULL DEFAULT 'customer',
  delivery_fee_customer INTEGER NOT NULL DEFAULT 25,
  driver_payout_pickup INTEGER NOT NULL DEFAULT 20,
  driver_payout_delivery INTEGER NOT NULL DEFAULT 20,
  customer_total_paid INTEGER NOT NULL,
  merchant_payable_amount INTEGER NOT NULL,
  is_settled BOOLEAN NOT NULL DEFAULT false,
  settlement_id TEXT,
  special_instructions TEXT,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS order_items (
  id TEXT PRIMARY KEY,
  order_id TEXT NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  service_id TEXT,
  name_ar TEXT NOT NULL,
  name_en TEXT NOT NULL,
  service_type TEXT NOT NULL, -- wash_iron, dry_clean, iron_only
  quantity INTEGER NOT NULL,
  unit_price INTEGER NOT NULL,
  subtotal INTEGER NOT NULL,
  received_quantity INTEGER,
  stain_damage_notes TEXT,
  condition_status TEXT DEFAULT 'good',
  fragrance TEXT,
  starch TEXT,
  packaging TEXT,
  customer_notes TEXT
);

CREATE TABLE IF NOT EXISTS order_item_photos (
  id TEXT PRIMARY KEY,
  order_id TEXT NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  order_item_id TEXT REFERENCES order_items(id),
  uploaded_by_user_id TEXT NOT NULL,
  photo_type TEXT NOT NULL, -- customer_reference, intake_inspection, damage_evidence, completed_evidence
  storage_key TEXT NOT NULL,
  photo_url TEXT NOT NULL,
  notes TEXT,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS order_status_history (
  id TEXT PRIMARY KEY,
  order_id TEXT NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  from_status TEXT,
  to_status TEXT NOT NULL,
  actor_name TEXT NOT NULL,
  actor_role TEXT NOT NULL,
  note TEXT,
  timestamp TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS price_adjustments (
  id TEXT PRIMARY KEY,
  order_id TEXT NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  detected_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  reported_by TEXT NOT NULL,
  original_subtotal INTEGER NOT NULL,
  revised_subtotal INTEGER NOT NULL,
  difference_egp INTEGER NOT NULL,
  reason TEXT NOT NULL,
  customer_approval_status TEXT NOT NULL DEFAULT 'not_required', -- not_required, pending, approved, rejected
  customer_responded_at TEXT,
  notes TEXT
);

-- 5. DELIVERY & FLEET DISPATCH
CREATE TABLE IF NOT EXISTS drivers (
  id TEXT PRIMARY KEY,
  driver_code TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  mobile TEXT NOT NULL UNIQUE,
  service_zone TEXT NOT NULL,
  vehicle_type TEXT NOT NULL DEFAULT 'motorcycle',
  status TEXT NOT NULL DEFAULT 'available', -- available, busy, off_duty
  cash_in_hand_egp INTEGER NOT NULL DEFAULT 0,
  max_cash_limit_egp INTEGER NOT NULL DEFAULT 1500,
  completed_jobs_count INTEGER NOT NULL DEFAULT 0,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS delivery_tasks (
  id TEXT PRIMARY KEY,
  job_reference TEXT NOT NULL UNIQUE,
  order_id TEXT NOT NULL REFERENCES orders(id),
  order_number TEXT NOT NULL,
  job_type TEXT NOT NULL, -- pickup, return_delivery
  origin_name TEXT NOT NULL,
  origin_address TEXT NOT NULL,
  origin_phone TEXT NOT NULL,
  destination_name TEXT NOT NULL,
  destination_address TEXT NOT NULL,
  destination_phone TEXT NOT NULL,
  service_zone TEXT NOT NULL,
  scheduled_window TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'awaiting_assignment', -- awaiting_assignment, assigned, driver_accepted, en_route_pickup, arrived_pickup, completed, attempt_failed
  assigned_driver_id TEXT REFERENCES drivers(id),
  attempt_count INTEGER NOT NULL DEFAULT 0,
  failure_reason TEXT,
  proof_note TEXT,
  proof_photo_url TEXT,
  cash_to_collect_egp INTEGER NOT NULL DEFAULT 0,
  cash_collected INTEGER NOT NULL DEFAULT 0,
  assigned_at TEXT,
  completed_at TEXT,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- 6. FINANCIAL LEDGER & SETTLEMENTS
CREATE TABLE IF NOT EXISTS ledger_accounts (
  id TEXT PRIMARY KEY,
  account_code TEXT NOT NULL UNIQUE,
  account_name TEXT NOT NULL,
  account_type TEXT NOT NULL, -- asset, liability, equity, revenue, expense
  balance_egp INTEGER NOT NULL DEFAULT 0,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS ledger_entries (
  id TEXT PRIMARY KEY,
  transaction_ref TEXT NOT NULL,
  order_id TEXT REFERENCES orders(id),
  account_id TEXT NOT NULL REFERENCES ledger_accounts(id),
  entry_type TEXT NOT NULL, -- debit, credit
  amount_egp INTEGER NOT NULL,
  narration TEXT NOT NULL,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS settlement_statements (
  id TEXT PRIMARY KEY,
  statement_number TEXT NOT NULL UNIQUE,
  merchant_id TEXT NOT NULL REFERENCES merchants(id),
  period_start TEXT NOT NULL,
  period_end TEXT NOT NULL,
  total_orders_count INTEGER NOT NULL,
  gross_laundry_volume_egp INTEGER NOT NULL,
  commission_deducted_egp INTEGER NOT NULL,
  platform_fees_deducted_egp INTEGER NOT NULL DEFAULT 0,
  net_payable_egp INTEGER NOT NULL,
  status TEXT NOT NULL DEFAULT 'calculated', -- calculated, approved, paid
  payout_method TEXT NOT NULL,
  payout_reference TEXT,
  generated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  paid_at TEXT
);

-- 7. AUDIT LOGS, SETTINGS & SUPPORT
CREATE TABLE IF NOT EXISTS audit_logs (
  id TEXT PRIMARY KEY,
  actor_user_id TEXT,
  actor_name TEXT NOT NULL,
  actor_role TEXT NOT NULL,
  action TEXT NOT NULL,
  entity_type TEXT NOT NULL,
  entity_id TEXT NOT NULL,
  details TEXT,
  ip_address TEXT,
  timestamp TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS support_tickets (
  id TEXT PRIMARY KEY,
  ticket_number TEXT NOT NULL UNIQUE,
  order_id TEXT REFERENCES orders(id),
  customer_name TEXT NOT NULL,
  customer_phone TEXT NOT NULL,
  category TEXT NOT NULL,
  priority TEXT NOT NULL DEFAULT 'medium',
  status TEXT NOT NULL DEFAULT 'open',
  subject TEXT NOT NULL,
  details TEXT NOT NULL,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS platform_settings (
  key TEXT PRIMARY KEY,
  value TEXT NOT NULL,
  description TEXT,
  updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- INDEXES FOR FAST PERFORMANCE
CREATE INDEX IF NOT EXISTS idx_orders_customer_id ON orders(customer_id);
CREATE INDEX IF NOT EXISTS idx_orders_merchant_id ON orders(merchant_id);
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);
CREATE INDEX IF NOT EXISTS idx_order_items_order_id ON order_items(order_id);
CREATE INDEX IF NOT EXISTS idx_delivery_tasks_order_id ON delivery_tasks(order_id);
CREATE INDEX IF NOT EXISTS idx_delivery_tasks_driver_id ON delivery_tasks(assigned_driver_id);
CREATE INDEX IF NOT EXISTS idx_delivery_tasks_status ON delivery_tasks(status);
CREATE INDEX IF NOT EXISTS idx_ledger_entries_order_id ON ledger_entries(order_id);
CREATE INDEX IF NOT EXISTS idx_ledger_entries_account_id ON ledger_entries(account_id);
