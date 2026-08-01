//! React
import { useId, useMemo, useRef, useSyncExternalStore, type ReactNode } from 'react';

//? Context
import {
	TooltipGroupContext,
	createTooltipStore,
	useTooltipGroup,
	type TooltipTiming,
} from './TooltipGroupContext';

//* Styled
import {
	StyledTooltipWrapper,
	StyledTooltip,
	StyledTooltipBridge,
	StyledTooltipContent,
} from './styled';

/**
 * A row of tooltips that share one timer.
 *
 * Complements the standalone `Tooltip`, which owns its own delay. Use this when
 * several triggers sit together — a toolbar, a set of icon buttons — so moving
 * between them reads as inspecting one control rather than waiting repeatedly.
 */

export type TooltipGroupProps = {
	children: ReactNode;
	openDelay?: number;
	closeDelay?: number;
	skipDelay?: number;
};

function TooltipGroup({
	children,
	openDelay = 320,
	closeDelay = 120,
	skipDelay = 480,
}: TooltipGroupProps) {
	// Read through a ref so changing the timings never recreates the store and
	// drops the group's warm state mid-interaction.
	const timing = useRef<TooltipTiming>({ openDelay, closeDelay, skipDelay });
	timing.current = { openDelay, closeDelay, skipDelay };

	const store = useMemo(() => createTooltipStore(() => timing.current), []);

	return <TooltipGroupContext.Provider value={store}>{children}</TooltipGroupContext.Provider>;
}

export type GroupedTooltipProps = {
	text: ReactNode;
	children: ReactNode;
	position?: 'top' | 'bottom';
	align?: 'center' | 'start' | 'end';
};

/** A trigger inside a `TooltipGroup`. Outside one it simply never opens. */
export function GroupedTooltip({
	text,
	children,
	position = 'top',
	align = 'center',
}: GroupedTooltipProps) {
	const store = useTooltipGroup();
	const id = useId();

	const active = useSyncExternalStore(
		store ? store.subscribe : () => () => {},
		() => (store ? store.getActive() === id : false),
		() => false,
	);

	if (!store) return <StyledTooltipWrapper>{children}</StyledTooltipWrapper>;

	return (
		<StyledTooltipWrapper
			onPointerEnter={() => store.open(id, false)}
			onPointerLeave={() => {
				store.unblock(id);
				store.close(id, false);
			}}
			// Focus is deliberate, so it skips the delay entirely.
			onFocus={() => store.open(id, true)}
			onBlur={() => store.close(id, true)}
			onKeyDown={(event) => {
				if (event.key !== 'Escape') return;
				event.stopPropagation();
				store.dismiss(id);
			}}
		>
			{children}

			<StyledTooltip
				role="tooltip"
				aria-hidden={!active}
				$position={position}
				$align={align}
				$visible={active}
			>
				<StyledTooltipContent>{text}</StyledTooltipContent>
			</StyledTooltip>

			{/* Bridges the gap between trigger and tooltip so crossing it does not
			    count as leaving. */}
			<StyledTooltipBridge aria-hidden="true" $position={position} />
		</StyledTooltipWrapper>
	);
}

export default TooltipGroup;
