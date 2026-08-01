//! React
import { useState } from 'react';

//* Components
import Button from '../../../components/Button';
import Pill from '../../../components/Pill';
import ProgressBar from '../../../components/interior/ProgressBar';
import Tabs from '../../../components/interior/Tabs';
import LoadingButton from '../../../components/interior/LoadingButton';

//? Variants
import {
	CONTROL_SIZES,
	type ControlSize,
	type ControlTone,
	type ProgressTone,
	type SurfaceDensity,
} from '../../../components/interior/shared/variants';

//* Styled
import { StyledDemoStack, StyledDemoRow, StyledDemoNote } from '../styled';
import {
	StyledVariantButton,
	StyledVariantGrid,
	StyledVariantRow,
	StyledVariantCaption,
	StyledDensityCard,
	StyledDensityRow,
	StyledCompareRow,
	StyledCompareCell,
} from './foundations.styled';

const SIZES: ControlSize[] = ['xs', 'sm', 'md', 'lg'];
const TONES: ControlTone[] = ['default', 'glass', 'ghost', 'solid', 'danger', 'success'];
const DENSITIES: SurfaceDensity[] = ['compact', 'base', 'roomy'];

/** A single glyph, so the icon-only row has something real to centre. */
function Bolt() {
	return (
		<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" aria-hidden="true">
			<path d="M8.8 1.8 3.5 9h3.4l-.7 5.2L12.5 7H9.1z" />
		</svg>
	);
}

export function ControlSizesDemo() {
	return (
		<StyledDemoStack $w="100%">
			<StyledVariantRow>
				<StyledVariantCaption>With a label</StyledVariantCaption>
				<StyledVariantGrid>
					{SIZES.map((size) => (
						<StyledVariantButton key={size} type="button" $size={size} $tone="default">
							{size}
						</StyledVariantButton>
					))}
				</StyledVariantGrid>
			</StyledVariantRow>

			<StyledVariantRow>
				<StyledVariantCaption>Icon only — squared at the same heights</StyledVariantCaption>
				<StyledVariantGrid>
					{SIZES.map((size) => (
						<StyledVariantButton
							key={size}
							type="button"
							$size={size}
							$tone="default"
							$iconOnly
							aria-label={`Icon button, size ${size}`}
						>
							<Bolt />
						</StyledVariantButton>
					))}
				</StyledVariantGrid>
			</StyledVariantRow>

			<StyledDemoNote>
				Padding is what sets the height, exactly as it does on the landing —{' '}
				<code>{CONTROL_SIZES.xs.padding}</code> is the Pill, <code>{CONTROL_SIZES.sm.padding}</code>{' '}
				the glass Button, <code>{CONTROL_SIZES.md.padding}</code> the default Button. The min-height
				is only a floor so a short label cannot collapse the box.
			</StyledDemoNote>
		</StyledDemoStack>
	);
}

export function ControlTonesDemo() {
	return (
		<StyledDemoStack $w="100%">
			<StyledVariantGrid>
				{TONES.map((tone) => (
					<StyledVariantButton key={tone} type="button" $size="md" $tone={tone}>
						{tone}
					</StyledVariantButton>
				))}
			</StyledVariantGrid>

			<StyledVariantRow>
				<StyledVariantCaption>Disabled</StyledVariantCaption>
				<StyledVariantGrid>
					{TONES.map((tone) => (
						<StyledVariantButton key={tone} type="button" disabled $size="md" $tone={tone}>
							{tone}
						</StyledVariantButton>
					))}
				</StyledVariantGrid>
			</StyledVariantRow>

			<StyledDemoNote>
				Every tone is written in theme tokens, so light and dark follow with no second definition.
				Switch the system theme and nothing here needs to know.
			</StyledDemoNote>
		</StyledDemoStack>
	);
}

export function SurfaceDensityDemo() {
	return (
		<StyledDemoStack $w="100%">
			<StyledDensityRow>
				{DENSITIES.map((density) => (
					<StyledDensityCard key={density} $density={density}>
						{density}
					</StyledDensityCard>
				))}
			</StyledDensityRow>
			<StyledDemoNote>
				<code>base</code> is the landing's own card padding. The ported components used to sit at 16
				and 24, which read as a second design system sharing the page.
			</StyledDemoNote>
		</StyledDemoStack>
	);
}

export function LandingParityDemo() {
	return (
		<StyledDemoStack $w="100%">
			<StyledCompareRow>
				<StyledCompareCell>
					<StyledVariantCaption>Landing Pill</StyledVariantCaption>
					<Pill tag="xs" />
				</StyledCompareCell>
				<StyledCompareCell>
					<StyledVariantCaption>Ported, xs</StyledVariantCaption>
					<StyledVariantButton type="button" $size="xs" $tone="default">
						xs
					</StyledVariantButton>
				</StyledCompareCell>

				<StyledCompareCell>
					<StyledVariantCaption>Landing Button, glass</StyledVariantCaption>
					<Button title="sm" variant="glass" />
				</StyledCompareCell>
				<StyledCompareCell>
					<StyledVariantCaption>Ported, sm</StyledVariantCaption>
					<StyledVariantButton type="button" $size="sm" $tone="glass">
						sm
					</StyledVariantButton>
				</StyledCompareCell>

				<StyledCompareCell>
					<StyledVariantCaption>Landing Button</StyledVariantCaption>
					<Button title="md" />
				</StyledCompareCell>
				<StyledCompareCell>
					<StyledVariantCaption>Ported, md</StyledVariantCaption>
					<StyledVariantButton type="button" $size="md" $tone="default">
						md
					</StyledVariantButton>
				</StyledCompareCell>
			</StyledCompareRow>

			<StyledDemoNote>
				Same row, same baseline. This is the check that keeps the two sets from drifting apart again.
			</StyledDemoNote>
		</StyledDemoStack>
	);
}

const PROGRESS_TONE_LIST: ProgressTone[] = ['default', 'success', 'warning', 'danger'];

export function ProgressVariantsDemo() {
	return (
		<StyledDemoStack $w="100%">
			{PROGRESS_TONE_LIST.map((tone, i) => (
				<ProgressBar key={tone} value={30 + i * 20} tone={tone} label={tone} />
			))}
			<StyledVariantCaption>Thickness</StyledVariantCaption>
			<ProgressBar value={45} size="sm" label="sm" />
			<ProgressBar value={45} size="md" label="md" />
			<ProgressBar value={45} size="lg" label="lg" />
		</StyledDemoStack>
	);
}

const TAB_ITEMS = [
	{ value: 'overview', label: 'Overview' },
	{ value: 'activity', label: 'Activity' },
	{ value: 'settings', label: 'Settings' },
];

export function SizedComponentsDemo() {
	const [busy, setBusy] = useState(0);

	return (
		<StyledDemoStack $w="100%">
			<StyledVariantRow>
				<StyledVariantCaption>Tabs</StyledVariantCaption>
				<Tabs items={TAB_ITEMS} size="sm" label="Small tabs" />
				<Tabs items={TAB_ITEMS} size="md" label="Medium tabs" />
			</StyledVariantRow>

			<StyledVariantRow>
				<StyledVariantCaption>Loading button, every size and a semantic tone</StyledVariantCaption>
				<StyledVariantGrid>
					{SIZES.map((size) => (
						<LoadingButton
							key={size}
							size={size}
							onAction={() => new Promise((r) => setTimeout(r, 800))}
							successLabel="Done"
						>
							{size}
						</LoadingButton>
					))}
					<LoadingButton
						tone="danger"
						onAction={() => {
							setBusy((n) => n + 1);
							return new Promise((r) => setTimeout(r, 800));
						}}
						successLabel="Deleted"
					>
						Delete
					</LoadingButton>
					<LoadingButton tone="solid" onAction={() => new Promise((r) => setTimeout(r, 800))}>
						Publish
					</LoadingButton>
				</StyledVariantGrid>
				{busy > 0 ? <StyledDemoRow>Ran the danger action {busy} time(s)</StyledDemoRow> : null}
			</StyledVariantRow>
		</StyledDemoStack>
	);
}
