import styled from 'styled-components';

//* Shared
import { uiLabel } from '../shared/styled';

export type OtpStatus = 'idle' | 'error' | 'success';

const borderFor = (status: OtpStatus, active: boolean, filled: boolean) => {
	if (status === 'error') return 'var(--danger)';
	if (status === 'success') return 'var(--success)';
	if (active) return 'var(--accent)';
	if (filled) return 'var(--primary)';
	return 'var(--glass-border-bold-start)';
};

export const StyledOtpRoot = styled.div`
	display: inline-flex;
	flex-direction: column;
`;

export const StyledOtpGroup = styled.div`
	position: relative;
	display: flex;
	gap: var(--8);
`;

export const StyledOtpCell = styled.div<{ $gap: boolean }>`
	position: relative;
	width: 40px;
	height: 48px;
	/* A visual break every few characters makes a long code easier to read back. */
	margin-left: ${({ $gap }) => ($gap ? 'var(--12)' : '0')};
`;

/**
 * The real input is transparent — caret and all — so the character can be
 * animated as its own element. Without this the browser's own text rendering
 * would jump into place with no transition available.
 */
export const StyledOtpField = styled.input<{
	$status: OtpStatus;
	$active: boolean;
	$filled: boolean;
}>`
	width: 40px;
	height: 48px;
	border-radius: var(--radius-md);
	border: 2px solid ${({ $status, $active, $filled }) => borderFor($status, $active, $filled)};
	background-color: ${({ $filled, $active }) =>
		$filled || $active ? 'transparent' : 'var(--glass-bg-bold)'};
	text-align: center;
	font-size: 15px;
	color: transparent;
	caret-color: transparent;
	outline: none;
	transition:
		border-color var(--transition-fast) var(--ease-state),
		background-color var(--transition-fast) var(--ease-state);

	&::selection {
		background: transparent;
	}

	&:disabled {
		opacity: 0.5;
	}
`;

export const StyledOtpGlyphSlot = styled.span`
	position: absolute;
	inset: 0;
	display: grid;
	place-items: center;
	pointer-events: none;

	> * {
		grid-area: 1 / 1;
	}
`;

export const StyledOtpGlyph = styled.span`
	${uiLabel}
	font-size: 15px;
	font-variant-numeric: tabular-nums;
	will-change: transform, opacity, filter;
`;

export const StyledOtpCaret = styled.span`
	display: block;
	width: 1.5px;
	height: 17px;
	border-radius: 1px;
	background-color: var(--text);
`;

export const StyledOtpStatusSlot = styled.div`
	display: grid;
	height: var(--16);
	margin-top: var(--8);
`;

export const StyledOtpMessage = styled.span<{ $status: OtpStatus }>`
	text-wrap: pretty;
	${uiLabel}
	grid-area: 1 / 1;
	font-size: var(--font-size-caption);
	line-height: 16px;
	color: ${({ $status }) =>
		$status === 'error'
			? 'var(--danger)'
			: $status === 'success'
				? 'var(--success)'
				: 'var(--text)'};
	opacity: ${({ $status }) => ($status === 'idle' ? 'var(--opacity-text-muted)' : 'var(--opacity-full)')};
`;
