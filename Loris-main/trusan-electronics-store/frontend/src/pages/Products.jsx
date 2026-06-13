import React, { useState } from 'react';

export default function Products({ products = [], onAddToCart }) {
  const [filter, setFilter] = useState('All');
  const categories = ['All', 'Phones', 'Laptops', 'TVs', 'Fridges', 'Audio', 'Cameras'];

  const filtered = filter === 'All' ? products : products.filter((product) => product.category === filter);

  return (
    <div>
      <h1>Products</h1>
      <div style={{ marginBottom: 14 }}>
        {categories.map((category) => (
          <button
            key={category}
            style={{ marginRight: 8, marginBottom: 8, padding: '8px 12px' }}
            onClick={() => setFilter(category)}
          >
            {category}
          </button>
        ))}
      </div>
      <div style={{ display: 'grid', gap: 16, gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))' }}>
        {filtered.map((product) => (
          <div key={product.id} style={{ border: '1px solid #ddd', borderRadius: 12, overflow: 'hidden', background: '#fff' }}>
            <img src={product.image} alt={product.name} style={{ width: '70%', height: 100, objectFit: 'cover' }} />
            <div style={{ padding: 16 }}>
              <div style={{ fontSize: 12, color: '#888', marginBottom: 4 }}>{product.category}</div>
              <h2 style={{ fontSize: 16, margin: '0 0 8px' }}>{product.name}</h2>
              <p style={{ margin: '0 0 12px', color: '#555' }}>{product.description}</p>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <strong>${product.price.toFixed(2)}</strong>
                <button style={{ padding: '8px 12px' }} onClick={() => onAddToCart(product)}>
                  Add to Cart
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
