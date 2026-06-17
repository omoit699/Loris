const fs = require('fs');
const path = require('path');

const storePath = path.join(__dirname, '../data/store.json');

function ensureStore() {
  const dataDir = path.dirname(storePath);
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }

  if (!fs.existsSync(storePath)) {
    const initial = {
      users: [],
      products: [],
      orders: [],
      integrations: []
    };
    fs.writeFileSync(storePath, JSON.stringify(initial, null, 2), 'utf8');
  }
}

function loadStore() {
  ensureStore();
  const content = fs.readFileSync(storePath, 'utf8');
  return JSON.parse(content || '{}');
}

function saveStore(store) {
  fs.writeFileSync(storePath, JSON.stringify(store, null, 2), 'utf8');
}

module.exports = {
  ensureStore,
  loadStore,
  saveStore
};
