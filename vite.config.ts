import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import type { ConfigEnv } from 'vite';

// Define process types for TypeScript
declare global {
  namespace NodeJS {
    interface ProcessEnv {
      [key: string]: string | undefined;
    }
  }
}

export default defineConfig(({ mode }: ConfigEnv) => {
  // Load environment variables
  const env = loadEnv(mode, process.cwd(), '');
  
  // Extract API URL and remove /api if present for proxy configuration
  const apiUrl = env.VITE_API_URL || 'http://localhost:3000/api';
  let serverUrl = 'http://localhost:3000';
  
  // Handle API URL with trailing /api
  if (apiUrl.includes('/api')) {
    serverUrl = apiUrl.split('/api')[0];
  }

  return {
    plugins: [react()],
    resolve: {
      alias: {
        '@': '/src'
      }
    },
    server: {
      port: 5173,
      proxy: {
        '/api': {
          target: serverUrl,
          changeOrigin: true,
          secure: false
        }
      }
    }
  };
}); 