import { useSyncExternalStore } from 'react';

const QUERY = '(prefers-reduced-motion: reduce)';

const mql = typeof window !== 'undefined' ? window.matchMedia(QUERY) : null;

function subscribe(callback: () => void) {
	mql?.addEventListener('change', callback);
	return () => { mql?.removeEventListener('change', callback); };
}

function getSnapshot() {
	return mql?.matches ?? false;
}

function getServerSnapshot() {
	return false;
}

export function usePrefersReducedMotion(): boolean {
	return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
