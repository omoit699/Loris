// Dynamic Store Configuration
// This file centralizes all store branding and can be easily modified

const storeConfig = {
  storeName: process.env.STORE_NAME || 'Loris E-9',
  storeEmail: process.env.STORE_EMAIL || 'admin@lorise9.com',
  supportWhatsApp: process.env.SUPPORT_WHATSAPP || '0780275685',
  apiVersion: '1.0.0',
  currency: 'USD',
  timezone: 'Africa/Kampala',
  supportedCountries: ['Uganda'],
  defaultLanguage: 'en'
};

module.exports = storeConfig;