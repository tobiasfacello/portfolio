import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import svgr from 'vite-plugin-svgr'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), svgr()],
  build: {
    target: 'es2022',
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom', 'react-router-dom'],
          animation: ['gsap', '@gsap/react', 'lenis'],
          swiper: ['swiper'],
          i18n: ['i18next', 'react-i18next'],
          styles: ['styled-components'],
        },
      },
    },
  },
})
