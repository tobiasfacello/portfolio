import React from "react";
import ReactDOM from "react-dom/client";
import { i18nReady } from "./i18n";
import App from "./App.tsx";
import "./index.css";

// A tab opened before a deploy asks for chunks that no longer exist (a language
// switch, a work page). Reload once to get the new build; a second failure right
// after a reload is a real error, so it's left to surface instead of looping.
const RELOAD_KEY = "chunk-reload-at";
window.addEventListener("vite:preloadError", () => {
	try {
		if (Date.now() - Number(sessionStorage.getItem(RELOAD_KEY)) < 10_000) return;
		sessionStorage.setItem(RELOAD_KEY, String(Date.now()));
	} catch {
		return;
	}
	window.location.reload();
});

// Wait for the visitor's language bundle (a no-op for English) so the first
// paint is already translated.
i18nReady.then(() => {
	ReactDOM.createRoot(document.getElementById("root")!).render(
		<React.StrictMode>
			<App />
		</React.StrictMode>
	);
});
