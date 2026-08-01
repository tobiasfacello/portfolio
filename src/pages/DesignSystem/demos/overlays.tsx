//! React
import { useState } from 'react';

//* Components
import Modal from '../../../components/interior/Modal';
import Popover from '../../../components/interior/Popover';
import Drawer from '../../../components/interior/Drawer';
import Dropdown from '../../../components/interior/Dropdown';
import ContextMenu from '../../../components/interior/ContextMenu';
import CommandPalette from '../../../components/interior/CommandPalette';
import TooltipGroup, { GroupedTooltip } from '../../../components/Tooltip/TooltipGroup';
import { StyledContextSurface } from './overlays.styled';

//* Styled
import { StyledDemoRow, StyledDemoButton, StyledDemoStack } from '../styled';

export function ModalDemo() {
	const [open, setOpen] = useState(false);

	return (
		<StyledDemoRow>
			<StyledDemoButton onClick={() => setOpen(true)}>Open dialog</StyledDemoButton>

			<Modal
				open={open}
				onClose={() => setOpen(false)}
				title="Delete this project?"
				description="Its deployments and analytics history go with it."
				footer={
					<>
						<StyledDemoButton onClick={() => setOpen(false)}>Cancel</StyledDemoButton>
						<StyledDemoButton onClick={() => setOpen(false)}>Delete</StyledDemoButton>
					</>
				}
			>
				Focus is trapped inside this panel and returns to the trigger on close. Escape
				only closes the topmost dialog, and a drag that starts inside and ends on the
				backdrop is not treated as a dismissal.
			</Modal>
		</StyledDemoRow>
	);
}

export function DropdownDemo() {
	const [region, setRegion] = useState('iad1');

	return (
		<StyledDemoRow>
			<Dropdown
				label="Region"
				value={region}
				onChange={setRegion}
				items={[
					{ value: 'iad1', label: 'Washington, D.C.', hint: 'iad1' },
					{ value: 'gru1', label: 'São Paulo', hint: 'gru1' },
					{ value: 'cdg1', label: 'Paris', hint: 'cdg1' },
					{ value: 'hnd1', label: 'Tokyo', hint: 'hnd1' },
					{ value: 'syd1', label: 'Sydney', hint: 'syd1', disabled: true },
				]}
			/>
		</StyledDemoRow>
	);
}

export function DrawerDemo() {
	const [open, setOpen] = useState(false);

	return (
		<StyledDemoRow>
			<StyledDemoButton onClick={() => setOpen(true)}>Open panel</StyledDemoButton>

			<Drawer
				open={open}
				onOpenChange={setOpen}
				title="Deployment settings"
				description="Drag the header toward the edge to dismiss"
				footer={<StyledDemoButton onClick={() => setOpen(false)}>Done</StyledDemoButton>}
			>
				<StyledDemoStack $w="100%">
					Pulling the panel closed tracks your finger exactly, while pushing it further
					open is rubber-banded — there is nothing over there to reach.
					<br />
					<br />
					A dismissal can be earned two ways: far enough, or fast enough. A confident
					flick works without a long drag.
				</StyledDemoStack>
			</Drawer>
		</StyledDemoRow>
	);
}

export function PopoverDemo() {
	return (
		<StyledDemoRow>
			<Popover trigger="Bottom" label="Deployment details" side="bottom">
				<StyledDemoStack $w="220px">
					The panel flips to the opposite side when there is not enough room, and scales
					out of the arrow rather than its own centre.
				</StyledDemoStack>
			</Popover>

			<Popover trigger="Right" label="Alignment example" side="right" align="start">
				<StyledDemoStack $w="200px">
					Scrolling or resizing re-measures once per frame, so the panel stays attached
					to its anchor.
				</StyledDemoStack>
			</Popover>

			<Popover trigger="Top" label="Top placement" side="top">
				<StyledDemoStack $w="200px">Escape closes it and returns focus to the trigger.</StyledDemoStack>
			</Popover>
		</StyledDemoRow>
	);
}

export function ContextMenuDemo() {
	const [last, setLast] = useState('');

	return (
		<StyledDemoStack $w="auto">
			<ContextMenu
				onSelect={setLast}
				items={[
					{ id: 'open', label: 'Open', shortcut: '↵' },
					{ id: 'rename', label: 'Rename', shortcut: 'F2' },
					{ id: 'sep1', type: 'separator' },
					{ id: 'duplicate', label: 'Duplicate', shortcut: '⌘D' },
					{ id: 'archive', label: 'Archive', disabled: true },
					{ id: 'sep2', type: 'separator' },
					{ id: 'delete', label: 'Delete', shortcut: '⌫' },
				]}
			>
				<StyledContextSurface>Right-click here (or long-press on touch)</StyledContextSurface>
			</ContextMenu>
			{last ? <StyledDemoRow>Chose: {last}</StyledDemoRow> : null}
		</StyledDemoStack>
	);
}

const COMMANDS = [
	{ id: 'goto', label: 'Go to definition', keywords: 'jump source', shortcut: ['F12'] },
	{ id: 'find', label: 'Find in files', keywords: 'search grep', shortcut: ['⌘', '⇧', 'F'] },
	{ id: 'theme', label: 'Toggle colour theme', keywords: 'dark light appearance' },
	{ id: 'reload', label: 'Reload window', keywords: 'restart refresh' },
	{ id: 'settings', label: 'Open settings', keywords: 'preferences config', shortcut: ['⌘', ','] },
	{ id: 'terminal', label: 'Toggle terminal', keywords: 'shell console' },
];

export function CommandPaletteDemo() {
	const [open, setOpen] = useState(false);
	const [chosen, setChosen] = useState('');

	return (
		<StyledDemoStack $w="auto">
			<StyledDemoRow>
				<StyledDemoButton onClick={() => setOpen(true)}>Open palette</StyledDemoButton>
				{chosen ? <span>Ran: {chosen}</span> : null}
			</StyledDemoRow>
			<StyledDemoRow>Try “gtd” — subsequence matching ranks “Go to definition” first.</StyledDemoRow>

			<CommandPalette
				open={open}
				onClose={() => setOpen(false)}
				items={COMMANDS}
				onSelect={(item) => setChosen(item.label)}
			/>
		</StyledDemoStack>
	);
}

export function TooltipGroupDemo() {
	return (
		<StyledDemoRow>
			<TooltipGroup>
				{['Bold', 'Italic', 'Underline', 'Strikethrough'].map((name) => (
					<GroupedTooltip key={name} text={name}>
						<StyledDemoButton>{name[0]}</StyledDemoButton>
					</GroupedTooltip>
				))}
			</TooltipGroup>
		</StyledDemoRow>
	);
}
