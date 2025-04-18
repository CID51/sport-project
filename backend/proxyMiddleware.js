import { createProxyMiddleware } from 'http-proxy-middleware';

export const apiProxy = createProxyMiddleware('/api', {
  target: process.env.VITE_API_URL,
  changeOrigin: true,
  pathRewrite: { '^/api': '' }
});
