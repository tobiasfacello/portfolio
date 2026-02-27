import { BRAILLE_FRAMES, genPulse, genBreathe, genDiagonalSwipe } from "./braille";

export interface Animation {
	frames: string[];
	interval: number;
	prefix?: string;
}

const animations = {
	// Braille spinners (ported from unicode-animations)
	braille: { frames: BRAILLE_FRAMES, interval: 80 },
	pulse: { frames: genPulse(), interval: 180 },
	breathe: { frames: genBreathe(), interval: 100 },
	diagswipe: { frames: genDiagonalSwipe(), interval: 60 },

	// Custom animations
	typing: {
		prefix: "> ",
		frames: ["_", "█"],
		interval: 700,
	},
} as const satisfies Record<string, Animation>;

export type AnimationName = keyof typeof animations;

export default animations;
