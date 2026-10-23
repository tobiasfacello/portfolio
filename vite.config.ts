import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import svgr from 'vite-plugin-svgr'

// Long-lived vendor chunks: grouped by how often they change and whether the
// home page needs them on first load. React (incl. react-dom/client and the
// scheduler, which the old object form left in the app chunk) and Lenis are
// critical; GSAP is only used by the lazily loaded work-detail lightbox, so it
// must not share a chunk with anything the home page imports.
// Rollup's CommonJS interop helpers (`\0commonjsHelpers.js`) live with React:
// left unassigned they land in whichever chunk claims them first, and a helper
// in `i18n` imported by `vendor` (which `i18n` imports React from) is a chunk
// cycle that leaves React undefined at evaluation time.
const VENDOR_CHUNKS: [chunk: string, pattern: RegExp][] = [
	['vendor', /^\0commonjsHelpers|\/node_modules\/(react|react-dom|scheduler|react-router|react-router-dom|cookie|set-cookie-parser|use-sync-external-store|lenis|@darkroom\.engineering)\//],
	['styles', /\/node_modules\/(styled-components|stylis|@emotion|tslib|shallowequal)\//],
	['i18n', /\/node_modules\/(i18next|react-i18next|html-parse-stringify|void-elements)\//],
	['gsap', /\/node_modules\/(gsap|@gsap)\//],
	['swiper', /\/node_modules\/(swiper|ssr-window|dom7)\//],
]

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), svgr()],
  build: {
    target: 'es2022',
    rollupOptions: {
      output: {
        manualChunks(id) {
          return VENDOR_CHUNKS.find(([, pattern]) => pattern.test(id))?.[0]
        },
      },
    },
  },
})
