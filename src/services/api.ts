const BASE_URL = '/api/v1';

export async function fetchBrokerApi<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const token = localStorage.getItem('nestandkey_broker_token');
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers
  };

  const response = await fetch(`${BASE_URL}${endpoint}`, {
    ...options,
    headers
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || 'Broker API request failed');
  }
  return data;
}

export const brokerApi = {
  login: (email: string, password: string) =>
    fetchBrokerApi<{ success: boolean; user: any; token: string; brokerId?: string }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password })
    }),
  getMe: () => fetchBrokerApi<{ success: boolean; user: any }>('/auth/me'),
  getAnalytics: () => fetchBrokerApi<{ success: boolean; metrics: any; leadsByStatus: any[]; upcomingViewings: any[]; recentActivities: any[] }>('/analytics/broker'),
  getProperties: (params: Record<string, any> = {}) => {
    const query = new URLSearchParams(params).toString();
    return fetchBrokerApi<{ success: boolean; properties: any[]; pagination: any }>(`/properties?${query}`);
  },
  getPropertyBySlug: (slug: string) => fetchBrokerApi<{ success: boolean; property: any }>(`/properties/${slug}`),
  createProperty: (data: any) =>
    fetchBrokerApi<{ success: boolean; property: any }>('/properties', {
      method: 'POST',
      body: JSON.stringify(data)
    }),
  updateProperty: (id: string, data: any) =>
    fetchBrokerApi<{ success: boolean; property: any }>(`/properties/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data)
    }),
  getLeads: (status?: string) =>
    fetchBrokerApi<{ success: boolean; leads: any[] }>(`/leads${status ? `?status=${status}` : ''}`),
  getLeadById: (id: string) =>
    fetchBrokerApi<{ success: boolean; lead: any; activities: any[]; score: any }>(`/leads/${id}`),
  updateLeadStatus: (id: string, status: string, details?: string) =>
    fetchBrokerApi<{ success: boolean; lead: any }>(`/leads/${id}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status, details })
    }),
  addLeadNote: (id: string, note: string) =>
    fetchBrokerApi<{ success: boolean; lead: any }>(`/leads/${id}/notes`, {
      method: 'POST',
      body: JSON.stringify({ note })
    }),
  getClients: () => fetchBrokerApi<{ success: boolean; clients: any[] }>('/clients'),
  createClient: (data: any) =>
    fetchBrokerApi<{ success: boolean; client: any }>('/clients', {
      method: 'POST',
      body: JSON.stringify(data)
    }),
  getViewings: () => fetchBrokerApi<{ success: boolean; viewings: any[] }>('/viewings'),
  createViewing: (data: any) =>
    fetchBrokerApi<{ success: boolean; viewing: any }>('/viewings', {
      method: 'POST',
      body: JSON.stringify(data)
    }),
  updateViewingStatus: (id: string, status: string, notes?: string) =>
    fetchBrokerApi<{ success: boolean; viewing: any }>(`/viewings/${id}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status, brokerNotes: notes })
    }),
  getCommissions: () =>
    fetchBrokerApi<{ success: boolean; commissions: any[]; metrics: any }>('/commissions'),
  createCommission: (data: any) =>
    fetchBrokerApi<{ success: boolean; commission: any }>('/commissions', {
      method: 'POST',
      body: JSON.stringify(data)
    }),
  getProfile: () => fetchBrokerApi<{ success: boolean; broker: any; properties: any[] }>('/brokers/profile')
};
