const API_BASE_URL = 'http://localhost:5000/api';

// Helper function for authenticated API calls
export const apiRequest = async (endpoint, options = {}) => {
  const token = localStorage.getItem('token');
  
  const defaultHeaders = {
    'Content-Type': 'application/json',
  };

  if (token) {
    defaultHeaders['Authorization'] = `Bearer ${token}`;
  }

  const config = {
    headers: { ...defaultHeaders, ...options.headers },
    ...options,
  };

  if (config.body && typeof config.body === 'object') {
    config.body = JSON.stringify(config.body);
  }

  try {
    console.log(`🔄 Making API request to: ${API_BASE_URL}${endpoint}`);
    console.log('📤 Request config:', {
      method: config.method,
      body: config.body
    });
    
    const response = await fetch(`${API_BASE_URL}${endpoint}`, config);
    
    console.log(`📨 Response status: ${response.status}`);
    
    // Handle 204 No Content responses
    if (response.status === 204) {
      return { message: 'Success' };
    }
    
    const data = await response.json();
    console.log('📨 Response data:', data);

    if (!response.ok) {
      throw new Error(data.message || `API request failed with status ${response.status}`);
    }

    return data;
  } catch (error) {
    console.error('❌ API request error:', error);
    throw error;
  }
};

// Specific API methods
export const authAPI = {
  login: (credentials) => apiRequest('/auth/login', { 
    method: 'POST', 
    body: credentials
  }),
  register: (userData) => apiRequest('/auth/register', { 
    method: 'POST', 
    body: userData
  }),
  getProfile: () => apiRequest('/auth/profile'),
  logout: () => apiRequest('/auth/logout', { method: 'POST' }),
};

export const leadsAPI = {
  create: (leadData) => apiRequest('/leads', { 
    method: 'POST', 
    body: leadData
  }),
  getAll: () => apiRequest('/leads'),
  get: (id) => apiRequest(`/leads/${id}`),
  update: (id, leadData) => apiRequest(`/leads/${id}`, { 
    method: 'PUT', 
    body: leadData
  }),
  delete: (id) => apiRequest(`/leads/${id}`, { method: 'DELETE' }),
  initializeSample: () => apiRequest('/leads/initialize-sample', { method: 'POST' }),
};

export const projectsAPI = {
  create: (projectData) => apiRequest('/projects', { 
    method: 'POST', 
    body: projectData
  }),
  getAll: () => apiRequest('/projects'),
  get: (id) => apiRequest(`/projects/${id}`),
  update: (id, projectData) => apiRequest(`/projects/${id}`, { 
    method: 'PUT', 
    body: projectData
  }),
  delete: (id) => apiRequest(`/projects/${id}`, { method: 'DELETE' }),
};

export const budgetAPI = {
  create: (budgetData) => apiRequest('/budget', { 
    method: 'POST', 
    body: budgetData
  }),
  getAll: () => apiRequest('/budget'),
  update: (id, budgetData) => apiRequest(`/budget/${id}`, { 
    method: 'PUT', 
    body: budgetData
  }),
  delete: (id) => apiRequest(`/budget/${id}`, { method: 'DELETE' }),
};

export const paymentsAPI = {
  create: (paymentData) => apiRequest('/payments', { 
    method: 'POST', 
    body: paymentData
  }),
  getAll: () => apiRequest('/payments'),
  update: (id, paymentData) => apiRequest(`/payments/${id}`, { 
    method: 'PUT', 
    body: paymentData
  }),
  delete: (id) => apiRequest(`/payments/${id}`, { method: 'DELETE' }),
};