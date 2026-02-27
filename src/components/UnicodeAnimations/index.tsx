//! React Core
import { memo, useRef, useEffect, useMemo } from "react";

//? Animations registry
import animations from "./animations";
import type { AnimationName } from "./animations";

//* Styles
import { StyledAnimation, CharSpan } from "./styled";

interface UnicodeAnimationProps {
	name: AnimationName;
	className?: string;
	style?: React.CSSProperties;
}

export default memo(function UnicodeAnimation({
	name,
	className,
	style,
}: UnicodeAnimationProps) {
	const animation = animations[name] as { frames: readonly string[]; interval: number; prefix?: string };
	const hasPrefix = !!animation.prefix;
	const spanRef = useRef<HTMLSpanElement>(null);
	const charRefs = useRef<(HTMLSpanElement | null)[]>([]);
	const frameRef = useRef(0);

	const maxChars = useMemo(
		() => Math.max(...animation.frames.map((f) => f.length)),
		[animation.frames],
	);

	// Simple mode: direct textContent swap (braille spinners)
	useEffect(() => {
		if (hasPrefix) return;

		const span = spanRef.current;
		if (!span) return;

		span.textContent = animation.frames[0];
		frameRef.current = 0;

		const id = setInterval(() => {
			const nextIndex = (frameRef.current + 1) % animation.frames.length;
			frameRef.current = nextIndex;
			span.textContent = animation.frames[nextIndex];
		}, animation.interval);

		return () => clearInterval(id);
	}, [animation, hasPrefix]);

	// Per-char mode: opacity crossfade (custom animations with prefix)
	useEffect(() => {
		if (!hasPrefix) return;

		const chars = charRefs.current;
		const first = animation.frames[0];
		chars.forEach((span, i) => {
			if (!span) return;
			span.textContent = i < first.length ? first[i] : "";
			span.style.opacity = "1";
		});
		frameRef.current = 0;

		const id = setInterval(() => {
			const nextIndex = (frameRef.current + 1) % animation.frames.length;
			frameRef.current = nextIndex;
			const frame = animation.frames[nextIndex];

			chars.forEach((span, i) => {
				if (!span) return;
				const target = i < frame.length ? frame[i] : "";
				const current = span.textContent ?? "";

				if (target !== current) {
					span.style.opacity = "0";
					setTimeout(() => {
						span.textContent = target;
						span.style.opacity = "1";
					}, 150);
				}
			});
		}, animation.interval);

		return () => clearInterval(id);
	}, [animation, hasPrefix]);

	// Simple mode render
	if (!hasPrefix) {
		return (
			<StyledAnimation className={className} style={style}>
				<span ref={spanRef}>{animation.frames[0]}</span>
			</StyledAnimation>
		);
	}

	// Per-char mode render
	return (
		<StyledAnimation className={className} style={style}>
			<span>{animation.prefix}</span>
			{Array.from({ length: maxChars }, (_, i) => (
				<CharSpan
					key={i}
					ref={(el) => { charRefs.current[i] = el; }}
				/>
			))}
		</StyledAnimation>
	);
});
