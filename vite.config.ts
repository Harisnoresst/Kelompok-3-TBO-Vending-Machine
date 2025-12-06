import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: "/Kelompok-3-TBO-Vending-Machine/",
  optimizeDeps: {
    exclude: ['lucide-react'],
    
  },
});
