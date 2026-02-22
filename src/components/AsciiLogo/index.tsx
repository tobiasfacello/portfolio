//! React Core
import { useRef, forwardRef, useImperativeHandle } from "react";

//! GSAP
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
gsap.registerPlugin(useGSAP);

//* Styles
import { StyledAsciiLogo, AsciiLine } from "./styled";

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
const glitchPalette = ["var(--text)", "var(--accent)", "var(--secondary)"];

function randomGlitchChar() {
	return glitchChars[Math.floor(Math.random() * glitchChars.length)];
}

function randomGlitchColor() {
	return glitchPalette[Math.floor(Math.random() * glitchPalette.length)];
}

function randomGlitchOpacity() {
	return (0.3 + Math.random() * 0.7).toFixed(2);
}

interface AsciiLogoProps {
	skipAnimation?: boolean;
	onAnimationComplete?: () => void;
}

const AsciiLogo = forwardRef<HTMLHeadingElement, AsciiLogoProps>(
	function AsciiLogo({ skipAnimation = false, onAnimationComplete }, ref) {
		const containerRef = useRef<HTMLHeadingElement | null>(null);
		const lineRefs = useRef<(HTMLSpanElement | null)[]>([]);

		useImperativeHandle(ref, () => containerRef.current!);

		useGSAP(
			() => {
				const lines = lineRefs.current.filter(Boolean) as HTMLSpanElement[];
				if (lines.length === 0) return;

				if (skipAnimation) {
					// Set final state immediately
					lines.forEach((lineEl, i) => {
						const chars = lineEl.children;
						const finalLine = asciiLines[i];
						for (let j = 0; j < chars.length; j++) {
							const span = chars[j] as HTMLSpanElement;
							span.textContent = finalLine[j];
							span.style.color = "";
							span.style.opacity = "";
						}
						lineEl.style.opacity = String(asciiOpacities[i]);
					});
					return;
				}

				// Wave timing: left→right (60%) + top→bottom (25%) + noise (15%)
				const resolveTimings = asciiLines.map((line, i) =>
					[...line].map((ch, j) => {
						if (ch === " ") return 0;
						const nx = j / line.length;
						const ny = i / asciiLines.length;
						return nx * 0.6 + ny * 0.25 + Math.random() * 0.15;
					})
				);

				// Track resolved characters to skip redundant DOM writes
				const resolved = asciiLines.map((line) => new Array(line.length).fill(false));

				// Frame counters for 30fps throttling (skip every other frame)
				let phase1Frame = 0;
				let phase2Frame = 0;

				// Hint browser about upcoming opacity changes on line elements
				lines.forEach((lineEl) => {
					lineEl.style.willChange = "opacity";
				});

				// Init: set each char span to a random glitch char + color + opacity
				lines.forEach((lineEl, i) => {
					const chars = lineEl.children;
					const finalLine = asciiLines[i];
					for (let j = 0; j < chars.length; j++) {
						const span = chars[j] as HTMLSpanElement;
						const ch = finalLine[j];
						if (ch === " ") {
							span.textContent = " ";
						} else {
							span.textContent = randomGlitchChar();
							span.style.color = randomGlitchColor();
							span.style.opacity = randomGlitchOpacity();
						}
					}
					lineEl.style.opacity = "1";
				});

				const tl = gsap.timeline({
					onComplete() {
						// Release will-change after all animations complete
						lines.forEach((lineEl) => {
							lineEl.style.willChange = "auto";
						});
						onAnimationComplete?.();
					},
				});

				// Phase 1 — Wave Resolve (~1.1s)
				const resolveProxy = { progress: 0 };
				tl.to(resolveProxy, {
					progress: 1,
					duration: 1.1,
					ease: "power2.inOut",
					onUpdate() {
						if (++phase1Frame % 2 !== 0) return;
						const p = resolveProxy.progress;
						lines.forEach((lineEl, i) => {
							const finalLine = asciiLines[i];
							const timings = resolveTimings[i];
							const chars = lineEl.children;
							for (let j = 0; j < chars.length; j++) {
								const ch = finalLine[j];
								if (ch === " ") continue;
								const span = chars[j] as HTMLSpanElement;
								if (p >= timings[j]) {
									if (!resolved[i][j]) {
										resolved[i][j] = true;
										span.textContent = ch;
										span.style.color = "";
									}
									span.style.opacity = randomGlitchOpacity();
								} else {
									span.textContent = randomGlitchChar();
									span.style.color = randomGlitchColor();
									span.style.opacity = randomGlitchOpacity();
								}
							}
						});
					},
					onComplete() {
						lines.forEach((lineEl, i) => {
							const chars = lineEl.children;
							const finalLine = asciiLines[i];
							for (let j = 0; j < chars.length; j++) {
								const span = chars[j] as HTMLSpanElement;
								span.textContent = finalLine[j];
								span.style.color = "";
								span.style.opacity = finalLine[j] === " " ? "" : randomGlitchOpacity();
							}
						});
					},
				});

				// Phase 2 — Re-arrangement glitch (~0.4s)
				const rearrangeProxy = { t: 0 };
				tl.to(rearrangeProxy, {
					t: 1,
					duration: 0.4,
					ease: "power2.in",
					onUpdate() {
						if (++phase2Frame % 2 !== 0) return;
						const t = rearrangeProxy.t;
						const prob = Math.max(0, 0.35 * (1 - t * t));
						lines.forEach((lineEl, i) => {
							const chars = lineEl.children;
							const finalLine = asciiLines[i];
							for (let j = 0; j < chars.length; j++) {
								const ch = finalLine[j];
								if (ch === " ") continue;
								const span = chars[j] as HTMLSpanElement;
								if (Math.random() < prob) {
									span.textContent = randomGlitchChar();
									span.style.color = randomGlitchColor();
									span.style.opacity = randomGlitchOpacity();
								} else {
									span.textContent = ch;
									span.style.color = "";
									const settled = 0.3 + Math.random() * 0.7;
									const blended = settled + (1 - settled) * t;
									span.style.opacity = blended.toFixed(2);
								}
							}
						});
					},
					onComplete() {
						lines.forEach((lineEl, i) => {
							const chars = lineEl.children;
							const finalLine = asciiLines[i];
							for (let j = 0; j < chars.length; j++) {
								const span = chars[j] as HTMLSpanElement;
								span.textContent = finalLine[j];
								span.style.color = "";
								span.style.opacity = "";
							}
						});
					},
				});

				// Phase 3 — Opacity Cascade (~0.4s, stagger 0.04)
				tl.to(lines, {
					opacity: (_i: number, _t: HTMLSpanElement, targets: HTMLSpanElement[]) =>
						asciiOpacities[targets.indexOf(_t)],
					stagger: 0.04,
					duration: 0.4,
					ease: "power2.out",
				});
			},
			{ scope: containerRef, dependencies: [skipAnimation] }
		);

		return (
			<StyledAsciiLogo ref={containerRef} aria-label="FACHE">
				{asciiLines.map((line, i) => (
					<AsciiLine
						key={i}
						ref={(el: HTMLSpanElement | null) => {
							lineRefs.current[i] = el;
						}}
					>
						{[...line].map((_, j) => (
							<span key={j} />
						))}
					</AsciiLine>
				))}
			</StyledAsciiLogo>
		);
	}
);

export default AsciiLogo;
