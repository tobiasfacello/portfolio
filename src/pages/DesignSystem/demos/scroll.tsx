//! React
import { useRef } from 'react';

//* Components
import ReadingProgress from '../../../components/interior/ReadingProgress';
import HideOnScroll from '../../../components/interior/HideOnScroll';
import StickyHeader from '../../../components/interior/StickyHeader';
import BlurUpImage from '../../../components/interior/BlurUpImage';
import LogoMarquee from '../../../components/interior/LogoMarquee';

//* Styled
import { StyledDemoStack, StyledDemoButton } from '../styled';
import { StyledScrollArticle, StyledScrollParagraph, StyledBarTitle } from './scroll.styled';

const PARAGRAPHS = [
	'Scroll this box to move the bar. Progress is quantised into steps rather than tracked per pixel — a bar that re-renders on every pixel costs more than it communicates.',
	'Content that grows after load, such as an image finishing, changes the total travel. A ResizeObserver recomputes the ratio instead of trusting the height measured on mount.',
	'When the whole article already fits on screen there is nothing to scroll, so the reading is reported as complete rather than stuck at zero.',
	'The estimate reserves the width of its longest state, so reaching the end cannot make the bar beside it jump sideways.',
	'Reaching the bottom draws the tick on rather than fading it in, so completion reads as an event.',
];

export function ReadingProgressDemo() {
	const scroller = useRef<HTMLDivElement>(null);

	return (
		<StyledDemoStack $w="100%">
			<ReadingProgress scroller={scroller} words={220} steps={24} />
			<StyledScrollArticle ref={scroller}>
				{PARAGRAPHS.map((text, i) => (
					<StyledScrollParagraph key={i}>{text}</StyledScrollParagraph>
				))}
			</StyledScrollArticle>
		</StyledDemoStack>
	);
}

const MARQUEE_ITEMS = [
	'React', 'TypeScript', 'GSAP', 'styled-components', 'Vite', 'Lenis', 'Swiper', 'Vercel',
].map((label) => ({ id: label.toLowerCase(), label }));

export function LogoMarqueeDemo() {
	return (
		<StyledDemoStack $w="100%">
			<LogoMarquee items={MARQUEE_ITEMS} label="Stack" speed={38} />
		</StyledDemoStack>
	);
}

export function StickyHeaderDemo() {
	return (
		<StyledDemoStack $w="100%">
			<StickyHeader
				title="Deployment log"
				subtitle="Scroll to condense the header"
				maxHeight={220}
				actions={<StyledDemoButton>Share</StyledDemoButton>}
			>
				{PARAGRAPHS.map((text, i) => (
					<StyledScrollParagraph key={i}>{text}</StyledScrollParagraph>
				))}
			</StickyHeader>
		</StyledDemoStack>
	);
}

/** A 3×2 gradient encoded inline — enough to stand in for a real preview. */
const PLACEHOLDER =
	'data:image/svg+xml;utf8,' +
	encodeURIComponent(
		'<svg xmlns="http://www.w3.org/2000/svg" width="3" height="2"><rect width="3" height="2" fill="%23444738"/><rect width="2" height="1" fill="%23c5c7bc" opacity="0.5"/></svg>',
	);

export function BlurUpImageDemo() {
	return (
		<StyledDemoStack $w="260px">
			<BlurUpImage
				// Deliberately unresolvable, to show the error state rather than a
				// broken-image glyph.
				src="/design-system-demo-image.jpg"
				alt="A placeholder preview that never resolves"
				width={640}
				height={400}
				placeholder={PLACEHOLDER}
			/>
		</StyledDemoStack>
	);
}

export function HideOnScrollDemo() {
	return (
		<StyledDemoStack $w="100%">
			<HideOnScroll
				barHeight={44}
				maxHeight={220}
				label="Release notes"
				bar={
					<>
						<StyledBarTitle>Release notes</StyledBarTitle>
						<StyledDemoButton>Filter</StyledDemoButton>
					</>
				}
			>
				{PARAGRAPHS.map((text, i) => (
					<StyledScrollParagraph key={i}>{text}</StyledScrollParagraph>
				))}
			</HideOnScroll>
		</StyledDemoStack>
	);
}
