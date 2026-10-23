// Languages the site ships. English is bundled with the entry chunk; the others
// are one lazy chunk each (locales/<code>/index.ts), which index.html preloads
// for the visitor's language (criticalPreloads in vite.config.ts).
export const SUPPORTED_LANGUAGES = ['en', 'es', 'pt'];
export const LAZY_LANGUAGES = ['es', 'pt'];
