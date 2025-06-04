import ReactLenis from "lenis/react";
import { ThemeProvider } from "./context/ThemeContext";
import Cursor from "./components/Cursor";
import Home from "./pages/Home";
import "./App.css";

function App() {
	return (
		<>
			<ReactLenis options={{ duration: 2.2 }} root>
				<ThemeProvider>
					<Cursor />
					<Home />
				</ThemeProvider >
			</ReactLenis>
		</>
	);
}

export default App;
