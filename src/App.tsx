import ReactLenis from "lenis/react";
import { ThemeProvider } from "./context/ThemeContext";
import Cursor from "./components/Cursor";
import MediaQuery from "react-responsive";
import Home from "./pages/Home";
import "./App.css";

function App() {
	return (
		<>
			<MediaQuery minWidth={360} maxWidth={767}>
				<ReactLenis options={{ lerp: 0.1, duration: 1.7, smoothWheel: true }} root>
					<ThemeProvider>
						<Home />
					</ThemeProvider >
				</ReactLenis>
			</MediaQuery>
			<MediaQuery minWidth={768}>
				<ReactLenis options={{ lerp: 0.1, duration: 1.7, smoothWheel: true }} root>
					<ThemeProvider>
						<Cursor />
						<Home />
					</ThemeProvider >
				</ReactLenis>
			</MediaQuery>
		</>
	);
}

export default App;
