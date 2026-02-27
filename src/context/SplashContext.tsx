//! React Core
import { createContext, useContext, useState, useRef, useCallback, useMemo } from "react";

interface SplashContextType {
	isSplashActive: boolean;
	isSplashComplete: boolean;
	headerLogoRef: React.MutableRefObject<HTMLElement | null>;
	setSplashComplete: () => void;
	dismissSplash: () => void;
}

const SplashContext = createContext<SplashContextType | null>(null);

export function SplashProvider({ children }: { children: React.ReactNode }) {
	const [isSplashActive, setIsSplashActive] = useState(true);
	const [isSplashComplete, setIsSplashComplete] = useState(false);
	const headerLogoRef = useRef<HTMLElement | null>(null);

	// Renders the header logo (behind the still-opaque overlay)
	const setSplashComplete = useCallback(() => {
		setIsSplashComplete(true);
	}, []);

	// Unmounts the splash screen (after overlay fade)
	const dismissSplash = useCallback(() => {
		setIsSplashActive(false);
	}, []);

	const value = useMemo(
		() => ({ isSplashActive, isSplashComplete, headerLogoRef, setSplashComplete, dismissSplash }),
		[isSplashActive, isSplashComplete, headerLogoRef, setSplashComplete, dismissSplash]
	);

	return (
		<SplashContext.Provider value={value}>
			{children}
		</SplashContext.Provider>
	);
}

// eslint-disable-next-line react-refresh/only-export-components
export function useSplash() {
	const ctx = useContext(SplashContext);
	if (!ctx) throw new Error("useSplash must be used within SplashProvider");
	return ctx;
}
