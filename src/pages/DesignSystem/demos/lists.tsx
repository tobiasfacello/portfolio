//! React
import { useEffect, useState } from 'react';
import styled from 'styled-components';

//* Components
import Accordion from '../../../components/interior/Accordion';
import ShowMore from '../../../components/interior/ShowMore';
import PresenceAvatars from '../../../components/interior/PresenceAvatars';
import NewItemsPill from '../../../components/interior/NewItemsPill';
import PollResults from '../../../components/interior/PollResults';
import Pagination from '../../../components/interior/Pagination';
import TreeView from '../../../components/interior/TreeView';
import LoadMore from '../../../components/interior/LoadMore';
import FilterGrid from '../../../components/interior/FilterGrid';
import SortableTable from '../../../components/interior/SortableTable';
import { useNewItems } from '../../../components/interior/NewItemsPill/useNewItems';
import { outsetFocusRing, uiBody, wellSurface } from '../../../components/interior/shared/styled';

//* Styled
import { StyledDemoStack, StyledDemoRow, StyledDemoButton } from '../styled';

const ACCORDION_ITEMS = [
	{
		id: 'height',
		title: 'Why the height is measured, not guessed',
		meta: '01',
		content:
			'A panel cannot be animated to auto, so its natural height is tracked with a ResizeObserver and used as the target. Content that grows while open updates the target instead of being clipped.',
	},
	{
		id: 'focus',
		title: 'Collapsed panels leave the tab order',
		meta: '02',
		content:
			'A zero-height clip still contains focusable controls. Setting inert on the collapsed panel keeps them out of the tab order instead of leaving invisible stops behind.',
	},
	{
		id: 'keyboard',
		title: 'Arrow keys move between headers',
		meta: '03',
		content:
			'Up and down wrap around the set, Home and End jump to the ends. Ref callbacks are cached per id so headers are not detached and reattached on every render.',
	},
];

export function AccordionDemo() {
	return (
		<StyledDemoStack $w="100%">
			<Accordion items={ACCORDION_ITEMS} defaultOpen={['height']} />
		</StyledDemoStack>
	);
}

export function ShowMoreDemo() {
	return (
		<StyledDemoStack $w="100%">
			<ShowMore lines={3} maxHeight={160}>
				The line height is read from computed styles rather than assumed, so the clamp
				always lands on a line boundary and a collapsed block never cuts a line of text in
				half. Content that barely overflows does not offer a toggle at all — a button that
				reveals two more pixels is worse than no button.
				<br />
				<br />
				Past the cap the expanded region scrolls instead of growing without limit, and the
				veil stays while there is still more below it. Collapsing a region that was scrolled
				returns it to the top first, so it never reopens showing its middle.
			</ShowMore>
		</StyledDemoStack>
	);
}

const ROSTER = [
	{ id: 'ada', name: 'Ada Lovelace' },
	{ id: 'grace', name: 'Grace Hopper' },
	{ id: 'alan', name: 'Alan Turing' },
	{ id: 'katherine', name: 'Katherine Johnson' },
	{ id: 'linus', name: 'Linus Torvalds' },
	{ id: 'barbara', name: 'Barbara Liskov' },
	{ id: 'donald', name: 'Donald Knuth' },
];

const StyledFeedShell = styled.div`
	position: relative;
	width: 100%;
`;

const StyledFeed = styled.div`
	${wellSurface}
	max-height: 180px;
	overflow-y: auto;
	overscroll-behavior: contain;
	outline: none;

	${outsetFocusRing}
`;

const StyledFeedRow = styled.div`
	${uiBody}
	padding: var(--12) var(--16);
	opacity: var(--opacity-text-muted);

	& + & {
		border-top: 1px solid var(--glass-border-start);
	}
`;

const TREE_NODES = [
	{
		id: 'src',
		label: 'src',
		children: [
			{
				id: 'components',
				label: 'components',
				children: [
					{ id: 'interior', label: 'interior', meta: '42' },
					{ id: 'containers', label: 'Containers', meta: '7' },
				],
			},
			{ id: 'hooks', label: 'hooks', meta: '11' },
			{ id: 'lib', label: 'lib', children: [{ id: 'motion', label: 'motion.ts' }] },
		],
	},
	{ id: 'public', label: 'public', children: [{ id: 'favicon', label: 'favicon.ico' }] },
];

export function TreeViewDemo() {
	return (
		<StyledDemoStack $w="100%">
			<TreeView nodes={TREE_NODES} label="Project files" defaultExpanded={['src']} />
		</StyledDemoStack>
	);
}

export function PollResultsDemo() {
	return (
		<StyledDemoStack $w="100%">
			<PollResults
				label="Which state is hardest to get right?"
				options={[
					{ id: 'empty', label: 'Empty', votes: 312 },
					{ id: 'loading', label: 'Loading', votes: 894 },
					{ id: 'error', label: 'Error', votes: 1207 },
					{ id: 'partial', label: 'Partially loaded', votes: 641 },
				]}
			/>
		</StyledDemoStack>
	);
}

export function PaginationDemo() {
	const [page, setPage] = useState(1);

	return (
		<StyledDemoRow>
			<Pagination count={42} page={page} onPageChange={setPage} />
		</StyledDemoRow>
	);
}

export function NewItemsPillDemo() {
	const [items, setItems] = useState(() =>
		Array.from({ length: 8 }, (_, i) => `Event ${8 - i} — build finished`),
	);

	// A feed that keeps arriving, so the pill has a reason to appear.
	useEffect(() => {
		const id = setInterval(() => {
			setItems((current) => [`Event ${current.length + 1} — build finished`, ...current]);
		}, 2600);
		return () => clearInterval(id);
	}, []);

	const { scrollProps, unread, jump } = useNewItems<HTMLDivElement>({
		itemCount: items.length,
		anchor: 'top',
	});

	return (
		<StyledFeedShell>
			<NewItemsPill count={unread} onJump={jump} anchor="top" />
			<StyledFeed {...scrollProps} role="log" aria-label="Activity feed">
				{items.map((text, i) => (
					<StyledFeedRow key={`${text}-${i}`}>{text}</StyledFeedRow>
				))}
			</StyledFeed>
		</StyledFeedShell>
	);
}

export function PresenceAvatarsDemo() {
	const [count, setCount] = useState(4);

	return (
		<StyledDemoStack $w="auto">
			<PresenceAvatars people={ROSTER.slice(0, count)} max={4} />
			<StyledDemoRow>
				<StyledDemoButton onClick={() => setCount((c) => Math.min(ROSTER.length, c + 1))}>
					Someone joins
				</StyledDemoButton>
				<StyledDemoButton onClick={() => setCount((c) => Math.max(0, c - 1))}>
					Someone leaves
				</StyledDemoButton>
			</StyledDemoRow>
		</StyledDemoStack>
	);
}

const CATALOGUE = [
	{ id: 'a', name: 'Modal', group: 'overlay' },
	{ id: 'b', name: 'Drawer', group: 'overlay' },
	{ id: 'c', name: 'Popover', group: 'overlay' },
	{ id: 'd', name: 'Tabs', group: 'nav' },
	{ id: 'e', name: 'Pagination', group: 'nav' },
	{ id: 'f', name: 'Tag input', group: 'form' },
	{ id: 'g', name: 'OTP input', group: 'form' },
	{ id: 'h', name: 'Slider', group: 'form' },
];

export function FilterGridDemo() {
	return (
		<StyledDemoStack $w="100%">
			<FilterGrid
				items={CATALOGUE}
				label="Filter components"
				getKey={(item) => item.id}
				renderItem={(item) => item.name}
				filters={[
					{ id: 'all', label: 'All', match: () => true },
					{ id: 'overlay', label: 'Overlays', match: (i) => i.group === 'overlay' },
					{ id: 'nav', label: 'Navigation', match: (i) => i.group === 'nav' },
					{ id: 'form', label: 'Forms', match: (i) => i.group === 'form' },
					{ id: 'none', label: 'Archived', match: () => false },
				]}
			/>
		</StyledDemoStack>
	);
}

const TABLE_ROWS = [
	{ id: '1', name: 'interior', size: 17667, updated: 'today' },
	{ id: '2', name: 'Containers', size: 812, updated: 'last week' },
	{ id: '3', name: 'hooks', size: 1240, updated: '' },
	{ id: '4', name: 'lib', size: 96, updated: 'yesterday' },
];

export function SortableTableDemo() {
	return (
		<StyledDemoStack $w="100%">
			<SortableTable
				rows={TABLE_ROWS}
				getRowId={(row) => row.id}
				label="Folder sizes"
				defaultSort={{ columnId: 'size', direction: 'desc' }}
				columns={[
					{ id: 'name', header: 'Folder', value: (r) => r.name },
					{ id: 'size', header: 'Lines', numeric: true, value: (r) => r.size, cell: (r) => r.size.toLocaleString('en-US') },
					{ id: 'updated', header: 'Updated', value: (r) => r.updated },
				]}
			/>
		</StyledDemoStack>
	);
}

export function LoadMoreDemo() {
	const [count, setCount] = useState(4);

	return (
		<StyledDemoStack $w="100%">
			<StyledFeed style={{ maxHeight: 140 }}>
				{Array.from({ length: count }, (_, i) => (
					<StyledFeedRow key={i}>Row {i + 1}</StyledFeedRow>
				))}
			</StyledFeed>
			<LoadMore
				auto={false}
				hasMore={count < 12}
				onLoad={async () => {
					await new Promise((r) => setTimeout(r, 600));
					setCount((c) => c + 4);
					return count + 4 < 12;
				}}
			/>
		</StyledDemoStack>
	);
}
