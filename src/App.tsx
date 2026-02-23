import ReactLenis from "lenis/react";
import { ThemeProvider } from "./context/ThemeContext";
import { SplashProvider, useSplash } from "./context/SplashContext";
import Cursor from "./components/Cursor";
import Home from "./pages/Home";
import SplashScreen from "./components/SplashScreen";
import "./App.css";

function AppContent() {
	const { isSplashActive } = useSplash();
	const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

	const content = (
		<ThemeProvider>
			{!prefersReducedMotion && <Cursor />}
			<Home />
		</ThemeProvider>
	);

	return (
		<>
			{isSplashActive && <SplashScreen />}
			{prefersReducedMotion ? (
				content
			) : (
				<ReactLenis options={{ lerp: 0.1, duration: 1.7, smoothWheel: true }} root>
					{content}
				</ReactLenis>
			)}
		</>
	);
}

function App() {
	return (
		<SplashProvider>
			<AppContent />
		</SplashProvider>
	);
}

export default App;
