import ReactLenis from "lenis/react";
import { ThemeProvider } from "./context/ThemeContext";
import { SplashProvider, useSplash } from "./context/SplashContext";
import Cursor from "./components/Cursor";
import Home from "./pages/Home";
import SplashScreen from "./components/SplashScreen";
import "./App.css";

function AppContent() {
	const { isSplashActive } = useSplash();

	return (
		<>
			{isSplashActive && <SplashScreen />}
			<ReactLenis options={{ lerp: 0.1, duration: 1.7, smoothWheel: true }} root>
				<ThemeProvider>
					<Cursor />
					<Home />
				</ThemeProvider>
			</ReactLenis>
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
