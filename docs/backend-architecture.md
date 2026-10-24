# Ala El Saree (عالسريع) — Authoritative Backend Architecture & Engineering Report

## 1. Executive Summary & Mission
This document details the production-ready, modular monolith backend for **Ala El Saree** (عالسريع), the premier Egyptian laundry marketplace connecting:
1. **Customers** (Customer Mobile Application — Port `5174`)
2. **Corporate & Prospective Laundries** (Public Marketing Website — Port `1000`)
3. **Central Operations & Dispatch** (Platform Supervision Console — Port `3000`)
4. **Merchant Laundries** (Lightweight Counter Intake Portal — Port `5000`)

The backend serves all four experiences through a unified data and business logic layer mounted at `/api/v1` on Port `3000` via Express and TypeScript.

---

## 2. Architecture & Module Boundaries (Modular Monolith)

```
                         [ Frontend Applications ]
    Customer App (5174) | Landing Site (1000) | Central Ops (3000) | Merchant Portal (5000)
                                    │
                                    ▼ HTTP / JSON (Bearer JWT / Correlation IDs)
    ┌─────────────────────────────────────────────────────────────────────────────────┐
    │                        Express Full-Stack Server (/server.ts)                   │
    ├──────────────────┬──────────────────┬─────────────────────┬─────────────────────┤
    │  Auth & Identity │  Merchants & Hub │ Services & Pricing  │ Orders & Life-cycle │
    │  (/api/v1/auth)  │ (/api/v1/merchants│ (/api/v1/services)  │  (/api/v1/orders)   │
    ├──────────────────┼──────────────────┼─────────────────────┼─────────────────────┤
    │ Intake Inspection│ Delivery & Fleet │ Double-Entry Ledger │ Applications Review │
    │(/api/v1/inspect) │(/api/v1/delivery)│ (/api/v1/finance)   │(/api/v1/merchant-..)│
    └──────────────────┴──────────────────┴─────────────────────┴─────────────────────┘
                                    │
                                    ▼ SQL / Transaction Boundary
    ┌─────────────────────────────────────────────────────────────────────────────────┐
    │               Authoritative Relational Database (data/alasaree.sqlite)           │
    │              Production DDL Migration Target: PostgreSQL 15+ (UUIDs/NUMERIC)    │
    └─────────────────────────────────────────────────────────────────────────────────┘
```

---

## 3. Entity Relationship Overview (Normalized Relational Schema)

### Core Entities:
- **`users`** & **`roles`**: RBAC with 7 authoritative personas (`platform_admin`, `operations_manager`, `dispatcher`, `merchant_owner`, `merchant_staff`, `driver`, `customer`).
- **`customer_profiles`** & **`addresses`**: Egyptian governorate, city, district, street, building, apartment, and default flags.
- **`merchants`**: Commercial registration, tax ID, active hours, daily intake bag capacity (e.g., 60 bags/day), settlement payout details (InstaPay / IBAN).
- **`merchant_applications`**: Inbound partnership proposals from the public marketing site with reviewer audit fields.
- **`service_categories`** & **`services`**: Garment catalog with base wash/iron, dry clean, and iron prices.
- **`merchant_service_prices`**: Per-branch price overrides and availability flags.
- **`orders`** & **`order_items`**: Authoritative lifecycle state, unit price, quantity, received quantity, stain/damage notes.
- **`order_item_photos`**: Categorized evidence photos (customer reference, intake inspection, damage evidence, delivery proof).
- **`price_adjustments`**: Discrepancy logs with customer approval loop (`pending`, `approved`, `rejected`).
- **`delivery_tasks`**: Decoupled pickup and return delivery legs with assigned driver, attempt counts, proof notes, and COD cash tracking.
- **`drivers`**: Fleet roster with zone, motorcycle/van vehicle type, completed trips, and cash-in-hand safety limits.
- **`ledger_accounts`** & **`ledger_entries`**: Balanced double-entry journal ensuring `Total Debits == Total Credits`.
- **`settlement_statements`**: Weekly merchant payouts with gross laundry, 8% commission deductions, and net transfers.
- **`platform_settings`** & **`audit_logs`**: System parameters and operational audit trails.

---

## 4. Documented Order State Machine

| Current Status | Allowed Transitions | Permitted Roles | Notes & Triggers |
|---|---|---|---|
| `awaiting_laundry_confirmation` | `accepted`, `rejected`, `inspection_required`, `cancelled` | Merchant, Admin, Customer | Initial booking placed by customer |
| `accepted` | `awaiting_pickup`, `pickup_assigned`, `cancelled` | Merchant, Dispatcher, Admin | Laundry branch confirms capacity |
| `pickup_assigned` | `collected`, `awaiting_pickup`, `cancelled` | Driver, Dispatcher | Courier assigned to collect bag from customer |
| `collected` | `received_at_laundry`, `inspection_required` | Driver, Merchant | Bag in transit to the laundry counter |
| `inspection_required` | `awaiting_customer_approval`, `processing`, `rejected` | Merchant Staff | Counter staff counts items & logs defects |
| `awaiting_customer_approval` | `processing`, `cancelled` | Customer, Admin | Triggered if item count or stain charge changes price |
| `processing` | `ready_for_delivery`, `cancelled` | Merchant Technician | Clothes sorted, washed, dried, ironed, and packaged |
| `ready_for_delivery` | `delivery_assigned`, `out_for_delivery`, `completed` | Dispatcher, Merchant | Thermal bag tag printed, bag on dispatch rack |
| `out_for_delivery` | `delivered`, `delivery_assigned` | Driver | Driver en route to customer destination |
| `delivered` | `completed` | Driver, Admin | Customer receives bag, COD collected, ledger posted |
| `completed` | *(terminal state)* | System, Admin | Order fulfilled and eligible for weekly settlement |
| `rejected` / `cancelled` | *(terminal state)* | Merchant, Customer, Admin | Cancellation with logged reason |

---

## 5. Financial Calculation & Ledger Policy

### Strict Commercial Formulae:
1. **Gross Laundry Volume** = $\sum(\text{Inspected Item Qty} \times \text{Item Price}) + \text{Extra Stain/Special Treatment Charge}$
2. **Platform Marketplace Commission (8%)** = $\text{Gross Laundry Volume} \times 0.08$
3. **Platform Fixed Service Fee** = $20\text{ EGP}$ (Charged strictly to designated payer: Customer or Merchant, never duplicated).
4. **Customer Total Paid** = $\text{Gross Laundry} + \text{Delivery Fee (25 EGP)} + (\text{Platform Fee if Customer Payer})$.
5. **Merchant Net Payable** = $\text{Gross Laundry} - \text{Commission (8%)} - (\text{Platform Fee if Merchant Payer})$.

### Balanced Double-Entry Journal Entry upon Delivery:
```
Debit:  Cash in Transit / COD Collections (Asset)             [Customer Total Paid]
Debit:  Platform Delivery Subsidy Expense (Expense, if any)    [Driver Payout - Customer Fee]
Credit: Merchants Accounts Payable (Liability)                 [Merchant Net Payable]
Credit: Driver Compensation Payable (Liability)                [Driver Total Payout]
Credit: Marketplace Commission Revenue (Revenue)               [8% Commission Amount]
Credit: Platform Service Fee Revenue (Revenue)                 [20 EGP Platform Fee]

INVARIANT ENFORCED: Sum of Debits ≡ Sum of Credits
```

---

## 6. Frontend Integration Matrix

| Application | Port | Endpoints Used | Auth Requirement | Tenant Isolation |
|---|---|---|---|---|
| **Public Landing Page** | 1000 | `POST /api/v1/merchant-applications` | Public | None |
| **Customer App** | 5174 | `POST /auth/request-otp`, `POST /auth/verify-otp`, `GET /services`, `POST /orders`, `GET /orders`, `POST /inspections/:id/approve-price` | Customer JWT | Scoped to own `customer_id` |
| **Merchant Portal** | 5000 | `POST /auth/login-merchant`, `GET /orders`, `POST /inspections/:id/intake`, `PUT /orders/:id/status`, `GET /merchants/:id/financials` | Merchant Staff JWT | Scoped strictly to own `merchant_id` |
| **Central Operations** | 3000 | `GET /merchant-applications`, `PUT /merchant-applications/:id/review`, `GET /delivery/tasks`, `POST /delivery/tasks/:id/assign`, `GET /finance/ledger`, `POST /finance/settlements/generate` | Admin/Dispatcher JWT | System-wide supervision |

---

## 7. Automated Test Suite Results

Automated test runner executed via `npx tsx server/tests/runAllTests.ts`:
- **Database Initialization & Seeds**: 4 tests passed.
- **Order State Machine Transitions & Role Validation**: 5 tests passed.
- **Financial Calculations & Double-Entry Accounting**: 6 tests passed.
- **Multi-Tenant Merchant & Role Isolation**: 1 test passed.
- **Intake Inspection & Customer Price Approval Workflow**: 3 tests passed.

**Total**: 19 Passed, 0 Failed (100% test pass rate).

---

## 8. Local Execution & Deployment

1. **Development Mode**:
   ```bash
   npm run dev
   ```
   Runs Express full-stack on Port 3000, serving the `/api/v1` API and mounting Vite SPA middlewares.
2. **Execute Automated Tests**:
   ```bash
   npm test
   ```
3. **Run Production Build**:
   ```bash
   npm run build
   npm start
   ```

---

## 9. External Services Integration Checklist for Production

- **SMS / OTP Provider**: (e.g., Twilio, VictoryLink, or Vodafone SMS Egypt) — currently running in development OTP mode with instant verification.
- **Payment Gateway**: (e.g., Paymob, Fawry, or Stripe) — currently supporting Cash On Delivery (COD) and InstaPay settlement references.
- **Object Storage**: S3-compatible bucket (e.g., Google Cloud Storage or AWS S3) for production high-resolution intake photo blobs.
