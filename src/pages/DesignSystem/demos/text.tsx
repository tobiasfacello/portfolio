//! React
import { useState } from 'react';

//* Components
import TextReveal from '../../../components/interior/TextReveal';
import IconMorph from '../../../components/interior/IconMorph';
import TypingIndicator from '../../../components/interior/TypingIndicator';
import StreamingText from '../../../components/interior/StreamingText';

//? Hooks
import { useTypingPresence } from '../../../components/interior/TypingIndicator/useTypingPresence';

//* Styled
import { StyledDemoRow, StyledDemoStack, StyledDemoButton } from '../styled';

export function TextRevealDemo() {
	const [run, setRun] = useState(0);

	return (
		<StyledDemoStack $w="100%">
			<TextReveal
				key={run}
				text="Trust is won in the half-second after a click, and lost in exactly the same place."
			/>
			<StyledDemoRow>
				<StyledDemoButton onClick={() => setRun((r) => r + 1)}>Replay</StyledDemoButton>
			</StyledDemoRow>
		</StyledDemoStack>
	);
}

export function IconMorphDemo() {
	return (
		<StyledDemoRow>
			<IconMorph preset="menu-close" semantics="expanded" />
			<IconMorph preset="play-pause" semantics="pressed" />
			<IconMorph preset="plus-minus" />
			<IconMorph preset="check-close" showLabel />
		</StyledDemoRow>
	);
}

export function StreamingTextDemo() {
	return (
		<StyledDemoStack $w="100%">
			<StreamingText
				text={
					'The full paragraph is rendered invisibly underneath, so the block is already its final size before the first character arrives. Nothing below it moves while it types.\n\nThe caret only blinks while waiting — a caret blinking during the stream would compete with the text for attention.'
				}
				tokensPerSecond={22}
			/>
		</StyledDemoStack>
	);
}

export function TypingIndicatorDemo() {
	const { typists, sending, ping, send, reset } = useTypingPresence();

	return (
		<StyledDemoStack>
			<TypingIndicator typists={typists} sending={sending} />
			<StyledDemoRow>
				<StyledDemoButton onClick={() => ping('Ada')}>Ada types</StyledDemoButton>
				<StyledDemoButton onClick={() => ping('Grace')}>Grace types</StyledDemoButton>
				<StyledDemoButton onClick={() => send('Ada')}>Ada sends</StyledDemoButton>
				<StyledDemoButton onClick={reset}>Reset</StyledDemoButton>
			</StyledDemoRow>
		</StyledDemoStack>
	);
}
