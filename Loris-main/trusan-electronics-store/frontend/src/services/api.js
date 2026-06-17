// Use `VITE_API_BASE_URL` when provided (e.g. during deployment). When empty,
// requests will be sent to the same origin which enables deploying backend and
// frontend to the same host (recommended for Render/Ender).
const BASE_URL = import.meta.env.VITE_API_BASE_URL || '';

async function request(path, options = {}) {
  const response = await fetch(`${BASE_URL}${path}`, {
    headers: {
      'Content-Type': 'application/json',
      ...(options.token ? { Authorization: `Bearer ${options.token}` } : {})
    },
    ...options
  });

  const body = await response.json().catch(() => ({}));
  if (!response.ok) {
    const error = new Error(body.message || 'API request failed');
    error.status = response.status;
    error.body = body;
    throw error;
  }

  return body;
}

export async function fetchStoreConfig() {
  return request('/api/config');
}

export async function fetchProducts() {
  const data = await request('/api/products');
  return data.products || [];
}

export async function signInApi({ email, password }) {
  return request('/api/auth/signin', { method: 'POST', body: JSON.stringify({ email, password }) });
}

export async function signUpApi({ name, email, password, phoneNumber, emailVerificationCode }) {
  return request('/api/auth/signup', { 
    method: 'POST', 
    body: JSON.stringify({ 
      name, 
      email, 
      password, 
      phoneNumber,
      emailVerificationCode,
      phoneVerified: true
    }) 
  });
}

export async function fetchCurrentUser(token) {
  return request('/api/auth/me', { method: 'GET', token });
}

export async function placeOrderApi({ cartItems, shipping, token, paymentMethod, paymentData }) {
  return request('/api/orders', { method: 'POST', body: JSON.stringify({ cartItems, shipping, paymentMethod, paymentData }), token });
}

export async function processMobileMoneyPayment({ provider, phoneNumber, amount, orderId }) {
  return request('/api/mobilemoney/process', { method: 'POST', body: JSON.stringify({ provider, phoneNumber, amount, orderId }) });
}

export async function getMobileMoneyProviders() {
  return request('/api/mobilemoney/providers', { method: 'GET' });
}

// Email Verification APIs
export async function requestEmailVerification({ email }) {
  return request('/api/auth/request-email-verification', { 
    method: 'POST', 
    body: JSON.stringify({ email }) 
  });
}

export async function verifyEmailCode({ email, code }) {
  return request('/api/auth/verify-email-code', { 
    method: 'POST', 
    body: JSON.stringify({ email, code }) 
  });
}

// SMS Verification APIs
export async function requestPhoneVerification({ phoneNumber }) {
  return request('/api/sms/request-verification', { 
    method: 'POST', 
    body: JSON.stringify({ phoneNumber }) 
  });
}

export async function verifyPhoneCode({ phoneNumber, code }) {
  return request('/api/sms/verify-code', { 
    method: 'POST', 
    body: JSON.stringify({ phoneNumber, code }) 
  });
}

export async function markPhoneVerified({ phoneNumber }) {
  return request('/api/auth/mark-phone-verified', { 
    method: 'POST', 
    body: JSON.stringify({ phoneNumber }) 
  });
}

// SMS Notification APIs
export async function sendOrderStatusSMS({ phoneNumber, orderId, status, message }) {
  return request('/api/sms/send-order-status', { 
    method: 'POST', 
    body: JSON.stringify({ phoneNumber, orderId, status, message }) 
  });
}

// Feedback APIs
export async function submitOrderFeedback({ orderId, rating, comment, deliveryRating, productQuality, customerService, token }) {
  return request('/api/feedback', { 
    method: 'POST', 
    body: JSON.stringify({ orderId, rating, comment, deliveryRating, productQuality, customerService }),
    token
  });
}

export async function getOrderFeedback({ orderId }) {
  return request(`/api/feedback/order/${orderId}`, { method: 'GET' });
}

export async function getUserFeedback({ token }) {
  return request('/api/feedback/user/all', { method: 'GET', token });
}

export async function getAllFeedback({ token }) {
  return request('/api/feedback/admin/all', { method: 'GET', token });
}

export async function fetchOrderStatus(orderId, email) {
  return request(`/api/orders/track?orderId=${encodeURIComponent(orderId)}&email=${encodeURIComponent(email)}`, { method: 'GET' });
}

export async function getUserOrders({ token }) {
  return request('/api/orders/user', { method: 'GET', token });
}

export async function fetchUgandaIntegrations() {
  const data = await request('/api/integrations/uganda');
  return data.integrations || [];
}
