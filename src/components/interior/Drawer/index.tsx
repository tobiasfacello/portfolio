//! React
import { useCallback, useEffect, useId, useState, type ReactNode } from 'react';

//? Variants
import type { SurfaceDensity } from '../shared/variants';
import { createPortal } from 'react-dom';

//? Hooks
import { useDialog } from '../shared/useDialog';
import { useDrawer, type DrawerSide } from './useDrawer';

//* Styled
import {
	StyledDrawerRoot,
	StyledDrawerScrim,
	StyledDrawerPanel,
	StyledDrawerHeader,
	StyledDrawerHeading,
	StyledDrawerTitle,
	StyledDrawerDescription,
	StyledDrawerClose,
	StyledDrawerBody,
	StyledDrawerFooter,
} from './styled';
import { StyledVisuallyHidden } from '../shared/styled';

export type DrawerProps = {
	density?: SurfaceDensity;
	open: boolean;
	onOpenChange: (open: boolean) => void;
	title: string;
	children: ReactNode;
	description?: string;
	footer?: ReactNode;
	side?: DrawerSide;
	width?: number;
	/** `parent` keeps the drawer inside its container instead of the viewport. */
	container?: 'viewport' | 'parent';
	closeLabel?: string;
	dismissOnScrimClick?: boolean;
};

function Drawer({
	density = 'base',
	open,
	onOpenChange,
	title,
	children,
	description,
	footer,
	side = 'right',
	width = 320,
	container = 'viewport',
	closeLabel = 'Close panel',
	dismissOnScrimClick = true,
}: DrawerProps) {
	const titleId = useId();
	const hintId = useId();
	const modal = container === 'viewport';

	const drawer = useDrawer({ open, onOpenChange, side, width });

	// The drawer keeps its own panel ref for the drag, so the dialog behaviour is
	// pointed at the same node rather than owning a second one.
	const { panelRef, panelProps } = useDialog({
		open,
		onClose: drawer.close,
		lockScroll: modal,
		trapSiblings: modal,
		container: modal ? undefined : null,
	});

	const setPanel = useCallback(
		(node: HTMLDivElement | null) => {
			drawer.panelRef.current = node;
			panelRef.current = node;
		},
		[drawer.panelRef, panelRef],
	);

	const [host, setHost] = useState<HTMLElement | null>(null);
	useEffect(() => {
		setHost(modal ? document.body : null);
	}, [modal]);

	const tree = (
		<StyledDrawerRoot $fixed={modal} $open={open}>
			<StyledDrawerScrim
				ref={drawer.scrimRef}
				aria-hidden="true"
				onClick={dismissOnScrimClick ? drawer.close : undefined}
			/>

			<StyledDrawerPanel
				ref={setPanel}
				{...panelProps}
				aria-modal={modal}
				aria-labelledby={titleId}
				aria-describedby={hintId}
				$side={side}
				$width={width}
				$dragging={drawer.dragging}
			>
				<StyledDrawerHeader $density={density} $dragging={drawer.dragging} {...drawer.gripProps}>
					<StyledDrawerHeading>
						<StyledDrawerTitle id={titleId}>{title}</StyledDrawerTitle>
						{description ? (
							<StyledDrawerDescription>{description}</StyledDrawerDescription>
						) : null}
					</StyledDrawerHeading>

					<StyledDrawerClose
						type="button"
						// The close button lives inside the drag handle; without this a
						// press on it would start a drag instead of a click.
						onPointerDown={(e) => e.stopPropagation()}
						onClick={drawer.close}
						aria-label={closeLabel}
					>
						<svg width="13" height="13" viewBox="0 0 256 256" fill="none" aria-hidden="true">
							<line
								x1="200"
								y1="56"
								x2="56"
								y2="200"
								stroke="currentColor"
								strokeWidth="16"
								strokeLinecap="round"
							/>
							<line
								x1="200"
								y1="200"
								x2="56"
								y2="56"
								stroke="currentColor"
								strokeWidth="16"
								strokeLinecap="round"
							/>
						</svg>
					</StyledDrawerClose>
				</StyledDrawerHeader>

				<StyledDrawerBody $density={density}>{children}</StyledDrawerBody>
				{footer ? <StyledDrawerFooter $density={density}>{footer}</StyledDrawerFooter> : null}

				<StyledVisuallyHidden id={hintId}>
					Press Escape to close this panel, or drag its handle toward the edge.
				</StyledVisuallyHidden>
			</StyledDrawerPanel>
		</StyledDrawerRoot>
	);

	if (!modal) return tree;
	return host ? createPortal(tree, host) : null;
}

export default Drawer;
