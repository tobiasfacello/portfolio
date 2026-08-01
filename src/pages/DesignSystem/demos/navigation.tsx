//! React
import { useState } from 'react';

//* Components
import Tabs from '../../../components/interior/Tabs';
import SegmentedControl from '../../../components/ToggleGroup/SegmentedControl';
import TaskSteps from '../../../components/interior/TaskSteps';
import CollapsibleBanner from '../../../components/interior/CollapsibleBanner';
import ScrollSpy from '../../../components/interior/ScrollSpy';
import WizardSteps from '../../../components/interior/WizardSteps';

//* Styled
import { StyledDemoStack, StyledDemoRow, StyledDemoButton } from '../styled';

const TAB_ITEMS = [
	{ value: 'overview', label: 'Overview' },
	{ value: 'activity', label: 'Activity' },
	{ value: 'settings', label: 'Settings' },
	{ value: 'billing', label: 'Billing', disabled: true },
];

const TAB_COPY: Record<string, string> = {
	overview:
		'Arrow keys move between tabs and select as they go. The indicator is measured from the real tab, so it stays aligned after a font swap or a resize.',
	activity:
		'Each label is rendered twice — once invisible at its selected weight — so making a tab bold never nudges its neighbours sideways.',
	settings:
		'The panel enters from the side the selection came from, so the movement itself tells you which way you went.',
	billing: 'Disabled tabs are skipped by the arrow keys rather than acting as a dead stop.',
};

const WIZARD_STEPS = [
	{
		id: 'account',
		label: 'Create your account',
		content:
			'You can jump back to any step you have already reached, but not forward past one you have not — so the sequence still means something while staying freely reversible.',
	},
	{
		id: 'project',
		label: 'Name the project',
		content:
			'The panel enters from the side the move came from, so the direction of travel is legible without reading the step numbers.',
	},
	{
		id: 'deploy',
		label: 'Pick a region',
		content:
			'Focus follows whichever control caused the move: the rail keeps focus on the rail, the buttons hand it to the panel that just arrived.',
	},
];

export function WizardStepsDemo() {
	const [done, setDone] = useState(false);

	return (
		<StyledDemoStack $w="100%">
			<WizardSteps steps={WIZARD_STEPS} complete={done} onComplete={() => setDone(true)} />
			{done ? (
				<StyledDemoRow>
					<StyledDemoButton onClick={() => setDone(false)}>Start over</StyledDemoButton>
				</StyledDemoRow>
			) : null}
		</StyledDemoStack>
	);
}

const SPY_SECTIONS = [
	{ id: 'feedback', label: 'Feedback' },
	{ id: 'text', label: 'Text' },
	{ id: 'overlays', label: 'Overlays' },
	{ id: 'navigation', label: 'Navigation' },
	{ id: 'forms', label: 'Forms' },
	{ id: 'lists', label: 'Lists' },
	{ id: 'scroll', label: 'Scroll' },
];

export function ScrollSpyDemo() {
	// Wired to this page's own category sections, so it tracks something real.
	return (
		<StyledDemoStack $w="100%">
			<ScrollSpy sections={SPY_SECTIONS} offset={120} label="Design system sections" />
		</StyledDemoStack>
	);
}

const BUILD_STEPS = [
	{ id: 'install', label: 'Install dependencies', meta: '4.2s' },
	{ id: 'typecheck', label: 'Type-check', meta: '2.8s' },
	{ id: 'build', label: 'Build for production', meta: '11.4s' },
	{ id: 'upload', label: 'Upload artifacts', meta: '3.1s' },
];

export function TaskStepsDemo() {
	const [current, setCurrent] = useState(1);
	const [failed, setFailed] = useState(false);

	return (
		<StyledDemoStack $w="100%">
			<TaskSteps steps={BUILD_STEPS} current={current} failed={failed} />
			<StyledDemoRow>
				<StyledDemoButton
					onClick={() => {
						setFailed(false);
						setCurrent((c) => Math.min(BUILD_STEPS.length, c + 1));
					}}
				>
					Advance
				</StyledDemoButton>
				<StyledDemoButton onClick={() => setFailed(true)}>Fail here</StyledDemoButton>
				<StyledDemoButton
					onClick={() => {
						setFailed(false);
						setCurrent(0);
					}}
				>
					Reset
				</StyledDemoButton>
			</StyledDemoRow>
		</StyledDemoStack>
	);
}

export function CollapsibleBannerDemo() {
	return (
		<StyledDemoStack $w="100%">
			<CollapsibleBanner
				title="Your deploy region is changing"
				description="Folding and dismissing are separate intentions, so the caller can persist them differently. Escape folds rather than dismisses — the cheaper, more reversible of the two."
				action={<StyledDemoButton>Read the migration notes</StyledDemoButton>}
			/>
		</StyledDemoStack>
	);
}

export function SegmentedControlDemo() {
	const [range, setRange] = useState('month');

	return (
		<StyledDemoRow>
			<SegmentedControl
				label="Date range"
				value={range}
				onValueChange={setRange}
				options={[
					{ value: 'day', label: 'Day' },
					{ value: 'week', label: 'Week' },
					{ value: 'month', label: 'Month' },
					{ value: 'year', label: 'Year', disabled: true },
				]}
			/>
		</StyledDemoRow>
	);
}

export function TabsDemo() {
	return (
		<StyledDemoStack $w="100%">
			<Tabs
				items={TAB_ITEMS}
				defaultValue="overview"
				label="Project sections"
				renderPanel={(value) => TAB_COPY[value]}
			/>
		</StyledDemoStack>
	);
}
