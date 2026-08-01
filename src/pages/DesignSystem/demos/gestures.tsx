//! React
import { useState } from 'react';

//* Components
import SliderDetents from '../../../components/interior/SliderDetents';
import ReorderList from '../../../components/interior/ReorderList';
import SnapCarousel from '../../../components/interior/SnapCarousel';
import SwipeDeck from '../../../components/interior/SwipeDeck';
import Lightbox from '../../../components/interior/Lightbox';

//* Styled
import { StyledDemoStack, StyledDemoRow, StyledDemoButton } from '../styled';
import { StyledSlide, StyledCardTitle, StyledCardBody, StyledThumbRow, StyledThumb } from './gestures.styled';

export function SliderDetentsDemo() {
	const [value, setValue] = useState(50);

	return (
		<StyledDemoStack $w="100%">
			<SliderDetents
				label="Playback speed"
				value={value}
				onValueChange={setValue}
				min={0}
				max={200}
				step={5}
				format={(v) => `${(v / 100).toFixed(2)}×`}
				detents={[
					{ value: 50, label: '0.5×' },
					{ value: 100, label: '1×' },
					{ value: 150, label: '1.5×' },
					{ value: 200, label: '2×' },
				]}
			/>
		</StyledDemoStack>
	);
}

const INITIAL_ORDER = [
	{ id: 'install', label: 'Install dependencies' },
	{ id: 'lint', label: 'Run the linter' },
	{ id: 'test', label: 'Run the test suite' },
	{ id: 'build', label: 'Build for production' },
];

export function ReorderListDemo() {
	const [items, setItems] = useState(INITIAL_ORDER);

	return (
		<StyledDemoStack $w="100%">
			<ReorderList
				items={items}
				getId={(item) => item.id}
				getLabel={(item) => item.label}
				onReorder={setItems}
				label="Pipeline steps"
			/>
		</StyledDemoStack>
	);
}

const SLIDES = [
	{ title: 'Position plus momentum', body: 'A short fast flick advances; a long slow drag that ends mid-slide falls back.' },
	{ title: 'Capped flicks', body: 'One gesture moves at most one slide, so a hard swipe cannot fling past everything.' },
	{ title: 'Felt edges', body: 'Dragging past either end is rubber-banded and springs back, so the limit is felt.' },
];

export function SnapCarouselDemo() {
	return (
		<StyledDemoStack $w="100%">
			<SnapCarousel label="Carousel behaviour">
				{SLIDES.map((slide) => (
					<StyledSlide key={slide.title}>
						<StyledCardTitle>{slide.title}</StyledCardTitle>
						<StyledCardBody>{slide.body}</StyledCardBody>
					</StyledSlide>
				))}
			</SnapCarousel>
		</StyledDemoStack>
	);
}

const DECK = [
	{ id: '1', title: 'Far enough', body: 'Drag past a third of the card to commit.' },
	{ id: '2', title: 'Or fast enough', body: 'A flick commits regardless of distance.' },
	{ id: '3', title: 'Otherwise', body: 'Anything short of either springs back.' },
	{ id: '4', title: 'And by keyboard', body: 'Arrow keys decide too — gestures are not the only way.' },
];

export function SwipeDeckDemo() {
	const [decided, setDecided] = useState<string[]>([]);

	return (
		<StyledDemoStack $w="100%">
			<SwipeDeck
				items={DECK}
				getId={(card) => card.id}
				label="Review queue"
				onDecide={(card, direction) => setDecided((d) => [...d, `${card.title} → ${direction}`])}
				renderCard={(card) => (
					<>
						<StyledCardTitle>{card.title}</StyledCardTitle>
						<StyledCardBody>{card.body}</StyledCardBody>
					</>
				)}
			/>
			{decided.length > 0 ? <StyledDemoRow>{decided.length} decided</StyledDemoRow> : null}
		</StyledDemoStack>
	);
}

/** Inline SVG stand-ins, so the demo needs no network. */
const GALLERY = ['#444738', '#6a6d5e', '#c5c7bc'].map((fill, i) => ({
	src:
		'data:image/svg+xml;utf8,' +
		encodeURIComponent(
			`<svg xmlns="http://www.w3.org/2000/svg" width="640" height="420"><rect width="640" height="420" fill="${fill}"/><text x="320" y="220" font-family="monospace" font-size="48" fill="#f2e8ea" text-anchor="middle">${i + 1}</text></svg>`,
		),
	alt: `Placeholder image ${i + 1}`,
	width: 640,
	height: 420,
}));

export function LightboxDemo() {
	const [open, setOpen] = useState(false);
	const [index, setIndex] = useState(0);

	return (
		<StyledDemoStack $w="auto">
			<StyledThumbRow>
				{GALLERY.map((slide, i) => (
					<StyledThumb
						key={slide.alt}
						type="button"
						onClick={() => {
							setIndex(i);
							setOpen(true);
						}}
						aria-label={`Open ${slide.alt}`}
					>
						<img src={slide.src} alt="" />
					</StyledThumb>
				))}
			</StyledThumbRow>

			<StyledDemoRow>
				<StyledDemoButton onClick={() => setOpen(true)}>Open gallery</StyledDemoButton>
			</StyledDemoRow>

			<Lightbox
				open={open}
				slides={GALLERY}
				index={index}
				onIndexChange={setIndex}
				onClose={() => setOpen(false)}
			/>
		</StyledDemoStack>
	);
}
