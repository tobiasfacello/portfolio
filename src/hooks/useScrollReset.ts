import { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { useLenis } from 'lenis/react';

export function useScrollReset() {
	const { pathname } = useLocation();
	const lenis = useLenis();
	const lenisRef = useRef(lenis);
	lenisRef.current = lenis;

	useEffect(() => {
		const instance = lenisRef.current;
		if (instance) {
			instance.scrollTo(0, { immediate: true });
		} else {
			window.scrollTo(0, 0);
		}
	}, [pathname]);
}
