import React, { useState, useEffect } from 'react';
import { fetchStoreConfig } from '../services/api';

export default function Navbar({ currentPage, onNavigate, cartCount, user, onSignOut }) {
  const [showCategoryMenu, setShowCategoryMenu] = useState(false);
  const [storeConfig, setStoreConfig] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchStoreConfig()
      .then(config => setStoreConfig(config))
      .catch(err => console.error('Failed to fetch config:', err));
  }, []);

  const categories = ['Phones', 'Laptops', 'TVs', 'Fridges', 'Audio', 'Cameras'];

  const handleSearch = (e) => {
    e.preventDefault();
    // Search functionality can be implemented here
    console.log('Search:', searchQuery);
  };

  return (
    <header style={{ background: '#fff' }}>
      {/* Top Bar - Orange Background */}
      <div style={{ background: '#f39c12', padding: '12px 24px', color: '#fff', fontSize: 14 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 20, flexWrap: 'wrap' }}>
          {/* Left: Store Name & Tagline */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <h1 style={{ margin: 0, fontSize: 18, fontWeight: 700 }}>{storeConfig?.storeName || 'Loris E-9'}</h1>
            <span style={{ fontSize: 12, opacity: 0.9 }}>We value customer satisfaction</span>
          </div>

          {/* Right: Quick Links */}
          <nav style={{ display: 'flex', alignItems: 'center', gap: 20, flexWrap: 'wrap' }}>
            <button
              onClick={() => onNavigate('home')}
              style={{
                background: 'none',
                border: 'none',
                color: '#fff',
                cursor: 'pointer',
                fontSize: 13
              }}
            >
              Help
            </button>
            <button
              onClick={() => onNavigate('orders')}
              style={{
                background: 'none',
                border: 'none',
                color: '#fff',
                cursor: 'pointer',
                fontSize: 13
              }}
            >
              Track Order
            </button>
            {user ? (
              <>
                <span style={{ fontSize: 13 }}>Hi, {user.name?.split(' ')[0]}</span>
                <button
                  onClick={onSignOut}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: '#fff',
                    cursor: 'pointer',
                    fontSize: 13
                  }}
                >
                  Log Out
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={() => onNavigate('signin')}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: '#fff',
                    cursor: 'pointer',
                    fontSize: 13
                  }}
                >
                  Sign In
                </button>
                <button
                  onClick={() => onNavigate('signin')}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: '#fff',
                    cursor: 'pointer',
                    fontSize: 13
                  }}
                >
                  Sign Up
                </button>
              </>
            )}
            <span style={{ fontSize: 12 }}>📞 {storeConfig?.supportWhatsApp}</span>
          </nav>
        </div>
      </div>

      {/* Second Bar - Search & Cart */}
      <div style={{ padding: '12px 24px', borderBottom: '1px solid #e0e0e0' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 20, flexWrap: 'wrap' }}>
          {/* Search Bar */}
          <form onSubmit={handleSearch} style={{ flex: 1, minWidth: 300 }}>
            <div style={{ display: 'flex', alignItems: 'center', background: '#f5f5f5', borderRadius: 4 }}>
              <input
                type="text"
                placeholder="Search for products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{
                  flex: 1,
                  border: 'none',
                  padding: '10px 12px',
                  background: 'none',
                  fontSize: 14
                }}
              />
              <button
                type="submit"
                style={{
                  background: 'none',
                  border: 'none',
                  padding: '10px 12px',
                  cursor: 'pointer',
                  fontSize: 18
                }}
              >
                🔍
              </button>
            </div>
          </form>

          {/* Right Actions */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
            {/* Cart Icon */}
            <button
              onClick={() => onNavigate('cart')}
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                background: currentPage === 'cart' ? '#f39c12' : 'none',
                border: 'none',
                cursor: 'pointer',
                color: currentPage === 'cart' ? '#fff' : '#000'
              }}
            >
              <span style={{ fontSize: 20 }}>🛒</span>
              <span style={{ fontSize: 12, fontWeight: 600 }}>Cart ({cartCount})</span>
            </button>

            {/* Account Icon */}
            <button
              onClick={() => onNavigate(user ? 'orders' : 'signin')}
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                color: '#000'
              }}
            >
              <span style={{ fontSize: 20 }}>👤</span>
              <span style={{ fontSize: 12 }}>Account</span>
            </button>

            {/* Help Icon */}
            <button
              onClick={() => onNavigate('home')}
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                color: '#000'
              }}
            >
              <span style={{ fontSize: 20 }}>❓</span>
              <span style={{ fontSize: 12 }}>Help</span>
            </button>
          </div>
        </div>
      </div>

      {/* Category Bar - Dropdown Menu */}
      <div style={{ background: '#fafafa', padding: '0', borderBottom: '1px solid #e0e0e0' }}>
        <div style={{ padding: '0 24px', display: 'flex', alignItems: 'center', gap: 0, position: 'relative' }}>
          {/* Categories Dropdown */}
          <button
            onMouseEnter={() => setShowCategoryMenu(true)}
            onMouseLeave={() => setShowCategoryMenu(false)}
            onClick={() => setShowCategoryMenu(!showCategoryMenu)}
            style={{
              padding: '12px 16px',
              background: showCategoryMenu ? '#f39c12' : 'none',
              border: 'none',
              cursor: 'pointer',
              color: showCategoryMenu ? '#fff' : '#000',
              fontWeight: 600,
              display: 'flex',
              alignItems: 'center',
              gap: 8
            }}
          >
            ☰ All Categories
            <span>{showCategoryMenu ? '▼' : '▶'}</span>
          </button>

          {/* Horizontal Category Links */}
          <div style={{ display: 'flex', flex: 1, gap: 0 }}>
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => onNavigate('products')}
                style={{
                  padding: '12px 16px',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  color: '#000',
                  fontSize: 13,
                  borderBottom: currentPage === 'products' ? '3px solid #f39c12' : 'none'
                }}
              >
                {category}
              </button>
            ))}
          </div>

          {/* Integration/Support Link */}
          <button
            onClick={() => onNavigate('integration')}
            style={{
              padding: '12px 16px',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              color: '#f39c12',
              fontSize: 13,
              fontWeight: 600
            }}
          >
            🚀 Features
          </button>
        </div>

        {/* Dropdown Menu */}
        {showCategoryMenu && (
          <div
            onMouseEnter={() => setShowCategoryMenu(true)}
            onMouseLeave={() => setShowCategoryMenu(false)}
            style={{
              position: 'absolute',
              top: '100%',
              left: 0,
              background: '#fff',
              border: '1px solid #e0e0e0',
              borderRadius: '0 0 4px 4px',
              minWidth: 200,
              boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
              zIndex: 100
            }}
          >
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => {
                  onNavigate('products');
                  setShowCategoryMenu(false);
                }}
                style={{
                  display: 'block',
                  width: '100%',
                  padding: '12px 16px',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  color: '#000',
                  textAlign: 'left',
                  fontSize: 13,
                  borderBottom: '1px solid #f0f0f0',
                  transition: 'background-color 0.2s'
                }}
                onMouseEnter={(e) => e.target.style.backgroundColor = '#f5f5f5'}
                onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
              >
                {category}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Promo Banner */}
      <div style={{ background: '#e8f5e9', padding: '8px 24px', fontSize: 12, color: '#2e7d32', textAlign: 'center' }}>
        🎉 Free delivery on orders over $50! Contact: {storeConfig?.supportWhatsApp}
      </div>
    </header>
  );
}
