import { useCallback, useRef, useState } from 'react';

export type TreeNode = {
	id: string;
	label: string;
	meta?: string;
	children?: TreeNode[];
};

export type TreeRow = {
	node: TreeNode;
	level: number;
	parentId: string | null;
	posinset: number;
	setsize: number;
	branch: boolean;
	open: boolean;
};

/**
 * Flattens the visible tree into the linear order the arrow keys move through.
 * Keyboard navigation is a list problem, not a tree problem — collapsed
 * branches simply are not in it.
 */
function flatten(
	nodes: TreeNode[],
	openSet: ReadonlySet<string>,
	level = 1,
	parentId: string | null = null,
	out: TreeRow[] = [],
): TreeRow[] {
	nodes.forEach((node, i) => {
		const children = node.children ?? [];
		const branch = children.length > 0;
		const open = branch && openSet.has(node.id);
		out.push({ node, level, parentId, posinset: i + 1, setsize: nodes.length, branch, open });
		if (open) flatten(children, openSet, level + 1, node.id, out);
	});
	return out;
}

export type UseTreeViewOptions = {
	nodes: TreeNode[];
	expanded?: string[];
	defaultExpanded?: string[];
	onExpandedChange?: (expanded: string[]) => void;
	selected?: string | null;
	defaultSelected?: string | null;
	onSelectedChange?: (selected: string) => void;
};

export function useTreeView({
	nodes,
	expanded,
	defaultExpanded = [],
	onExpandedChange,
	selected,
	defaultSelected = null,
	onSelectedChange,
}: UseTreeViewOptions) {
	const [internalOpen, setInternalOpen] = useState<string[]>(defaultExpanded);
	const openControlled = expanded !== undefined;
	const openList = openControlled ? expanded : internalOpen;
	const openSet = new Set(openList);

	const [internalSel, setInternalSel] = useState<string | null>(defaultSelected);
	const selControlled = selected !== undefined;
	const selectedId = selControlled ? selected : internalSel;

	const emitOpen = useRef(onExpandedChange);
	emitOpen.current = onExpandedChange;
	const emitSel = useRef(onSelectedChange);
	emitSel.current = onSelectedChange;

	const rows = flatten(nodes, openSet);

	// Exactly one row is tabbable. If the remembered one has been collapsed
	// away, the tab stop falls back rather than disappearing from the tree.
	const [focusId, setFocusId] = useState<string | null>(null);
	const tabStop =
		focusId !== null && rows.some((r) => r.node.id === focusId)
			? focusId
			: (rows.find((r) => r.node.id === selectedId)?.node.id ?? rows[0]?.node.id ?? null);

	const refs = useRef(new Map<string, HTMLElement>());
	const register = useCallback((id: string, el: HTMLElement | null) => {
		if (el) refs.current.set(id, el);
		else refs.current.delete(id);
	}, []);

	const focusRow = useCallback((id: string) => {
		setFocusId(id);
		refs.current.get(id)?.focus();
	}, []);

	const setOpen = useCallback(
		(next: string[]) => {
			if (!openControlled) setInternalOpen(next);
			emitOpen.current?.(next);
		},
		[openControlled],
	);

	const toggle = useCallback(
		(id: string) => {
			const has = openList.includes(id);
			setOpen(has ? openList.filter((v) => v !== id) : [...openList, id]);
		},
		[openList, setOpen],
	);

	const select = useCallback(
		(id: string) => {
			if (!selControlled) setInternalSel(id);
			emitSel.current?.(id);
		},
		[selControlled],
	);

	const handleKey = useCallback(
		(event: React.KeyboardEvent, row: TreeRow) => {
			const at = rows.findIndex((r) => r.node.id === row.node.id);
			const go = (index: number) => {
				const target = rows[index];
				if (target) focusRow(target.node.id);
			};

			switch (event.key) {
				case 'ArrowDown':
					event.preventDefault();
					go(at + 1);
					return;
				case 'ArrowUp':
					event.preventDefault();
					go(at - 1);
					return;
				// Right opens a closed branch, then steps into it. Left closes an
				// open one, then climbs to the parent — the standard tree contract.
				case 'ArrowRight':
					event.preventDefault();
					if (row.branch && !row.open) toggle(row.node.id);
					else if (row.open) go(at + 1);
					return;
				case 'ArrowLeft':
					event.preventDefault();
					if (row.open) toggle(row.node.id);
					else if (row.parentId) focusRow(row.parentId);
					return;
				case 'Home':
					event.preventDefault();
					go(0);
					return;
				case 'End':
					event.preventDefault();
					go(rows.length - 1);
					return;
				case 'Enter':
				case ' ':
					event.preventDefault();
					select(row.node.id);
					if (row.branch) toggle(row.node.id);
					return;
				default:
			}

			// Typeahead searches forward from the current row and wraps.
			if (event.key.length === 1 && !event.metaKey && !event.ctrlKey) {
				const letter = event.key.toLowerCase();
				if (letter === ' ') return;
				for (let step = 1; step <= rows.length; step++) {
					const candidate = rows[(at + step) % rows.length];
					if (candidate.node.label.toLowerCase().startsWith(letter)) {
						event.preventDefault();
						focusRow(candidate.node.id);
						return;
					}
				}
			}
		},
		[rows, focusRow, toggle, select],
	);

	return {
		rows,
		openSet,
		selectedId,
		tabStop,
		register,
		focusRow,
		setFocusId,
		toggle,
		select,
		handleKey,
	};
}
