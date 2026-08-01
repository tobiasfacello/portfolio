//! React
import { useId, useRef, type ReactNode } from 'react';

//! GSAP
import { gsap, useGSAP } from '../../../lib/gsap';

//? Hooks
import { usePrefersReducedMotion } from '../../../hooks/usePrefersReducedMotion';
import { useAutoHeight } from '../Accordion/useAccordion';
import { useTreeView, type TreeNode, type TreeRow } from './useTreeView';

//? Lib
import { SPRINGS, EASE_SMOOTH_OUT, motionSafe } from '../../../lib/motion';

//* Styled
import {
	StyledTreeRoot,
	StyledTreeList,
	StyledTreeItem,
	StyledTreeCaret,
	StyledTreeSpacer,
	StyledTreeLabel,
	StyledTreeMeta,
	StyledTreeGroupClip,
	StyledTreeGroupInner,
} from './styled';
import { StyledVisuallyHidden } from '../shared/styled';

type CaretProps = { open: boolean; reducedMotion: boolean };

function Caret({ open, reducedMotion }: CaretProps) {
	const ref = useRef<HTMLSpanElement>(null);

	useGSAP(() => {
		const node = ref.current;
		if (!node) return;
		const turn = motionSafe(SPRINGS.snap, reducedMotion);
		gsap.to(node, { rotate: open ? 90 : 0, duration: turn.duration, ease: turn.ease });
	}, [open, reducedMotion]);

	return (
		<StyledTreeCaret ref={ref} aria-hidden="true">
			<svg viewBox="0 0 12 12" width="10" height="10" focusable="false">
				<path
					d="M4.5 2.5 8 6l-3.5 3.5"
					fill="none"
					stroke="currentColor"
					strokeWidth="1.6"
					strokeLinecap="round"
					strokeLinejoin="round"
				/>
			</svg>
		</StyledTreeCaret>
	);
}

type TreeGroupProps = {
	open: boolean;
	reducedMotion: boolean;
	children: ReactNode;
};

/** Animates a branch open by its measured height, never to `auto`. */
function TreeGroup({ open, reducedMotion, children }: TreeGroupProps) {
	const clipRef = useRef<HTMLUListElement>(null);
	const { ref: innerRef, height, ready } = useAutoHeight();

	useGSAP(() => {
		const clip = clipRef.current;
		if (!clip || !ready) return;

		gsap.to(clip, {
			height: open ? height : 0,
			opacity: open ? 1 : 0,
			duration: reducedMotion ? 0 : open ? 0.28 : 0.2,
			ease: open ? EASE_SMOOTH_OUT : 'power2.in',
		});
	}, [open, height, ready, reducedMotion]);

	return (
		<StyledTreeGroupClip ref={clipRef} role="group" style={{ height: open ? undefined : 0 }}>
			<StyledTreeGroupInner ref={innerRef as React.Ref<HTMLDivElement>}>
				{children}
			</StyledTreeGroupInner>
		</StyledTreeGroupClip>
	);
}

export type TreeViewProps = {
	nodes: TreeNode[];
	label: string;
	expanded?: string[];
	defaultExpanded?: string[];
	onExpandedChange?: (expanded: string[]) => void;
	selected?: string | null;
	defaultSelected?: string | null;
	onSelectedChange?: (selected: string) => void;
};

function TreeView({
	nodes,
	label,
	expanded,
	defaultExpanded,
	onExpandedChange,
	selected,
	defaultSelected,
	onSelectedChange,
}: TreeViewProps) {
	const tree = useTreeView({
		nodes,
		expanded,
		defaultExpanded,
		onExpandedChange,
		selected,
		defaultSelected,
		onSelectedChange,
	});
	const prefersReducedMotion = usePrefersReducedMotion();
	const hintId = useId();

	const renderNodes = (list: TreeNode[], level: number): ReactNode =>
		list.map((node, i) => {
			const row: TreeRow | undefined = tree.rows.find((r) => r.node.id === node.id);
			// A node inside a collapsed branch has no row; its subtree is not
			// rendered, so there is nothing to draw.
			const branch = (node.children ?? []).length > 0;
			const open = tree.openSet.has(node.id);
			const isSelected = tree.selectedId === node.id;

			return (
				<li key={node.id} role="none">
					<StyledTreeItem
						role="treeitem"
						ref={(el) => tree.register(node.id, el)}
						aria-level={level}
						aria-posinset={i + 1}
						aria-setsize={list.length}
						aria-expanded={branch ? open : undefined}
						aria-selected={isSelected}
						aria-describedby={hintId}
						tabIndex={tree.tabStop === node.id ? 0 : -1}
						onFocus={() => tree.setFocusId(node.id)}
						onKeyDown={(e) => {
							if (row) tree.handleKey(e, row);
						}}
						onClick={() => {
							tree.select(node.id);
							tree.focusRow(node.id);
							if (branch) tree.toggle(node.id);
						}}
						$selected={isSelected}
					>
						{branch ? (
							<Caret open={open} reducedMotion={prefersReducedMotion} />
						) : (
							<StyledTreeSpacer />
						)}

						<StyledTreeLabel $selected={isSelected}>{node.label}</StyledTreeLabel>
						{node.meta ? <StyledTreeMeta>{node.meta}</StyledTreeMeta> : null}
					</StyledTreeItem>

					{branch ? (
						<TreeGroup open={open} reducedMotion={prefersReducedMotion}>
							{renderNodes(node.children ?? [], level + 1)}
						</TreeGroup>
					) : null}
				</li>
			);
		});

	return (
		<StyledTreeRoot>
			<StyledTreeList role="tree" aria-label={label}>
				{renderNodes(nodes, 1)}
			</StyledTreeList>

			<StyledVisuallyHidden id={hintId}>
				Use the arrow keys to move. Right expands a folder, left collapses it or climbs to its
				parent. Home and End jump to the ends, and typing a letter jumps to the next name
				starting with it.
			</StyledVisuallyHidden>
		</StyledTreeRoot>
	);
}

export default TreeView;
