# Delivery Operations System (Phase 3 Active)

The Centralized Delivery Operations System for "عالسريع" (Ala El Saree) is fully implemented in `src/operations/`:
- **Port**: 3000 (`npm run dev`)
- **Key Modules**:
  - `src/operations/views/admin/DispatchConsoleView.tsx`: Dispatch console managing Leg 1 (Pickup from Customer to Laundry) and Leg 2 (Return delivery to Customer), unassigned tasks, workload balancing, and failed attempt logger.
  - `src/operations/views/admin/DriversFleetView.tsx`: Driver fleet directory, active jobs, and vehicle types in Zagazig and Mansoura.
  - `src/operations/views/driver/DriverTasksView.tsx`: Driver console for executing assigned pickup and drop-off tasks, status updates ("وصلت للموقع", "تم الاستلام", "تم التسليم"), and proof notes.
  - `src/operations/views/driver/DriverCashView.tsx`: Cash-on-delivery (COD) collection tracker and platform remittance ledger.

