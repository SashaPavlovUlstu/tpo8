# Volga Mart: интеграция тестирования в CI/CD

Минимальный учебный интернет-магазин Volga Mart для лабораторной работы N8. Это небольшой "ульяновский магазин" техники: каталог товаров, корзина, оформление заказа, unit-тесты бизнес-логики, UI/e2e-тесты Playwright и SAST-проверка Semgrep в GitLab CI.

## Стек

- Node.js 22
- React 19
- Vite
- Vitest
- Playwright
- Semgrep
- GitLab CI

## Структура проекта

```text
.
├── .gitlab-ci.yml             # CI/CD пайплайн
├── README.md                  # инструкция по запуску
├── REPORT.md                  # краткий отчет по лабораторной работе
├── package.json               # зависимости и npm-скрипты
├── playwright.config.js       # конфигурация UI/e2e-тестов
├── vite.config.js             # конфигурация Vite и Vitest
├── scripts/
│   └── ci-report.mjs          # генерация краткой CI-сводки
├── src/
│   ├── data/products.js       # товары каталога
│   ├── lib/cart.js            # бизнес-логика корзины и заказа
│   ├── lib/cart.test.js       # unit-тесты
│   ├── main.jsx               # React-приложение
│   ├── styles.css             # стили
│   └── test/setup.js          # настройка тестовой среды
└── tests/e2e/shop.spec.js     # UI/e2e-тесты Playwright
```

## Установка зависимостей

```bash
npm install
```

Для локального запуска UI-тестов один раз установите браузер Playwright:

```bash
npx playwright install chromium
```

## Локальный запуск проекта

```bash
npm run dev
```

После запуска приложение будет доступно по адресу, который выведет Vite, обычно `http://localhost:5173`.

## Запуск unit-тестов

```bash
npm test
```

Команда запускает Vitest и формирует отчет покрытия в папке `coverage/`.

## Запуск UI/e2e-тестов

```bash
npm run test:ui
```

Playwright сам поднимает Vite dev server, открывает Chromium и проверяет сценарии добавления товаров в корзину и оформления заказа. HTML-отчет сохраняется в `playwright-report/`.

## Запуск SAST локально

Быстрая проверка зависимостей:

```bash
npm run sast:npm
```

Проверка Semgrep, если Semgrep установлен локально:

```bash
semgrep scan --config p/javascript .
```

В GitLab CI Semgrep запускается в готовом Docker-образе `semgrep/semgrep`.

## Как работает CI/CD пайплайн

Пайплайн описан в `.gitlab-ci.yml` и содержит обязательные стадии:

- `install`: устанавливает зависимости через `npm install` и проверяет сборку `npm run build`;
- `unit_tests`: запускает `npm test`, сохраняет HTML/JSON-отчет покрытия;
- `ui_tests`: запускает Playwright-тесты в Docker-образе с предустановленными браузерами;
- `sast`: запускает Semgrep по JavaScript-правилам и сохраняет `semgrep.sarif`;
- `report`: собирает краткую сводку в `ci-summary.md`.

## Как анализировать результаты

- Unit-тесты: смотрите лог job `unit_tests` и артефакт `coverage/`.
- UI-тесты: смотрите лог job `ui_tests`, JUnit-отчет `test-results/playwright-junit.xml` и HTML-отчет `playwright-report/`.
- SAST: смотрите лог job `sast` и файл `semgrep.sarif`. Если Semgrep нашел проблему, в SARIF будут указаны правило, файл, строка и описание риска.
- Итоговая сводка: job `report` публикует артефакт `ci-summary.md`.

## Загрузка в GitLab

```bash
git init
git add .
git commit -m "Add lab 8 CI/CD shop project"
git branch -M main
git remote add origin <URL_ВАШЕГО_GITLAB_РЕПОЗИТОРИЯ>
git push -u origin main
```

После push GitLab автоматически запустит пайплайн.
