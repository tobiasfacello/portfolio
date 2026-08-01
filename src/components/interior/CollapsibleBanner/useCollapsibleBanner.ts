import { useCallback, useRef, useState } from 'react';

export type BannerState = 'open' | 'folded' | 'dismissed';

export type UseCollapsibleBannerOptions = {
	state?: BannerState;
	defaultState?: BannerState;
	onStateChange?: (state: BannerState) => void;
	onDismiss?: () => void;
};

/**
 * Three states, not two.
 *
 * Folding and dismissing are different intentions — "I've read this" versus
 * "stop showing me this" — and collapsing them into one boolean loses the
 * distinction the caller needs in order to decide what to persist.
 */
export function useCollapsibleBanner({
	state: controlled,
	defaultState = 'open',
	onStateChange,
	onDismiss,
}: UseCollapsibleBannerOptions = {}) {
	const [uncontrolled, setUncontrolled] = useState<BannerState>(defaultState);
	const state = controlled ?? uncontrolled;

	const changed = useRef(onStateChange);
	changed.current = onStateChange;
	const closed = useRef(onDismiss);
	closed.current = onDismiss;

	const commit = useCallback((next: BannerState) => {
		setUncontrolled(next);
		changed.current?.(next);
	}, []);

	const fold = useCallback(() => commit('folded'), [commit]);
	const expand = useCallback(() => commit('open'), [commit]);
	const restore = useCallback(() => commit('open'), [commit]);

	const toggle = useCallback(() => commit(state === 'open' ? 'folded' : 'open'), [commit, state]);

	const dismiss = useCallback(() => {
		commit('dismissed');
		closed.current?.();
	}, [commit]);

	return {
		state,
		open: state === 'open',
		folded: state === 'folded',
		dismissed: state === 'dismissed',
		fold,
		expand,
		toggle,
		dismiss,
		restore,
	};
}
