const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });
const express = require('express');
const cors = require('cors');
const { Server } = require('socket.io');
const http = require('http');
const storeConfig = require('./config/store-config');
const { ensureStore } = require('./utils/store');
const createAuthRoutes = require('./routes/auth');
const productsRoutes = require('./routes/products');
const ordersRoutes = require('./routes/orders');
const integrationsRoutes = require('./routes/integrations');
const mobileMoneyRoutes = require('./routes/mobilemoney');
const smsRoutes = require('./routes/sms');
const feedbackRoutes = require('./routes/feedback');

const app = express();
const server = http.createServer(app);
const frontendOrigin = process.env.FRONTEND_URL || '*';
const socketCorsOptions = {
  origin: frontendOrigin,
  methods: ['GET', 'POST']
};
const corsOptions = {
  origin: frontendOrigin,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS']
};

if (frontendOrigin !== '*') {
  corsOptions.credentials = true;
  socketCorsOptions.credentials = true;
}

const io = new Server(server, {
  cors: socketCorsOptions
});

app.use(cors(corsOptions));
app.use(express.json());

// Dynamic config endpoint
app.get('/api/config', (req, res) => {
  res.json(storeConfig);
});

app.get('/', (req, res) => {
  res.json({ 
    message: `${storeConfig.storeName} API Running`, 
    version: storeConfig.apiVersion,
    storeName: storeConfig.storeName 
  });
});

app.use('/api/auth', createAuthRoutes(io));
app.use('/api/products', productsRoutes);
app.use('/api/orders', ordersRoutes);
app.use('/api/integrations', integrationsRoutes);
app.use('/api/mobilemoney', mobileMoneyRoutes);
app.use('/api/sms', smsRoutes);
app.use('/api/feedback', feedbackRoutes);

app.use((req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ message: 'Internal server error' });
});

io.on('connection', (socket) => {
  console.log('Client connected:', socket.id);

  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id);
  });
});

ensureStore();

const PORT = process.env.PORT || 5000;
const HOST = process.env.HOST || '0.0.0.0';
server.listen(PORT, HOST, () => {
  console.log(`${storeConfig.storeName} server running on ${HOST}:${PORT}`);
});