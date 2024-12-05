export const proxyConfig = (env: Record<string, string>) => ({
  '/api': {
    target: env.VITE_API_BASE_URL,
    changeOrigin: true,
    rewrite: (path: string) => path.replace(/^\/api/, ''),
  },
});
