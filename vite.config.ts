import { defineConfig, type Plugin } from 'vite'
import react from '@vitejs/plugin-react'
import svgr from 'vite-plugin-svgr'
import { PROFILE_IMAGE_SIZES, PROFILE_IMAGE_VARIANTS } from './src/config/profileImage'
import { SUPPORTED_LANGUAGES, LAZY_LANGUAGES } from './src/i18n/languages'

// Preloads for resources React or CSS would otherwise only discover late, using
// their hashed build URLs:
// - The visitor's language chunk (es/pt). main.tsx holds the first render until
//   it's registered, and the entry only imports it once it has run — a serial
//   round trip before first paint. An inline script resolves the language like
//   getInitialLanguage() (stored choice, then navigator.languages) and
//   modulepreloads that chunk so it downloads alongside the entry. All routes.
// - The home page's LCP element, the dark-theme profile photo, whose <img> only
//   exists once the JS bundle runs. An inline script preloads it (same srcset /
//   sizes as the <img>) while the HTML is still parsing. It mirrors ThemeContext
//   — skipped for a stored or system light theme, whose photo is inlined — and
//   only runs on "/".
// - The Geist Pixel webfont used by above-the-fold headings and labels, which
//   is otherwise requested only after the CSS is parsed and the text styled.
function criticalPreloads(): Plugin {
  return {
    name: 'critical-preloads',
    apply: 'build',
    transformIndexHtml: {
      order: 'post',
      handler(_html, ctx) {
        const assets = Object.values(ctx.bundle ?? {}).filter((chunk) => chunk.type === 'asset')
        const assetUrl = (file: string) => {
          const asset = assets.find((a) => a.names.includes(file))
          if (!asset) throw new Error(`critical-preloads: ${file} not found in the bundle`)
          return `/${asset.fileName}`
        }
        const srcset = PROFILE_IMAGE_VARIANTS.map(({ file, width }) => `${assetUrl(file)} ${width}w`).join(', ')

        const chunks = Object.values(ctx.bundle ?? {}).filter((chunk) => chunk.type === 'chunk')
        const localeChunks = Object.fromEntries(LAZY_LANGUAGES.map((code) => {
          const chunk = chunks.find((c) => c.facadeModuleId?.endsWith(`/src/i18n/locales/${code}/index.ts`))
          if (!chunk) throw new Error(`critical-preloads: locale chunk for "${code}" not found in the bundle`)
          return [code, `/${chunk.fileName}`]
        }))

        return [
          {
            tag: 'link',
            injectTo: 'head',
            attrs: { rel: 'preload', as: 'font', type: 'font/woff2', href: assetUrl('GeistPixel-Circle.woff2'), crossorigin: '' },
          },
          {
            tag: 'script',
            injectTo: 'head',
            children:
              `(function(){try{var s=${JSON.stringify(SUPPORTED_LANGUAGES)},c=localStorage.getItem('language');` +
              `if(s.indexOf(c)<0){c='en';var n=navigator.languages||[navigator.language];` +
              `for(var i=0;i<n.length;i++){var x=n[i].split('-')[0].toLowerCase();if(s.indexOf(x)>-1){c=x;break}}}` +
              `var u=${JSON.stringify(localeChunks)}[c];if(!u)return;` +
              `var l=document.createElement('link');l.rel='modulepreload';l.href=u;l.crossOrigin='';` +
              `document.head.appendChild(l)}catch(e){}})();`,
          },
          {
            tag: 'script',
            injectTo: 'head',
            children:
              `(function(){try{if(location.pathname!=='/')return;var t=localStorage.getItem('theme');` +
              `if(t==='light'||(t!=='dark'&&!matchMedia('(prefers-color-scheme: dark)').matches))return;` +
              `var l=document.createElement('link');l.rel='preload';l.as='image';` +
              `l.setAttribute('imagesrcset',${JSON.stringify(srcset)});` +
              `l.setAttribute('imagesizes',${JSON.stringify(PROFILE_IMAGE_SIZES)});` +
              `l.setAttribute('fetchpriority','high');document.head.appendChild(l)}catch(e){}})();`,
          },
        ]
      },
    },
  }
}

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
  plugins: [react(), svgr(), criticalPreloads()],
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
