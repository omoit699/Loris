require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { Server } = require('socket.io');
const http = require('http');
const storeConfig = require('./config/store-config');
const { loadStore, saveStore } = require('./utils/store');
const createAuthRoutes = require('./routes/auth');
const productsRoutes = require('./routes/products');
const ordersRoutes = require('./routes/orders');
const integrationsRoutes = require('./routes/integrations');
const mobileMoneyRoutes = require('./routes/mobilemoney');
const smsRoutes = require('./routes/sms');
const feedbackRoutes = require('./routes/feedback');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST']
  }
});

app.use(cors());
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

io.on('connection', (socket) => {
  console.log('Client connected:', socket.id);

  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id);
  });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`${storeConfig.storeName} server running on port ${PORT}`);
});