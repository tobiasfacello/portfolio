export type TaskStep = {
	id: string;
	label: string;
	/** Shown once the step is done — a duration, a size, a count. */
	meta?: string;
};

export type TaskStepStatus = 'pending' | 'active' | 'done' | 'error';

export type UseTaskStepsOptions = {
	steps: TaskStep[];
	/** Index of the step in progress. Equal to `steps.length` means finished. */
	current: number;
	failed?: boolean;
};

/**
 * Derives each step's status from a single cursor.
 *
 * Keeping one number as the source of truth means the list can never show two
 * active steps or a done step after a pending one — states a per-step flag
 * would happily allow.
 */
export function useTaskSteps({ steps, current, failed = false }: UseTaskStepsOptions) {
	const complete = !failed && current >= steps.length;

	const rows = steps.map((step, i) => ({
		...step,
		status: (i < current
			? 'done'
			: i === current && failed
				? 'error'
				: i === current && !complete
					? 'active'
					: 'pending') as TaskStepStatus,
	}));

	const active = rows.find((r) => r.status === 'active');
	const sentence = failed
		? `Failed at ${steps[Math.min(current, steps.length - 1)]?.label ?? 'step'}`
		: complete
			? `All ${steps.length} steps complete`
			: active
				? `${active.label}, step ${current + 1} of ${steps.length}`
				: '';

	return { rows, complete, failed, sentence };
}
