import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

// O client fala com a API sempre pelo prefixo /api:
// - em desenvolvimento, quem redireciona e o proxy abaixo;
// - em producao (Docker), quem redireciona e o nginx.
// Assim o mesmo bundle roda em qualquer maquina, sem rebuild.
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  const apiTarget = env.API_PROXY_TARGET || 'http://localhost:3333';

  return {
    plugins: [react()],
    server: {
      port: Number(env.CLIENT_PORT) || 3000,
      host: true,
      proxy: {
        '/api': {
          target: apiTarget,
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/api/, '')
        }
      }
    },
    preview: {
      port: Number(env.CLIENT_PORT) || 3000,
      host: true
    },
    build: {
      outDir: 'dist',
      sourcemap: true
    },
    test: {
      globals: true,
      environment: 'jsdom',
      setupFiles: './src/setupTests.js',
      css: true,
      restoreMocks: true,
      coverage: {
        provider: 'v8',
        reporter: ['text', 'html', 'lcov'],
        reportsDirectory: './coverage',
        include: ['src/**/*.{js,jsx}'],
        exclude: [
          'src/main.jsx',
          'src/setupTests.js',
          'src/mocks/**',
          'src/**/index.js',
          'src/**/*.test.{js,jsx}'
        ],
        thresholds: {
          statements: 90,
          branches: 90,
          functions: 90,
          lines: 90
        }
      }
    }
  };
});
