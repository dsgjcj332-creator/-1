import { Router } from 'express';
import { authRouter } from './modules/auth/authRouter';
import { merchantsRouter } from './modules/merchants/merchantsRouter';
import { applicationsRouter } from './modules/applications/applicationsRouter';
import { catalogRouter } from './modules/catalog/catalogRouter';
import { ordersRouter } from './modules/orders/ordersRouter';
import { inspectionsRouter } from './modules/inspections/inspectionsRouter';
import { deliveryRouter } from './modules/delivery/deliveryRouter';
import { financeRouter } from './modules/finance/financeRouter';
import { customersRouter } from './modules/customers/customersRouter';
import { systemRouter } from './modules/system/systemRouter';
import { openApiSpec } from './docs/openapi';

export const apiV1Router = Router();

// Mount all modular monolith domains
apiV1Router.use('/auth', authRouter);
apiV1Router.use('/merchants', merchantsRouter);
apiV1Router.use('/merchant-applications', applicationsRouter);
apiV1Router.use('/services', catalogRouter);
apiV1Router.use('/orders', ordersRouter);
apiV1Router.use('/inspections', inspectionsRouter);
apiV1Router.use('/delivery', deliveryRouter);
apiV1Router.use('/finance', financeRouter);
apiV1Router.use('/customers', customersRouter);
apiV1Router.use('/system', systemRouter);

// OpenAPI Specification JSON endpoint
apiV1Router.get('/docs', (req, res) => {
  res.json(openApiSpec);
});
