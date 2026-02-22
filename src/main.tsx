import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./index.css";

const asciiLines = [
	"███████╗ █████╗  ██████╗ ██╗  ██╗███████╗",
	"██╔════╝██╔══██╗██╔════╝ ██║  ██║██╔════╝",
	"█████╗  ███████║██║      ███████║█████╗  ",
	"██╔══╝  ██╔══██║██║      ██╔══██║██╔══╝  ",
	"██║     ██║  ██║╚██████╗ ██║  ██║███████╗",
	"╚═╝     ╚═╝  ╚═╝ ╚═════╝ ╚═╝  ╚═╝╚══════╝",
];
const asciiOpacities = [1, 0.9, 0.75, 0.6, 0.45, 0.3];
const glitchChars = "░▒▓█▀▄╔╗╚╝║═╬╣╠╩╦┼─│┤├┴┬";

function getAsciiSize() {
	const w = window.innerWidth;
	return w < 768 ? 12 :
		w < 960 ? 10.5 :
		w < 1280 ? 9 :
		w < 1440 ? 7.5 :
		w < 1800 ? 6 : 4.5;
}

function printAscii() {
	const size = getAsciiSize();
	console.clear();
	console.log(
		asciiLines.map(() => "%c%s").join("\n"),
		...asciiLines.flatMap((line, i) => [
			`color: rgba(197, 199, 188, ${asciiOpacities[i]}); font-size: ${size}px;`,
			line,
		]),
	);
}

function playGlitchReveal() {
	const totalDuration = 2000;
	const frameInterval = 50;
	const totalFrames = totalDuration / frameInterval;

	const resolveTimings = asciiLines.map((line) =>
		[...line].map((ch) =>
			ch === " " ? 0 : Math.random() * totalFrames
		)
	);

	let frame = 0;
	const interval = setInterval(() => {
		const size = getAsciiSize();
		const progress = frame / totalFrames;

		const renderedLines = asciiLines.map((line, lineIdx) =>
			[...line].map((ch, charIdx) => {
				if (ch === " ") return " ";
				if (frame >= resolveTimings[lineIdx][charIdx]) return ch;
				return glitchChars[Math.floor(Math.random() * glitchChars.length)];
			}).join("")
		);

		console.clear();
		console.log(
			renderedLines.map(() => "%c%s").join("\n"),
			...renderedLines.flatMap((line, i) => {
				const resolved = frame >= Math.max(...resolveTimings[i]);
				const opacity = asciiOpacities[i];
				const r = resolved ? 197 : Math.round(197 * progress);
				const g = resolved ? 199 : Math.round(255 - (255 - 199) * progress);
				const b = resolved ? 188 : Math.round(65 + (188 - 65) * progress);
				return [
					`color: rgba(${r}, ${g}, ${b}, ${opacity}); font-size: ${size}px;`,
					line,
				];
			}),
		);

		frame++;
		if (frame > totalFrames) {
			clearInterval(interval);
			printAscii();
		}
	}, frameInterval);
}

playGlitchReveal();

let resizeTimer: number;
window.addEventListener("resize", () => {
	clearTimeout(resizeTimer);
	resizeTimer = window.setTimeout(printAscii, 300);
});

ReactDOM.createRoot(document.getElementById("root")!).render(
	<React.StrictMode>
		<App />
	</React.StrictMode>
);
