import { describe, expect, it, vi } from 'vitest';
import {
  addToCart,
  checkout,
  countCartItems,
  decreaseQuantity,
  getCartTotal,
  removeFromCart
} from './cart.js';

const keyboard = {
  id: 'keyboard',
  name: 'Механическая клавиатура',
  price: 5490
};

const mouse = {
  id: 'mouse',
  name: 'Беспроводная мышь',
  price: 2190
};

describe('cart business logic', () => {
  it('adds a new product and increases quantity for repeated products', () => {
    const cart = addToCart(addToCart([], keyboard), keyboard);

    expect(cart).toEqual([{ ...keyboard, quantity: 2 }]);
    expect(countCartItems(cart)).toBe(2);
  });

  it('calculates cart total from product prices and quantities', () => {
    const cart = [
      { ...keyboard, quantity: 2 },
      { ...mouse, quantity: 1 }
    ];

    expect(getCartTotal(cart)).toBe(13170);
  });

  it('decreases quantity and removes item when quantity becomes zero', () => {
    const cart = decreaseQuantity([{ ...keyboard, quantity: 1 }], keyboard.id);

    expect(cart).toEqual([]);
  });

  it('removes product from cart by id', () => {
    const cart = removeFromCart(
      [
        { ...keyboard, quantity: 1 },
        { ...mouse, quantity: 1 }
      ],
      keyboard.id
    );

    expect(cart).toEqual([{ ...mouse, quantity: 1 }]);
  });

  it('rejects checkout with an empty cart or missing customer name', () => {
    expect(checkout([], { name: 'Анна' })).toMatchObject({
      ok: false,
      error: 'Корзина пуста.'
    });
    expect(checkout([{ ...keyboard, quantity: 1 }], { name: ' ' })).toMatchObject({
      ok: false,
      error: 'Введите имя покупателя.'
    });
  });

  it('creates order for a valid checkout', () => {
    vi.spyOn(Date, 'now').mockReturnValue(1_735_689_600_000);

    expect(checkout([{ ...keyboard, quantity: 1 }], { name: ' Анна ' })).toEqual({
      ok: true,
      orderId: 'ORD-1735689600000',
      customerName: 'Анна',
      total: 5490,
      items: [{ ...keyboard, quantity: 1 }]
    });
  });
});
