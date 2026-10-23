import { BREAKPOINTS } from './breakpoints';

// Rendered width of the profile photo per breakpoint (Profile.tsx). Shared with
// the LCP preload that vite.config.ts injects into index.html, which must match
// the <img> exactly or the browser downloads the photo twice.
export const PROFILE_IMAGE_SIZES =
	`(min-width: ${BREAKPOINTS['desktop-lg']}px) 345px, (min-width: ${BREAKPOINTS['desktop-sm']}px) 275px, 175px`;

// Original file names of the dark-theme variants, used to look up their hashed
// URLs in the build output.
export const PROFILE_IMAGE_VARIANTS = [
	{ file: 'profile-360.webp', width: 360 },
	{ file: 'profile.webp', width: 600 },
] as const;
