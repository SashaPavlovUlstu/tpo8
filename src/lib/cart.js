export function addToCart(cart, product) {
  const existingItem = cart.find((item) => item.id === product.id);

  if (existingItem) {
    return cart.map((item) =>
      item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
    );
  }

  return [...cart, { ...product, quantity: 1 }];
}

export function decreaseQuantity(cart, productId) {
  return cart
    .map((item) =>
      item.id === productId ? { ...item, quantity: item.quantity - 1 } : item
    )
    .filter((item) => item.quantity > 0);
}

export function removeFromCart(cart, productId) {
  return cart.filter((item) => item.id !== productId);
}

export function getCartTotal(cart) {
  return cart.reduce((total, item) => total + item.price * item.quantity, 0);
}

export function countCartItems(cart) {
  return cart.reduce((total, item) => total + item.quantity, 0);
}

export function checkout(cart, customer) {
  if (cart.length === 0) {
    return { ok: false, error: 'Корзина пуста.' };
  }

  if (!customer.name || customer.name.trim().length < 2) {
    return { ok: false, error: 'Введите имя покупателя.' };
  }

  const total = getCartTotal(cart);

  return {
    ok: true,
    orderId: `ORD-${Date.now()}`,
    customerName: customer.name.trim(),
    total,
    items: cart
  };
}
