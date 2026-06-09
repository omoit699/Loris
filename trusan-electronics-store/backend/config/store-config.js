// Dynamic Store Configuration
// This file centralizes all store branding and can be easily modified

const storeConfig = {
  storeName: process.env.STORE_NAME || 'Loris E-9',
  storeEmail: process.env.STORE_EMAIL || 'lawrenceomoit66y@gmail.com',
  supportWhatsApp: process.env.SUPPORT_WHATSAPP || '0790206354',
  supportPhone: process.env.SUPPORT_PHONE || '+256790206354',
  alternatePhone: process.env.ALTERNATE_PHONE || '+256787772067',
  whatsappChannel: process.env.WHATSAPP_CHANNEL || 'https://whatsapp.com/channel/0029VbCseMv7IUYSEy2fqX2P',
  mobileMoneyPhone: process.env.MOBILE_MONEY_PHONE || '+256790206354',
  apiVersion: '1.0.0',
  currency: 'USD',
  timezone: 'Africa/Kampala',
  supportedCountries: ['Uganda'],
  defaultLanguage: 'en',
  paymentMethods: {
    mobileMoney: {
      enabled: true,
      providers: ['MTN Mobile Money', 'Airtel Money'],
      phoneNumber: '+256790206354'
    },
    cashOnDelivery: {
      enabled: true
    }
  }
};

module.exports = storeConfig;