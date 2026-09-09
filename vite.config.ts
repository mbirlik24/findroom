import { defineConfig } from 'vite';

export default defineConfig({
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          firebase: ['firebase/app', 'firebase/firestore', 'firebase/analytics'],
          react: ['react', 'react-dom'],
          icons: ['react-icons/fa'],
        },
      },
    },
  },
});
