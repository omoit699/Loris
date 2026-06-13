import React from 'react';
import productsFallback from '../data/products';
import FeedbackDashboard from '../components/FeedbackDashboard';

export default function AdminDashboard({ user, orderHistory, cartItems, token, products = productsFallback }) {
  if (!user?.isAdmin) {
    return (
      <div>
        <h1>Admin Dashboard</h1>
        <p>You do not have access to the admin dashboard. Sign in as admin to view metrics.</p>
      </div>
    );
  }

  const totalOrders = orderHistory.length;
  const totalRevenue = orderHistory.reduce((sum, order) => sum + +(order.total || 0), 0);
  const allProducts = products;
  const categoryCounts = allProducts.reduce((counts, product) => {
    counts[product.category] = (counts[product.category] || 0) + 1;
    return counts;
  }, {});

  return (
    <div>
      <h1>Admin Dashboard</h1>
      <div style={{ display: 'grid', gap: 16, maxWidth: 800 }}>
        <div style={{ border: '1px solid #ddd', borderRadius: 12, padding: 16, background: '#fff' }}>
          <h2>Store overview</h2>
          <p>Products in store: {allProducts.length}</p>
          <p>Active cart items: {cartItems.length}</p>
          <p>Orders completed: {totalOrders}</p>
          <p>Total revenue: ${totalRevenue.toFixed(2)}</p>
        </div>
        <div style={{ border: '1px solid #ddd', borderRadius: 12, padding: 16, background: '#fff' }}>
          <h2>Inventory by category</h2>
          {Object.entries(categoryCounts).map(([category, count]) => (
            <div key={category} style={{ marginBottom: 8 }}>
              <strong>{category}:</strong> {count} items
            </div>
          ))}
        </div>
        <div style={{ border: '1px solid #ddd', borderRadius: 12, padding: 16, background: '#fff' }}>
          <h2>Recent orders</h2>
          {orderHistory.length === 0 ? (
            <p>No orders have been placed yet.</p>
          ) : (
            orderHistory.slice(-3).reverse().map((order, index) => (
              <div key={index} style={{ marginBottom: 12 }}>
                <strong>{order.name}</strong> ordered ${order.total.toFixed(2)}
                <div>{order.email}</div>
                <div>{order.city}, {order.zip}</div>
              </div>
            ))
          )}
        </div>
      </div>
      <div style={{ marginTop: 32 }}>
        <FeedbackDashboard token={token} user={user} />
      </div>
    </div>
  );
}
