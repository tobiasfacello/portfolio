//! React Core
import { createContext, useContext, useState, useRef, useCallback, useMemo } from "react";

//?  Types
import type { LightboxImage, LightboxActions, LightboxState, LightboxContextType } from "../types";

// Actions and state live in separate contexts: the galleries only register
// images and open the viewer, so they read the stable actions and don't
// re-render on every open / close / prev / next — only the Lightbox does.
const LightboxActionsContext = createContext<LightboxActions | null>(null);
const LightboxStateContext = createContext<LightboxState | null>(null);

function flattenRegistry(registry: Map<symbol, LightboxImage[]>): LightboxImage[] {
	const flat: LightboxImage[] = [];
	for (const imgs of registry.values()) {
		flat.push(...imgs);
	}
	return flat;
}

export function LightboxProvider({ children }: { children: React.ReactNode }) {
	const [images, setImages] = useState<LightboxImage[]>([]);
	const [isOpen, setIsOpen] = useState(false);
	const [currentIndex, setCurrentIndex] = useState(0);
	const [direction, setDirection] = useState<1 | -1>(1);

	const registryRef = useRef<Map<symbol, LightboxImage[]>>(new Map());
	// Read by prev/next so they stay stable instead of changing with `images`.
	const imagesRef = useRef<LightboxImage[]>([]);
	const isOpenRef = useRef(false);

	const showImages = useCallback((next: LightboxImage[]) => {
		imagesRef.current = next;
		setImages(next);
	}, []);

	// The image list only matters while the viewer is open (open() rebuilds it),
	// so registering — every gallery does it on mount — doesn't touch state.
	const register = useCallback(
		(imgs: LightboxImage[]) => {
			const key = Symbol();
			registryRef.current.set(key, imgs);
			if (isOpenRef.current) showImages(flattenRegistry(registryRef.current));

			return () => {
				registryRef.current.delete(key);
				if (isOpenRef.current) showImages(flattenRegistry(registryRef.current));
			};
		},
		[showImages]
	);

	const open = useCallback(
		(src: string) => {
			const flat = flattenRegistry(registryRef.current);
			const idx = flat.findIndex((img) => img.src === src);
			if (idx !== -1) {
				showImages(flat);
				setCurrentIndex(idx);
				setIsOpen(true);
				isOpenRef.current = true;
			}
		},
		[showImages]
	);

	const close = useCallback(() => {
		setIsOpen(false);
		isOpenRef.current = false;
	}, []);

	const prev = useCallback(() => {
		setDirection(-1);
		setCurrentIndex((i) => (i > 0 ? i - 1 : imagesRef.current.length - 1));
	}, []);

	const next = useCallback(() => {
		setDirection(1);
		setCurrentIndex((i) => (i < imagesRef.current.length - 1 ? i + 1 : 0));
	}, []);

	const actions = useMemo(
		() => ({ register, open, close, prev, next }),
		[register, open, close, prev, next]
	);

	const state = useMemo(
		() => ({ currentIndex, isOpen, images, direction }),
		[currentIndex, isOpen, images, direction]
	);

	return (
		<LightboxActionsContext.Provider value={actions}>
			<LightboxStateContext.Provider value={state}>
				{children}
			</LightboxStateContext.Provider>
		</LightboxActionsContext.Provider>
	);
}

// eslint-disable-next-line react-refresh/only-export-components
export function useLightboxActions(): LightboxActions {
	const ctx = useContext(LightboxActionsContext);
	if (!ctx) throw new Error("useLightboxActions must be used within LightboxProvider");
	return ctx;
}

// eslint-disable-next-line react-refresh/only-export-components
export function useLightbox(): LightboxContextType {
	const actions = useLightboxActions();
	const state = useContext(LightboxStateContext);
	if (!state) throw new Error("useLightbox must be used within LightboxProvider");
	return { ...actions, ...state };
}
