// Braille grid utilities — ported from unicode-animations library

const BRAILLE_DOT_MAP = [
	[1, 8],
	[2, 16],
	[4, 32],
	[64, 128],
];

function gridToBraille(grid: boolean[][]): string {
	const rows = grid.length;
	const cols = grid[0] ? grid[0].length : 0;
	const charCount = Math.ceil(cols / 2);
	let result = "";
	for (let c = 0; c < charCount; c++) {
		let code = 0x2800;
		for (let r = 0; r < 4 && r < rows; r++) {
			for (let d = 0; d < 2; d++) {
				const col = c * 2 + d;
				if (col < cols && grid[r] && grid[r][col]) {
					code |= BRAILLE_DOT_MAP[r][d];
				}
			}
		}
		result += String.fromCodePoint(code);
	}
	return result;
}

function makeGrid(rows: number, cols: number): boolean[][] {
	if (rows <= 0 || cols <= 0) return [];
	return Array.from({ length: rows }, () => Array(cols).fill(false));
}

// --- Generators for used animations ---

export function genPulse(): string[] {
	const W = 6, H = 4, frames: string[] = [];
	const cx = W / 2 - 0.5, cy = H / 2 - 0.5;
	const radii = [0.5, 1.2, 2, 3, 3.5];
	for (const r of radii) {
		const g = makeGrid(H, W);
		for (let row = 0; row < H; row++) {
			for (let col = 0; col < W; col++) {
				const dist = Math.sqrt((col - cx) ** 2 + (row - cy) ** 2);
				if (Math.abs(dist - r) < 0.9) g[row][col] = true;
			}
		}
		frames.push(gridToBraille(g));
	}
	return frames;
}

export function genBreathe(): string[] {
	const stages: number[][][] = [
		[],
		[[1, 0]],
		[[0, 1], [2, 0]],
		[[0, 0], [1, 1], [3, 0]],
		[[0, 0], [1, 1], [2, 0], [3, 1]],
		[[0, 0], [0, 1], [1, 1], [2, 0], [3, 1]],
		[[0, 0], [0, 1], [1, 0], [2, 1], [3, 0], [3, 1]],
		[[0, 0], [0, 1], [1, 0], [1, 1], [2, 0], [3, 0], [3, 1]],
		[[0, 0], [0, 1], [1, 0], [1, 1], [2, 0], [2, 1], [3, 0], [3, 1]],
	];
	const frames: string[] = [];
	const sequence = [...stages, ...stages.slice().reverse().slice(1)];
	for (const dots of sequence) {
		const g = makeGrid(4, 2);
		for (const [r, c] of dots) g[r][c] = true;
		frames.push(gridToBraille(g));
	}
	return frames;
}

export function genDiagonalSwipe(): string[] {
	const W = 4, H = 4, frames: string[] = [];
	const maxDiag = W + H - 2;
	for (let d = 0; d <= maxDiag; d++) {
		const g = makeGrid(H, W);
		for (let r = 0; r < H; r++) {
			for (let c = 0; c < W; c++) {
				if (r + c <= d) g[r][c] = true;
			}
		}
		frames.push(gridToBraille(g));
	}
	const full = makeGrid(H, W);
	for (let r = 0; r < H; r++) for (let c = 0; c < W; c++) full[r][c] = true;
	frames.push(gridToBraille(full));
	for (let d = 0; d <= maxDiag; d++) {
		const g = makeGrid(H, W);
		for (let r = 0; r < H; r++) {
			for (let c = 0; c < W; c++) {
				if (r + c > d) g[r][c] = true;
			}
		}
		frames.push(gridToBraille(g));
	}
	frames.push(gridToBraille(makeGrid(H, W)));
	return frames;
}

// Classic braille single-char spinner
export const BRAILLE_FRAMES = [
	"\u280B", "\u2819", "\u2839", "\u2838", "\u283C",
	"\u2834", "\u2826", "\u2827", "\u2807", "\u280F",
];
