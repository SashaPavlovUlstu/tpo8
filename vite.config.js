import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    globals: true,
    include: ['src/**/*.test.{js,jsx}'],
    setupFiles: './src/test/setup.js',
    coverage: {
      include: ['src/lib/**/*.js'],
      reporter: ['text', 'json', 'json-summary', 'html'],
      reportsDirectory: './coverage'
    }
  }
});
