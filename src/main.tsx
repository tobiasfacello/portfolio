import React from "react";
import ReactDOM from "react-dom/client";
import { i18nReady } from "./i18n";
import App from "./App.tsx";
import "./index.css";

// Wait for the visitor's language bundle (a no-op for English) so the first
// paint is already translated.
i18nReady.then(() => {
	ReactDOM.createRoot(document.getElementById("root")!).render(
		<React.StrictMode>
			<App />
		</React.StrictMode>
	);
});
