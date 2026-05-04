import React, { useMemo, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { CreditCard, Minus, Plus, ShoppingCart, Trash2 } from 'lucide-react';
import { products } from './data/products.js';
import {
  addToCart,
  checkout,
  countCartItems,
  decreaseQuantity,
  getCartTotal,
  removeFromCart
} from './lib/cart.js';
import './styles.css';

function App() {
  const [cart, setCart] = useState([]);
  const [customerName, setCustomerName] = useState('');
  const [message, setMessage] = useState('');
  const total = useMemo(() => getCartTotal(cart), [cart]);
  const itemsCount = useMemo(() => countCartItems(cart), [cart]);

  function handleAdd(product) {
    setCart((currentCart) => addToCart(currentCart, product));
    setMessage('');
  }

  function handleCheckout(event) {
    event.preventDefault();
    const result = checkout(cart, { name: customerName });
    if (!result.ok) {
      setMessage(result.error);
      return;
    }

    setCart([]);
    setCustomerName('');
    setMessage(`Заказ ${result.orderId} оформлен на сумму ${formatPrice(result.total)}.`);
  }

  return (
    <main className="page">
      <header className="topbar">
        <div>
          <p className="eyebrow">Лабораторная работа N8</p>
          <h1>Volga Mart</h1>
          <p className="subtitle">Ульяновский магазин техники для учебы и работы</p>
        </div>
        <div className="cart-badge" aria-label="Товаров в корзине">
          <ShoppingCart size={20} aria-hidden="true" />
          <span data-testid="cart-count">{itemsCount}</span>
        </div>
      </header>

      <section className="layout" aria-label="Интернет-магазин">
        <div className="catalog">
          <h2>Каталог товаров</h2>
          <div className="product-grid">
            {products.map((product) => (
              <article className="product-card" key={product.id}>
                <div className="product-media" aria-hidden="true">
                  <span>{product.shortName}</span>
                </div>
                <div className="product-info">
                  <h3>{product.name}</h3>
                  <p>{product.description}</p>
                  <div className="product-actions">
                    <strong>{formatPrice(product.price)}</strong>
                    <button type="button" onClick={() => handleAdd(product)}>
                      <Plus size={18} aria-hidden="true" />
                      В корзину
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>

        <aside className="checkout" aria-label="Корзина">
          <h2>Корзина</h2>
          {cart.length === 0 ? (
            <p className="empty-cart">Добавьте товары из каталога.</p>
          ) : (
            <ul className="cart-list">
              {cart.map((item) => (
                <li key={item.id}>
                  <div>
                    <strong>{item.name}</strong>
                    <span>{formatPrice(item.price)} x {item.quantity}</span>
                  </div>
                  <div className="quantity-controls" aria-label={`Количество ${item.name}`}>
                    <button
                      type="button"
                      className="icon-button"
                      aria-label={`Уменьшить ${item.name}`}
                      onClick={() => setCart((currentCart) => decreaseQuantity(currentCart, item.id))}
                    >
                      <Minus size={16} aria-hidden="true" />
                    </button>
                    <button
                      type="button"
                      className="icon-button"
                      aria-label={`Удалить ${item.name}`}
                      onClick={() => setCart((currentCart) => removeFromCart(currentCart, item.id))}
                    >
                      <Trash2 size={16} aria-hidden="true" />
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}

          <form className="order-form" onSubmit={handleCheckout}>
            <label htmlFor="customerName">Имя покупателя</label>
            <input
              id="customerName"
              name="customerName"
              value={customerName}
              onChange={(event) => setCustomerName(event.target.value)}
              placeholder="Анна"
            />
            <div className="total-row">
              <span>Итого</span>
              <strong data-testid="cart-total">{formatPrice(total)}</strong>
            </div>
            <button className="checkout-button" type="submit">
              <CreditCard size={18} aria-hidden="true" />
              Оформить заказ
            </button>
          </form>

          {message && (
            <p className="status-message" role="status">
              {message}
            </p>
          )}
        </aside>
      </section>
    </main>
  );
}

export function formatPrice(value) {
  return new Intl.NumberFormat('ru-RU', {
    style: 'currency',
    currency: 'RUB',
    maximumFractionDigits: 0
  }).format(value);
}

createRoot(document.getElementById('root')).render(<App />);
