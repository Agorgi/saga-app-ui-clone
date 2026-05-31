import path from 'node:path';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

// Standalone wireframe clone of the Saga web app.
// Mirrors apps/app-web's Vite + React + Sass setup, minus the backend wiring.
export default defineConfig({
  plugins: [react()],

  server: {
    port: 3000,
    open: false,
    host: true,
  },

  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@lib': path.resolve(__dirname, './src/lib'),
      '@utils': path.resolve(__dirname, './src/utils'),
      '@components': path.resolve(__dirname, './src/components'),
      '@contexts': path.resolve(__dirname, './src/contexts'),
      '@domains': path.resolve(__dirname, './src/domains'),
      '@hooks': path.resolve(__dirname, './src/hooks'),
      '@pages': path.resolve(__dirname, './src/pages'),
      '@assets': path.resolve(__dirname, './src/assets'),
      // The real app pulls shared UI primitives from the @saga/global-web
      // workspace package. Here they are vendored locally so the clone stands alone.
      '@saga/global-web': path.resolve(__dirname, './src/vendor/global-web'),

      // Private workspace + analytics packages the vendored components import.
      // Aliased to local no-op shims so every component file stays verbatim
      // without dragging in the backend stack. See src/vendor/saga-shims.
      '@saga/logger-middleware': path.resolve(__dirname, './src/vendor/saga-shims/logger-middleware.ts'),
      '@saga/config-web': path.resolve(__dirname, './src/vendor/saga-shims/config-web.ts'),
      '@saga/precedent-middleware': path.resolve(__dirname, './src/vendor/saga-shims/precedent-middleware.ts'),
      '@saga/community-middleware': path.resolve(__dirname, './src/vendor/saga-shims/community-middleware.ts'),
      '@saga/records-middleware': path.resolve(__dirname, './src/vendor/saga-shims/records-middleware.ts'),
      '@openfeature/react-sdk': path.resolve(__dirname, './src/vendor/saga-shims/openfeature-react-sdk.ts'),
      '@amplitude/analytics-browser': path.resolve(__dirname, './src/vendor/saga-shims/amplitude-analytics-browser.ts'),
      axios: path.resolve(__dirname, './src/vendor/saga-shims/axios.ts'),
    },
  },
});
