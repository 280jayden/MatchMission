import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    host: true,
    allowedHosts: true, // this would allow all hosts but you can also put your specific codio url here if u want
    proxy: {
      '/api': 'http://localhost:5000',
    },
  },
});
