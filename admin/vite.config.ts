import react from '@vitejs/plugin-react';
import { defineConfig, loadEnv } from 'vite';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd());

  return {
    plugins: [react()],
    server: {
      host: true,
      port: 3000,
    },
    optimizeDeps: {
      include: ['react-helmet-async'],
    },
  };
});
