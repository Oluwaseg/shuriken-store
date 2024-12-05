import react from '@vitejs/plugin-react';
import { defineConfig, loadEnv } from 'vite';
import { proxyConfig as createProxyConfig } from './proxyConfig';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd());

  return {
    plugins: [react()],
    server: {
      host: true,
      port: 3000,
      proxy: createProxyConfig(env),
    },
    optimizeDeps: {
      include: ['react-helmet-async'],
    },
  };
});
