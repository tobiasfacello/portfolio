import styled from 'styled-components';

import { POP_IN_STAGGER_MS, popInAnimation } from './digitPop';

const StyledDigitGroup = styled.span`
	display: inline-flex;
	align-items: baseline;
`;

const StyledDigit = styled.span`
	display: inline-block;
	white-space: pre;
	will-change: transform, opacity, filter;
	${popInAnimation}
`;

type DigitGroupProps = {
	value: string | number | null;
};

// Splits a value into per-character spans, each running the digit pop-in
// keyframe with a staggered animation-delay. Keying this component at the
// call site (`<DigitGroup key={value} ... />`) triggers React to remount it
// when the value changes, replaying the animation for the new content.
function DigitGroup({ value }: DigitGroupProps) {
	const text = value != null ? String(value) : '';
	return (
		<StyledDigitGroup>
			{text.split('').map((char, i) => (
				<StyledDigit
					key={i}
					style={{ animationDelay: `${i * POP_IN_STAGGER_MS}ms` }}
				>
					{char}
				</StyledDigit>
			))}
		</StyledDigitGroup>
	);
}

export default DigitGroup;
