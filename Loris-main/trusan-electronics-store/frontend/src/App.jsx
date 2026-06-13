import React, { useMemo, useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Products from './pages/Products';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import SignIn from './pages/SignIn';
import AdminDashboard from './pages/AdminDashboard';
import FeedbackPage from './pages/FeedbackPage';
import OrderDetails from './pages/OrderDetails';
import Integration from './pages/Integration';
import OrderTracking from './pages/OrderTracking';
import { fetchProducts, fetchCurrentUser, placeOrderApi } from './services/api';
import products from './data/products';

export default function App() {
  const [page, setPage] = useState('home');
  const [user, setUser] = useState(null);
  const [cartItems, setCartItems] = useState([]);
  const [orderHistory, setOrderHistory] = useState([]);
  const [apiProducts, setApiProducts] = useState(products);
  const [loading, setLoading] = useState(true);

  const cartCount = useMemo(() => cartItems.reduce((sum, item) => sum + item.quantity, 0), [cartItems]);

  useEffect(() => {
    const token = localStorage.getItem('authToken');
    if (token) {
      fetchCurrentUser(token)
        .then((data) => setUser(data.user))
        .catch(() => localStorage.removeItem('authToken'));
    }

    fetchProducts()
      .then((items) => {
        setApiProducts(items);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const addToCart = (product) => {
    setCartItems((current) => {
      const existing = current.find((item) => item.id === product.id);
      if (existing) {
        return current.map((item) =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...current, { ...product, quantity: 1 }];
    });
    setPage('cart');
  };

  const removeFromCart = (productId) => {
    setCartItems((current) => current.filter((item) => item.id !== productId));
  };

  const changeQuantity = (productId, quantity) => {
    setCartItems((current) =>
      current
        .map((item) => (item.id === productId ? { ...item, quantity: Math.max(1, quantity) } : item))
        .filter((item) => item.quantity > 0)
    );
  };

  const placeOrder = async (orderData) => {
    if (!user) return;

    try {
      const token = localStorage.getItem('authToken');
      const result = await placeOrderApi({
        cartItems,
        shipping: orderData,
        paymentMethod: orderData.paymentMethod,
        paymentData: orderData.paymentData,
        token
      });
      setOrderHistory((current) => [...current, result.order]);
      setCartItems([]);
      setPage('home');
    } catch (error) {
      alert('Order placement failed: ' + (error.message || 'Unknown error'));
    }
  };

  const signIn = (userInfo, token) => {
    setUser(userInfo);
    if (token) {
      localStorage.setItem('authToken', token);
    }
    setPage('home');
  };

  const signOut = () => {
    setUser(null);
    localStorage.removeItem('authToken');
    setPage('home');
  };

  const renderPage = () => {
    if (loading) {
      return <div>Loading products...</div>;
    }

    switch (page) {
      case 'products':
        return <Products products={apiProducts} onAddToCart={addToCart} />;
      case 'cart':
        return (
          <Cart
            cartItems={cartItems}
            onRemoveItem={removeFromCart}
            onChangeQuantity={changeQuantity}
            onCheckout={() => setPage('checkout')}
          />
        );
      case 'checkout':
        return (
          <Checkout
            cartItems={cartItems}
            user={user}
            onPlaceOrder={placeOrder}
            onSignIn={() => setPage('signin')}
          />
        );
      case 'signin':
        return <SignIn onSignIn={signIn} />;
      case 'admin':
        return <AdminDashboard user={user} orderHistory={orderHistory} cartItems={cartItems} products={apiProducts} />;
      case 'feedback':
        return <FeedbackPage user={user} />;
      case 'orders':
        return <OrderDetails user={user} />;
      case 'integration':
        return <Integration />;
      case 'tracking':
        return <OrderTracking />;
      case 'home':
      default:
        return <Home onShop={() => setPage('products')} />;
    }
  };

  return (
    <div style={{ fontFamily: 'system-ui, sans-serif', minHeight: '100vh', background: '#f4f6f8', color: '#1a1a1a' }}>
      <Navbar
        currentPage={page}
        onNavigate={setPage}
        cartCount={cartCount}
        user={user}
        onSignOut={signOut}
      />
      <main style={{ maxWidth: 1200, margin: '0 auto', padding: '24px' }}>{renderPage()}</main>
    </div>
  );
}
