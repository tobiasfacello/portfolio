//! React Core
import { memo, useRef, useEffect, useMemo, useState } from "react";

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

// Pauses animations when the tab is hidden or the component is offscreen.
// Avoids burning CPU and triggering repaints on animations nobody can see.
function useAnimationActive(
	targetRef: React.RefObject<HTMLElement | null>,
): boolean {
	const [active, setActive] = useState(true);

	useEffect(() => {
		const el = targetRef.current;
		if (!el) return;

		let inView = true;
		let visible =
			typeof document === "undefined" ? true : !document.hidden;

		const update = () => setActive(inView && visible);

		const io = new IntersectionObserver(
			(entries) => {
				inView = entries[0]?.isIntersecting ?? false;
				update();
			},
			{ threshold: 0 },
		);
		io.observe(el);

		const onVisibility = () => {
			visible = !document.hidden;
			update();
		};
		document.addEventListener("visibilitychange", onVisibility);

		return () => {
			io.disconnect();
			document.removeEventListener("visibilitychange", onVisibility);
		};
	}, [targetRef]);

	return active;
}

export default memo(function UnicodeAnimation({
	name,
	className,
	style,
}: UnicodeAnimationProps) {
	const animation = animations[name] as { frames: readonly string[]; interval: number; prefix?: string };
	const hasPrefix = !!animation.prefix;
	const wrapperRef = useRef<HTMLSpanElement>(null);
	const spanRef = useRef<HTMLSpanElement>(null);
	const charRefs = useRef<(HTMLSpanElement | null)[]>([]);
	const frameRef = useRef(0);

	const maxChars = useMemo(
		() => Math.max(...animation.frames.map((f) => f.length)),
		[animation.frames],
	);

	const active = useAnimationActive(wrapperRef);

	// Simple mode: direct textContent swap (braille spinners)
	useEffect(() => {
		if (hasPrefix || !active) return;

		const span = spanRef.current;
		if (!span) return;

		span.textContent = animation.frames[frameRef.current] ?? animation.frames[0];

		const id = setInterval(() => {
			const nextIndex = (frameRef.current + 1) % animation.frames.length;
			frameRef.current = nextIndex;
			span.textContent = animation.frames[nextIndex];
		}, animation.interval);

		return () => clearInterval(id);
	}, [animation, hasPrefix, active]);

	// Per-char mode: opacity crossfade (custom animations with prefix)
	useEffect(() => {
		if (!hasPrefix || !active) return;

		const chars = charRefs.current;
		const startFrame = animation.frames[frameRef.current] ?? animation.frames[0];
		chars.forEach((span, i) => {
			if (!span) return;
			span.textContent = i < startFrame.length ? startFrame[i] : "";
			span.style.opacity = "1";
		});

		let pendingTimeouts: ReturnType<typeof setTimeout>[] = [];

		const id = setInterval(() => {
			const nextIndex = (frameRef.current + 1) % animation.frames.length;
			frameRef.current = nextIndex;
			const frame = animation.frames[nextIndex];

			pendingTimeouts.forEach(clearTimeout);
			pendingTimeouts = [];

			chars.forEach((span, i) => {
				if (!span) return;
				const target = i < frame.length ? frame[i] : "";
				const current = span.textContent ?? "";

				if (target !== current) {
					span.style.opacity = "0";
					pendingTimeouts.push(setTimeout(() => {
						span.textContent = target;
						span.style.opacity = "1";
					}, 150));
				}
			});
		}, animation.interval);

		return () => {
			clearInterval(id);
			pendingTimeouts.forEach(clearTimeout);
		};
	}, [animation, hasPrefix, active]);

	// Simple mode render
	if (!hasPrefix) {
		return (
			<StyledAnimation ref={wrapperRef} className={className} style={style}>
				<span ref={spanRef}>{animation.frames[0]}</span>
			</StyledAnimation>
		);
	}

	// Per-char mode render
	return (
		<StyledAnimation ref={wrapperRef} className={className} style={style}>
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
