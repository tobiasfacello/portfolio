//! React
import { useLayoutEffect, useRef, type ReactNode } from 'react';

//! GSAP
import { gsap, useGSAP } from '../../../lib/gsap';
import { Flip } from 'gsap/Flip';

//? Hooks
import { usePrefersReducedMotion } from '../../../hooks/usePrefersReducedMotion';
import { useReorderList, type UseReorderListOptions } from './useReorderList';

//? Lib
import { SPRINGS, motionSafe } from '../../../lib/motion';

//* Styled
import {
	StyledReorderList,
	StyledReorderRow,
	StyledReorderGrip,
	StyledReorderLabel,
	StyledReorderPosition,
} from './styled';
import { StyledVisuallyHidden } from '../shared/styled';

gsap.registerPlugin(Flip);

export type ReorderListProps<T> = UseReorderListOptions<T> & {
	label: string;
	renderItem?: (item: T) => ReactNode;
};

function ReorderList<T>({ label, renderItem, ...options }: ReorderListProps<T>) {
	const { items, getId, getLabel } = options;
	const prefersReducedMotion = usePrefersReducedMotion();

	const {
		grabbed,
		dragging,
		spoken,
		registerRow,
		rowKeyDown,
		rowPointerDown,
		rowPointerMove,
		rowPointerUp,
	} = useReorderList(options);

	const listRef = useRef<HTMLUListElement>(null);
	const flipState = useRef<Flip.FlipState | null>(null);

	useLayoutEffect(() => {
		const list = listRef.current;
		if (!list || prefersReducedMotion) return;
		flipState.current = Flip.getState(list.querySelectorAll('li'));
	});

	// The rows that were displaced animate to their new slots; the one under the
	// finger is left alone so it keeps tracking the pointer exactly.
	useGSAP(() => {
		const state = flipState.current;
		if (!state || prefersReducedMotion) return;

		const move = motionSafe(SPRINGS.cell, prefersReducedMotion);
		Flip.from(state, {
			duration: move.duration,
			ease: move.ease,
			targets: listRef.current?.querySelectorAll('li[data-settled="true"]'),
		});
	}, [items, prefersReducedMotion]);

	return (
		<>
			<StyledReorderList ref={listRef} aria-label={label}>
				{items.map((item, index) => {
					const id = getId(item);
					const held = grabbed === id || dragging === id;

					return (
						<StyledReorderRow
							key={id}
							ref={(node) => registerRow(id, node)}
							data-settled={dragging === id ? 'false' : 'true'}
							tabIndex={0}
							aria-roledescription="Sortable item"
							aria-grabbed={grabbed === id || undefined}
							aria-label={`${getLabel(item)}, position ${index + 1} of ${items.length}`}
							onKeyDown={rowKeyDown(id)}
							onPointerDown={rowPointerDown(id)}
							onPointerMove={rowPointerMove}
							onPointerUp={rowPointerUp}
							onPointerCancel={rowPointerUp}
							$held={held}
						>
							<StyledReorderGrip aria-hidden="true">
								<svg width="12" height="12" viewBox="0 0 12 12" fill="currentColor">
									<circle cx="4" cy="3" r="1" />
									<circle cx="8" cy="3" r="1" />
									<circle cx="4" cy="6" r="1" />
									<circle cx="8" cy="6" r="1" />
									<circle cx="4" cy="9" r="1" />
									<circle cx="8" cy="9" r="1" />
								</svg>
							</StyledReorderGrip>

							<StyledReorderLabel>
								{renderItem ? renderItem(item) : getLabel(item)}
							</StyledReorderLabel>

							<StyledReorderPosition aria-hidden="true">{index + 1}</StyledReorderPosition>
						</StyledReorderRow>
					);
				})}
			</StyledReorderList>

			<StyledVisuallyHidden role="status" aria-live="assertive">
				{spoken}
			</StyledVisuallyHidden>
		</>
	);
}

export default ReorderList;
