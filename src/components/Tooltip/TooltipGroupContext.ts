import { createContext, useContext } from 'react';

export type TooltipTiming = {
	/** Wait before the first tooltip in a cold group opens, in ms. */
	openDelay: number;
	/** Grace period before it closes, in ms. */
	closeDelay: number;
	/** How long the group stays warm after the last one closes, in ms. */
	skipDelay: number;
};

export type TooltipGroupValue = {
	subscribe: (fn: () => void) => () => void;
	getActive: () => string | null;
	/** True while the group is skipping the open delay. */
	getWarm: () => boolean;
	open: (id: string, immediate: boolean) => void;
	close: (id: string, immediate: boolean) => void;
	dismiss: (id: string) => void;
	unblock: (id: string) => void;
};

export const TooltipGroupContext = createContext<TooltipGroupValue | null>(null);

export function useTooltipGroup() {
	return useContext(TooltipGroupContext);
}

/**
 * The shared timer that makes a row of tooltips feel like one control.
 *
 * The first tooltip waits out `openDelay`, because a tooltip that appears the
 * instant the pointer crosses it is noise. Once one has opened the group is
 * *warm*: its neighbours open immediately, so scanning a toolbar is not a
 * series of separate waits. The group cools down `skipDelay` after the last one
 * closes, and only one tooltip is ever open — moving to a neighbour hands over
 * rather than stacking.
 */
export function createTooltipStore(getTiming: () => TooltipTiming): TooltipGroupValue {
	const listeners = new Set<() => void>();

	let active: string | null = null;
	let pending: string | null = null;
	/** Set on Escape: that trigger stays shut until the pointer leaves it. */
	let blocked: string | null = null;
	let warm = false;

	let openTimer: ReturnType<typeof setTimeout> | null = null;
	let closeTimer: ReturnType<typeof setTimeout> | null = null;
	let coolTimer: ReturnType<typeof setTimeout> | null = null;

	const stop = (t: ReturnType<typeof setTimeout> | null) => {
		if (t !== null) clearTimeout(t);
		return null;
	};

	const notify = () => {
		for (const fn of listeners) fn();
	};

	const setActive = (next: string | null) => {
		if (active === next) return;
		if (next !== null) warm = true;
		active = next;
		notify();
	};

	const cool = () => {
		coolTimer = stop(coolTimer);
		const { skipDelay } = getTiming();
		if (skipDelay <= 0) {
			if (warm) {
				warm = false;
				notify();
			}
			return;
		}
		coolTimer = setTimeout(() => {
			coolTimer = null;
			warm = false;
			notify();
		}, skipDelay);
	};

	return {
		subscribe(fn) {
			listeners.add(fn);
			return () => {
				listeners.delete(fn);
			};
		},
		getActive: () => active,
		getWarm: () => warm,

		open(id, immediate) {
			if (blocked === id) return;
			closeTimer = stop(closeTimer);
			coolTimer = stop(coolTimer);
			if (active === id) {
				openTimer = stop(openTimer);
				pending = null;
				return;
			}
			if (immediate || warm) {
				openTimer = stop(openTimer);
				pending = null;
				setActive(id);
				return;
			}
			openTimer = stop(openTimer);
			pending = id;
			openTimer = setTimeout(() => {
				openTimer = null;
				pending = null;
				setActive(id);
			}, getTiming().openDelay);
		},

		close(id, immediate) {
			if (pending === id) {
				openTimer = stop(openTimer);
				pending = null;
			}
			if (active !== id) return;
			closeTimer = stop(closeTimer);

			const finish = () => {
				closeTimer = null;
				setActive(null);
				cool();
			};

			if (immediate || getTiming().closeDelay <= 0) {
				finish();
				return;
			}
			// The grace period is what lets the pointer cross a gap between two
			// triggers without the tooltip flickering off and back on.
			closeTimer = setTimeout(finish, getTiming().closeDelay);
		},

		dismiss(id) {
			blocked = id;
			openTimer = stop(openTimer);
			pending = null;
			if (active === id) {
				closeTimer = stop(closeTimer);
				setActive(null);
				warm = false;
				notify();
			}
		},

		unblock(id) {
			if (blocked !== id) return;
			blocked = null;
		},
	};
}
