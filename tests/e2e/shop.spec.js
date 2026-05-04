import { expect, test } from '@playwright/test';

test('customer can add products to cart and place an order', async ({ page }) => {
  await page.goto('/');

  await expect(page.getByRole('heading', { name: 'Каталог товаров' })).toBeVisible();
  await page.getByRole('article').filter({ hasText: 'Механическая клавиатура' }).getByRole('button').click();
  await page.getByRole('article').filter({ hasText: 'Беспроводная мышь' }).getByRole('button').click();

  const cart = page.getByLabel('Корзина');
  await expect(page.getByTestId('cart-count')).toHaveText('2');
  await expect(cart.getByText('Механическая клавиатура', { exact: true })).toBeVisible();
  await expect(cart.getByText('Беспроводная мышь', { exact: true })).toBeVisible();
  await expect(page.getByTestId('cart-total')).toContainText('7 680');

  await page.getByLabel('Имя покупателя').fill('Анна');
  await page.getByRole('button', { name: 'Оформить заказ' }).click();

  await expect(page.getByRole('status')).toContainText('Заказ ORD-');
  await expect(page.getByTestId('cart-count')).toHaveText('0');
});

test('checkout validates empty cart', async ({ page }) => {
  await page.goto('/');

  await page.getByLabel('Имя покупателя').fill('Анна');
  await page.getByRole('button', { name: 'Оформить заказ' }).click();

  await expect(page.getByRole('status')).toHaveText('Корзина пуста.');
});
