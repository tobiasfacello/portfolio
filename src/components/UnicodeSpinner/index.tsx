//! React Core
import { useState, useEffect } from "react";

//! unicode-animations
import spinners from "unicode-animations";

//* Styles
import { StyledSpinner } from "./styled";

interface UnicodeSpinnerProps {
	name?: keyof typeof spinners;
	className?: string;
	style?: React.CSSProperties;
}

export default function UnicodeSpinner({
	name = "braille",
	className,
	style,
}: UnicodeSpinnerProps) {
	const spinner = spinners[name];
	const [frameIndex, setFrameIndex] = useState(0);

	useEffect(() => {
		const id = setInterval(() => {
			setFrameIndex((prev) => (prev + 1) % spinner.frames.length);
		}, spinner.interval);
		return () => clearInterval(id);
	}, [spinner]);

	return (
		<StyledSpinner className={className} style={style}>
			{spinner.frames[frameIndex]}
		</StyledSpinner>
	);
}
