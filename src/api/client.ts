/**
 * Authoritative API Client for Ala El Saree
 * Connects all 4 frontend applications to /api/v1 backend
 */

const BASE_URL = '/api/v1';

function getToken(): string | null {
  try {
    return localStorage.getItem('alasaree_auth_token') || null;
  } catch {
    return null;
  }
}

function snakeToCamel(str: string): string {
  return str.replace(/_([a-z0-9])/g, (_, letter) => letter.toUpperCase());
}

function normalizeObject(data: any): any {
  if (data === null || data === undefined || typeof data !== 'object') {
    return data;
  }
  if (Array.isArray(data)) {
    return data.map(normalizeObject);
  }

  const result: Record<string, any> = { ...data };
  for (const key of Object.keys(data)) {
    const value = data[key];
    const camelKey = snakeToCamel(key);
    const normalizedValue = normalizeObject(value);
    result[key] = normalizedValue;
    if (camelKey !== key && result[camelKey] === undefined) {
      result[camelKey] = normalizedValue;
    }
  }

  if (typeof result.services === 'string' && (result.services.startsWith('[') || result.services.startsWith('{'))) {
    try {
      result.services = JSON.parse(result.services);
    } catch {
      // Keep as string
    }
  }

  return result;
}

async function request<T = any>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const token = getToken();
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string>)
  };

  if (token && !headers['Authorization']) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  // Active persona header simulation if stored
  try {
    const activePersona = localStorage.getItem('alasaree_active_persona');
    if (activePersona) {
      const p = JSON.parse(activePersona);
      if (p.id) headers['x-user-id'] = p.id;
      if (p.role) headers['x-user-role'] = p.role;
      if (p.merchantId) headers['x-merchant-id'] = p.merchantId;
      if (p.driverId) headers['x-driver-id'] = p.driverId;
      if (p.name) headers['x-user-name'] = encodeURIComponent(p.name);
    }
  } catch {
    // Ignore
  }

  const response = await fetch(`${BASE_URL}${endpoint}`, {
    ...options,
    headers
  });

  const rawData = await response.json().catch(() => ({}));

  if (!response.ok) {
    const errorMessage = rawData?.error?.message || `HTTP error ${response.status}`;
    const err = new Error(errorMessage);
    (err as any).code = rawData?.error?.code;
    (err as any).status = response.status;
    throw err;
  }

  return normalizeObject(rawData) as T;
}

export const api = {
  // Auth
  auth: {
    requestOtp: (phone: string) => request<{ success: boolean; devHintCode?: string }>('/auth/request-otp', {
      method: 'POST',
      body: JSON.stringify({ phone })
    }),
    verifyOtp: (phone: string, code: string, name?: string) => request<{ success: boolean; token: string; user: any }>('/auth/verify-otp', {
      method: 'POST',
      body: JSON.stringify({ phone, code, name })
    }),
    loginMerchant: (merchantId: string, pinCode?: string, staffName?: string) => request<{ success: boolean; token: string; merchant: any; staff: any }>('/auth/login-merchant', {
      method: 'POST',
      body: JSON.stringify({ merchantId, pinCode, staffName })
    }),
    getMe: () => request<{ user: any }>('/auth/me'),
    getPersonas: () => request<{ personas: any[] }>('/auth/personas')
  },

  // Merchants
  merchants: {
    list: (params?: { city?: string; status?: string }) => {
      const query = new URLSearchParams(params as any).toString();
      return request<{ merchants: any[] }>(`/merchants${query ? `?${query}` : ''}`);
    },
    getById: (id: string) => request<{ merchant: any }>(`/merchants/${id}`),
    updateStatus: (id: string, updates: { isAcceptingOrders?: boolean; capacityBagsPerDay?: number; activeHours?: string }) =>
      request<{ success: boolean; merchant: any }>(`/merchants/${id}/status`, {
        method: 'PUT',
        body: JSON.stringify(updates)
      }),
    getFinancials: (id: string) => request<any>(`/merchants/${id}/financials`)
  },

  // Applications
  applications: {
    submit: (appData: any) => request<{ success: boolean; referenceNumber: string; application: any }>('/merchant-applications', {
      method: 'POST',
      body: JSON.stringify(appData)
    }),
    list: (status?: string) => request<{ applications: any[] }>(`/merchant-applications${status ? `?status=${status}` : ''}`),
    review: (id: string, reviewData: { status?: string; reviewerNotes?: string; decisionReason?: string; onboardingStage?: string }) =>
      request<{ success: boolean; application: any }>(`/merchant-applications/${id}/review`, {
        method: 'PUT',
        body: JSON.stringify(reviewData)
      })
  },

  // Services Catalog
  catalog: {
    list: () => request<{ categories: any[]; services: any[] }>('/services'),
    getMerchantCatalog: (merchantId: string) => request<{ merchantId: string; services: any[] }>(`/services/merchant/${merchantId}`),
    updatePrice: (merchantId: string, data: { serviceId: string; washIronPrice?: number; dryCleanPrice?: number; ironOnlyPrice?: number; isAvailable?: boolean }) =>
      request<{ success: boolean }>('/services/merchant/' + merchantId + '/price', {
        method: 'PUT',
        body: JSON.stringify(data)
      })
  },

  // Orders
  orders: {
    list: (params?: { status?: string; merchantId?: string; customerId?: string; search?: string }) => {
      const query = new URLSearchParams(params as any).toString();
      return request<{ orders: any[] }>(`/orders${query ? `?${query}` : ''}`);
    },
    getById: (id: string) => request<{ order: any }>(`/orders/${id}`),
    create: (orderData: any) => request<{ success: boolean; order: any }>('/orders', {
      method: 'POST',
      body: JSON.stringify(orderData)
    }),
    updateStatus: (id: string, status: string, note?: string) => request<{ success: boolean; order: any }>(`/orders/${id}/status`, {
      method: 'PUT',
      body: JSON.stringify({ status, note })
    })
  },

  // Inspections
  inspections: {
    recordIntake: (orderId: string, data: { inspectedItems: any[]; discrepancyReason?: string; extraChargeEgp?: number; requiresCustomerApproval?: boolean }) =>
      request<{ success: boolean; order: any }>(`/inspections/${orderId}/intake`, {
        method: 'POST',
        body: JSON.stringify(data)
      }),
    approvePrice: (orderId: string, approved: boolean) =>
      request<{ success: boolean; order: any }>(`/inspections/${orderId}/approve-price`, {
        method: 'POST',
        body: JSON.stringify({ approved })
      }),
    recordPhoto: (orderId: string, photoData: { orderItemId?: string; photoType: string; photoUrl: string; notes?: string }) =>
      request<{ success: boolean; photo: any }>(`/inspections/${orderId}/photos`, {
        method: 'POST',
        body: JSON.stringify(photoData)
      })
  },

  // Delivery
  delivery: {
    getTasks: (params?: { status?: string; driverId?: string; zone?: string; jobType?: string }) => {
      const query = new URLSearchParams(params as any).toString();
      return request<{ tasks: any[] }>(`/delivery/tasks${query ? `?${query}` : ''}`);
    },
    assignTask: (taskId: string, driverId: string) => request<{ success: boolean; task: any }>(`/delivery/tasks/${taskId}/assign`, {
      method: 'POST',
      body: JSON.stringify({ driverId })
    }),
    updateTaskStatus: (taskId: string, data: { status: string; proofNote?: string; proofPhotoUrl?: string; cashCollected?: boolean }) =>
      request<{ success: boolean; task: any }>(`/delivery/tasks/${taskId}/status`, {
        method: 'PUT',
        body: JSON.stringify(data)
      }),
    getDrivers: () => request<{ drivers: any[] }>('/delivery/drivers')
  },

  // Finance
  finance: {
    getAccounts: () => request<{ accounts: any[] }>('/finance/accounts'),
    getLedger: (orderId?: string) => request<{ entries: any[]; totals: any }>(`/finance/ledger${orderId ? `?orderId=${orderId}` : ''}`),
    getSettlements: (merchantId?: string) => request<{ settlements: any[] }>(`/finance/settlements${merchantId ? `?merchantId=${merchantId}` : ''}`),
    generateSettlement: (merchantId: string, periodStart?: string, periodEnd?: string) =>
      request<{ success: boolean; statement: any }>('/finance/settlements/generate', {
        method: 'POST',
        body: JSON.stringify({ merchantId, periodStart, periodEnd })
      }),
    payoutSettlement: (id: string, payoutReference?: string) =>
      request<{ success: boolean; statement: any }>(`/finance/settlements/${id}/payout`, {
        method: 'PUT',
        body: JSON.stringify({ payoutReference })
      })
  },

  // Customers
  customers: {
    getAddresses: () => request<{ addresses: any[] }>('/customers/addresses'),
    addAddress: (address: any) => request<{ success: boolean; address: any }>('/customers/addresses', {
      method: 'POST',
      body: JSON.stringify(address)
    }),
    deleteAddress: (id: string) => request<{ success: boolean }>(`/customers/addresses/${id}`, {
      method: 'DELETE'
    })
  },

  // System
  system: {
    getHealth: () => request<any>('/system/health'),
    getSettings: () => request<{ settings: Record<string, string> }>('/system/settings'),
    updateSetting: (key: string, value: string) => request<{ success: boolean }>('/system/settings', {
      method: 'PUT',
      body: JSON.stringify({ key, value })
    }),
    getAuditLogs: () => request<{ logs: any[] }>('/system/audit-logs'),
    getSupportTickets: () => request<{ tickets: any[] }>('/system/support-tickets')
  }
};
