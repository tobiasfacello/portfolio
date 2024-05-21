import ReactLenis from "lenis/react";
import "./App.css";
import Home from "./pages/Home";

function App() {
	return (
		<>
			<ReactLenis options={{ duration: 2.2 }} root>
				<Home></Home>
			</ReactLenis>
		</>
	);
}

export default App;
