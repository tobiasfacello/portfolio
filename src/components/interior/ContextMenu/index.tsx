//! React
import { useEffect, useState, type ReactNode } from 'react';
import { createPortal } from 'react-dom';

//! GSAP
import { gsap } from '../../../lib/gsap';

//? Hooks
import { usePresence } from '../../../hooks/usePresence';
import { useContextMenu, type ContextMenuItem } from './useContextMenu';

//? Lib
import { SPRINGS } from '../../../lib/motion';

//* Styled
import {
	StyledContextTarget,
	StyledContextMenu,
	StyledContextItem,
	StyledContextIcon,
	StyledContextLabel,
	StyledContextShortcut,
	StyledContextSeparator,
} from './styled';

export type ContextMenuProps = {
	items: ContextMenuItem[];
	children: ReactNode;
	label?: string;
	onSelect?: (id: string) => void;
	width?: number;
	disabled?: boolean;
};

function ContextMenu({
	items,
	children,
	label = 'Context menu',
	onSelect,
	width,
	disabled,
}: ContextMenuProps) {
	const { placement, active, open, close, triggerProps, menuProps, getItemProps } = useContextMenu({
		items,
		onSelect,
		width,
		disabled,
	});

	const { isMounted, ref } = usePresence<HTMLDivElement>(open, {
		enter: (element, { reducedMotion }) =>
			gsap.fromTo(
				element,
				{ opacity: 0, scale: reducedMotion ? 1 : 0.94 },
				{
					opacity: 1,
					scale: 1,
					duration: reducedMotion ? 0 : SPRINGS.snap.duration,
					ease: SPRINGS.snap.ease,
				},
			),
		exit: (element, { reducedMotion }) =>
			gsap.to(element, {
				opacity: 0,
				scale: reducedMotion ? 1 : 0.97,
				duration: reducedMotion ? 0 : 0.12,
				ease: 'power2.in',
			}),
	});

	const [host, setHost] = useState<HTMLElement | null>(null);
	useEffect(() => {
		setHost(document.body);
	}, []);

	const menu =
		isMounted && placement && host
			? createPortal(
					<StyledContextMenu
						{...menuProps}
						ref={(node) => {
							ref.current = node;
							menuProps.ref.current = node;
						}}
						aria-label={label}
						style={{
							left: placement.left,
							top: placement.top,
							width: placement.width,
							maxHeight: placement.maxHeight,
							transformOrigin: placement.transformOrigin,
						}}
						// A press anywhere else dismisses, without waiting for the click.
						onPointerDownCapture={(event) => event.stopPropagation()}
					>
						{items.map((item, index) =>
							item.type === 'separator' ? (
								<StyledContextSeparator key={item.id} role="separator" />
							) : (
								<StyledContextItem
									key={item.id}
									{...getItemProps(index)}
									aria-disabled={item.disabled || undefined}
									$active={index === active}
									$disabled={item.disabled}
								>
									{item.icon ? <StyledContextIcon aria-hidden="true">{item.icon}</StyledContextIcon> : null}
									<StyledContextLabel>{item.label}</StyledContextLabel>
									{item.shortcut ? <StyledContextShortcut>{item.shortcut}</StyledContextShortcut> : null}
								</StyledContextItem>
							),
						)}
					</StyledContextMenu>,
					host,
				)
			: null;

	return (
		<>
			<StyledContextTarget {...triggerProps}>{children}</StyledContextTarget>
			{menu}
			{isMounted ? (
				// Catches the dismissing press without darkening the page.
				createPortal(
					<div
						aria-hidden="true"
						style={{ position: 'fixed', inset: 0, zIndex: 'var(--z-tooltip)' as never }}
						onPointerDown={() => close(false)}
					/>,
					host ?? document.body,
				)
			) : null}
		</>
	);
}

export default ContextMenu;
