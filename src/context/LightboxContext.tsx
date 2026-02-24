//! React Core
import { createContext, useContext, useState, useRef, useCallback, useMemo } from "react";

//?  Types
import type { LightboxImage, LightboxContextType } from "../types";

const LightboxContext = createContext<LightboxContextType | null>(null);

export function LightboxProvider({ children }: { children: React.ReactNode }) {
	const [images, setImages] = useState<LightboxImage[]>([]);
	const [isOpen, setIsOpen] = useState(false);
	const [currentIndex, setCurrentIndex] = useState(0);
	const [direction, setDirection] = useState<1 | -1>(1);

	const registryRef = useRef<Map<symbol, LightboxImage[]>>(new Map());

	const rebuildImages = useCallback(() => {
		const flat: LightboxImage[] = [];
		for (const imgs of registryRef.current.values()) {
			flat.push(...imgs);
		}
		setImages(flat);
	}, []);

	const register = useCallback(
		(imgs: LightboxImage[]) => {
			const key = Symbol();
			registryRef.current.set(key, imgs);
			rebuildImages();

			return () => {
				registryRef.current.delete(key);
				rebuildImages();
			};
		},
		[rebuildImages]
	);

	const open = useCallback(
		(src: string) => {
			const flat: LightboxImage[] = [];
			for (const imgs of registryRef.current.values()) {
				flat.push(...imgs);
			}
			const idx = flat.findIndex((img) => img.src === src);
			if (idx !== -1) {
				setImages(flat);
				setCurrentIndex(idx);
				setIsOpen(true);
			}
		},
		[]
	);

	const close = useCallback(() => {
		setIsOpen(false);
	}, []);

	const prev = useCallback(() => {
		setDirection(-1);
		setCurrentIndex((i) => (i > 0 ? i - 1 : images.length - 1));
	}, [images.length]);

	const next = useCallback(() => {
		setDirection(1);
		setCurrentIndex((i) => (i < images.length - 1 ? i + 1 : 0));
	}, [images.length]);

	const value = useMemo(
		() => ({ register, open, close, prev, next, currentIndex, isOpen, images, direction }),
		[register, open, close, prev, next, currentIndex, isOpen, images, direction]
	);

	return (
		<LightboxContext.Provider value={value}>
			{children}
		</LightboxContext.Provider>
	);
}

export function useLightbox() {
	const ctx = useContext(LightboxContext);
	if (!ctx) throw new Error("useLightbox must be used within LightboxProvider");
	return ctx;
}
