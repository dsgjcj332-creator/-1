export const openApiSpec = {
  openapi: '3.0.3',
  info: {
    title: 'عالسريع — Ala El Saree Unified Backend API',
    version: '1.0.0',
    description: 'Production-ready REST API for Ala El Saree laundry marketplace (serving Customer App, Marketing Website, Central Operations, and Merchant Portal).'
  },
  servers: [
    {
      url: '/api/v1',
      description: 'Authoritative Platform Server'
    }
  ],
  paths: {
    '/system/health': {
      get: {
        summary: 'Service Health and Readiness Check',
        responses: {
          200: { description: 'Service is healthy' },
          503: { description: 'Service is degraded or database disconnected' }
        }
      }
    },
    '/auth/request-otp': {
      post: {
        summary: 'Request Phone OTP for customer authentication',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['phone'],
                properties: {
                  phone: { type: 'string', example: '01023456781' }
                }
              }
            }
          }
        },
        responses: {
          200: { description: 'OTP dispatched' },
          429: { description: 'Rate limit exceeded' }
        }
      }
    },
    '/auth/verify-otp': {
      post: {
        summary: 'Verify OTP code and retrieve JWT session token',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['phone', 'code'],
                properties: {
                  phone: { type: 'string', example: '01023456781' },
                  code: { type: 'string', example: '1234' }
                }
              }
            }
          }
        },
        responses: {
          200: { description: 'Authenticated successfully' },
          400: { description: 'Invalid or expired code' }
        }
      }
    },
    '/auth/login-merchant': {
      post: {
        summary: 'Direct merchant portal session authentication with branch validation',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['merchantId'],
                properties: {
                  merchantId: { type: 'string', example: 'm-zag-01' },
                  pinCode: { type: 'string', example: '1234' },
                  staffName: { type: 'string', example: 'أحمد فتحي' }
                }
              }
            }
          }
        },
        responses: {
          200: { description: 'Authenticated with merchant isolation' }
        }
      }
    },
    '/merchants': {
      get: {
        summary: 'List approved laundry partners and operating status',
        parameters: [
          { name: 'city', in: 'query', schema: { type: 'string' } },
          { name: 'status', in: 'query', schema: { type: 'string' } }
        ],
        responses: { 200: { description: 'List of merchants' } }
      }
    },
    '/orders': {
      get: {
        summary: 'List orders with tenant isolation and status filters',
        responses: { 200: { description: 'Filtered orders' } }
      },
      post: {
        summary: 'Create a new laundry order',
        responses: { 201: { description: 'Order created' } }
      }
    },
    '/orders/{id}': {
      get: {
        summary: 'Get complete order details including items, history and discrepancy',
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
        responses: { 200: { description: 'Order details' } }
      }
    },
    '/orders/{id}/status': {
      put: {
        summary: 'Transition order through authoritative lifecycle state machine',
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['status'],
                properties: {
                  status: { type: 'string', example: 'processing' },
                  note: { type: 'string' }
                }
              }
            }
          }
        },
        responses: {
          200: { description: 'Transition successful' },
          400: { description: 'Invalid transition or unauthorized role' }
        }
      }
    },
    '/inspections/{orderId}/intake': {
      post: {
        summary: 'Record merchant counter intake garment inspection & price adjustments',
        responses: { 200: { description: 'Inspection recorded' } }
      }
    },
    '/delivery/tasks': {
      get: {
        summary: 'List pickup and return delivery tasks for dispatchers and drivers',
        responses: { 200: { description: 'Delivery tasks' } }
      }
    },
    '/finance/ledger': {
      get: {
        summary: 'Auditable balanced double-entry accounting ledger entries',
        responses: { 200: { description: 'Ledger journal' } }
      }
    },
    '/merchant-applications': {
      post: {
        summary: 'Public marketing website merchant partnership application submission',
        responses: { 201: { description: 'Application received' } }
      }
    }
  }
};
