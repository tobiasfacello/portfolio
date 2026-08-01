import styled from 'styled-components';

//* Config
import { mq } from '../../config/breakpoints';

//* Mixins
import { glassGradientBorder } from '../../styles/mixins';

//* Shared
import { bareButton, focusRing, uiLabel, wellSurface } from '../../components/interior/shared/styled';

//? Variants
import { control } from '../../components/interior/shared/variants';

export const StyledPage = styled.div`
	/* macOS renders these faces heavier than drawn. Scoped to the showcase
	   rather than <html> so the rest of the portfolio keeps its current weight —
	   move it up a level if the thinner rendering should apply everywhere. */
	-webkit-font-smoothing: antialiased;
	-moz-osx-font-smoothing: grayscale;
	width: 100%;
	min-height: 100vh;
	display: flex;
	flex-direction: column;
	align-items: center;
	padding: var(--24) var(--16) var(--48);

	${mq.up('mobile-lg')} {
		padding: var(--48) var(--32);
	}
`;

export const StyledShell = styled.div`
	width: 100%;
	max-width: 1240px;
	display: flex;
	flex-direction: column;
	gap: var(--32);

	${mq.up('tablet')} {
		flex-direction: row;
		align-items: flex-start;
		gap: var(--48);
	}
`;

export const StyledHeader = styled.header`
	width: 100%;
	max-width: 1240px;
	display: flex;
	flex-direction: column;
	gap: var(--8);
	margin-bottom: var(--32);
`;

export const StyledHeaderRow = styled.div`
	display: flex;
	align-items: baseline;
	justify-content: space-between;
	gap: var(--16);
	flex-wrap: wrap;
`;

export const StyledCount = styled.span`
	${uiLabel}
	opacity: var(--opacity-text-muted);
	font-variant-numeric: tabular-nums;
`;

export const StyledLead = styled.p`
	font-family: var(--font-plus-jakarta-sans);
	font-size: var(--font-size-body-sm);
	line-height: var(--line-height-body);
	color: var(--text);
	opacity: var(--opacity-text-muted);
	max-width: 62ch;
`;

/* ── Sidebar ─────────────────────────────────────────────── */

export const StyledSidebar = styled.nav`
	width: 100%;
	flex-shrink: 0;

	${mq.up('tablet')} {
		position: sticky;
		top: var(--32);
		width: 210px;
		max-height: calc(100vh - var(--48));
		overflow-y: auto;
		overscroll-behavior: contain;
	}
`;

export const StyledSidebarGroup = styled.div`
	display: flex;
	flex-direction: column;
	gap: var(--4);

	& + & {
		margin-top: var(--20);
	}
`;

export const StyledSidebarTitle = styled.h2`
	${uiLabel}
	font-size: var(--font-size-caption);
	letter-spacing: 0.08em;
	text-transform: uppercase;
	opacity: var(--opacity-text-muted);
	margin-bottom: var(--4);
`;

export const StyledSidebarLink = styled.a<{ $active?: boolean }>`
	${uiLabel}
	display: flex;
	align-items: center;
	min-height: var(--hit-area-min);
	padding: var(--4) var(--8);
	border-radius: var(--radius-sm);
	text-decoration: none;
	opacity: ${({ $active }) => ($active ? 'var(--opacity-full)' : 'var(--opacity-text-muted)')};
	background-color: ${({ $active }) => ($active ? 'var(--glass-bg-bold)' : 'transparent')};
	transition:
		opacity var(--transition-fast) var(--ease-state),
		background-color var(--transition-fast) var(--ease-state);

	&:hover {
		opacity: var(--opacity-full);
		background-color: var(--glass-bg-bold);
	}

	${focusRing}
`;

/* ── Filter ──────────────────────────────────────────────── */

export const StyledSearch = styled.input`
	${uiLabel}
	${wellSurface}
	width: 100%;
	padding: var(--8) var(--12);
	margin-bottom: var(--16);
	border: none;
	outline: none;

	&::placeholder {
		color: var(--text);
		opacity: var(--opacity-text-muted);
	}

	${focusRing}
`;

/* ── Content ─────────────────────────────────────────────── */

export const StyledContent = styled.main`
	flex: 1;
	min-width: 0;
	display: flex;
	flex-direction: column;
	gap: var(--48);
`;

export const StyledSection = styled.section`
	display: flex;
	flex-direction: column;
	gap: var(--16);
	scroll-margin-top: var(--32);
`;

export const StyledSectionHeading = styled.h2`
	text-wrap: balance;
	${uiLabel}
	font-size: var(--font-size-subtitle-sm);
	line-height: var(--line-height-subtitle-sm);
	opacity: var(--opacity-full);
`;

export const StyledEntry = styled.article`
	display: flex;
	flex-direction: column;
	gap: var(--12);
	scroll-margin-top: var(--32);
`;

export const StyledEntryHeader = styled.div`
	display: flex;
	flex-direction: column;
	gap: var(--4);
`;

export const StyledEntryTitleRow = styled.div`
	display: flex;
	align-items: center;
	gap: var(--8);
	flex-wrap: wrap;
`;

export const StyledEntryTitle = styled.h3`
	text-wrap: balance;
	${uiLabel}
	font-size: var(--font-size-body);
	line-height: var(--line-height-body);
`;

/** Marks a component that builds on something already in the design system. */
export const StyledExtendsBadge = styled.span`
	${uiLabel}
	padding: var(--2) var(--8);
	border: 1px solid var(--glass-border-bold-start);
	border-radius: var(--radius-pill);
	font-size: var(--font-size-caption);
	opacity: var(--opacity-text-muted);
	white-space: nowrap;
`;

export const StyledEntryNote = styled.p`
	text-wrap: pretty;
	font-family: var(--font-plus-jakarta-sans);
	font-size: var(--font-size-body-sm);
	line-height: var(--line-height-body-sm);
	color: var(--text);
	opacity: var(--opacity-text-muted);
	max-width: 68ch;
`;

/**
 * The preview surface. Recessed rather than lifted, so the component being
 * demonstrated is what reads as the foreground object on the page.
 */
export const StyledPreview = styled.div<{ $align?: 'center' | 'stretch' }>`
	position: relative;
	display: flex;
	flex-direction: column;
	align-items: ${({ $align }) => ($align === 'stretch' ? 'stretch' : 'center')};
	justify-content: center;
	gap: var(--16);
	min-height: 132px;
	/* A centred demo is usually one control. Left to fill the column it became a
	   980px box around a 72px button — 7% full on a wide screen. Capping it at
	   the notes' own measure keeps the box and the prose on one edge. */
	width: 100%;
	${({ $align }) => ($align === 'stretch' ? '' : 'max-width: 720px;')}
	padding: var(--24) var(--16);
	background-color: var(--glass-bg-bold);
	background-clip: padding-box;
	border-radius: var(--radius-lg);
	overflow: hidden;
	${glassGradientBorder({ radius: 'var(--radius-lg)' })}

	${mq.up('mobile-lg')} {
		padding: var(--32) var(--24);
	}
`;

export const StyledEmpty = styled.p`
	${uiLabel}
	opacity: var(--opacity-text-muted);
	padding: var(--32) 0;
	text-align: center;
`;

/* ── Demo scaffolding shared by previews ─────────────────── */

export const StyledDemoRow = styled.div`
	display: flex;
	align-items: center;
	justify-content: center;
	gap: var(--12);
	flex-wrap: wrap;
`;

/**
 * Prose inside a preview.
 *
 * Separate from StyledDemoRow on purpose: that one is a flex row for laying out
 * controls, so a sentence with an inline <code> in it gets torn into one flex
 * item per fragment, each pushed apart by the row gap. This is a paragraph.
 */
export const StyledDemoNote = styled.p`
	font-family: var(--font-plus-jakarta-sans);
	font-size: var(--font-size-body-sm);
	line-height: var(--line-height-body-sm);
	color: var(--text);
	opacity: var(--opacity-text-muted);
	text-wrap: pretty;
	max-width: 64ch;

	code {
		font-family: var(--font-geist-pixel-circle);
		font-size: var(--font-size-label);
		padding: 0 var(--4);
		border-radius: var(--radius-sm);
		background-color: var(--glass-bg-bold);
		white-space: nowrap;
	}
`;

export const StyledDemoStack = styled.div<{ $w?: string }>`
	display: flex;
	flex-direction: column;
	gap: var(--12);
	width: ${({ $w }) => $w ?? '100%'};
	/* The 420px cap is for the unsized default — a lone control that should not
	   stretch across the card. A demo that asked for a width already knows how
	   wide it wants to be, and the cap was quietly overruling it. */
	max-width: ${({ $w }) => ($w ? 'none' : '420px')};
`;

/**
 * The showcase's own buttons, built from the same variant the page documents.
 * Hand-rolling them would have let the chrome drift from the system it is
 * supposed to be demonstrating.
 */
export const StyledDemoButton = styled.button`
	${bareButton}
	${control({ size: 'sm' })}
	${focusRing}
`;

export const StyledBackLink = styled.a`
	${uiLabel}
	${focusRing}
	display: inline-flex;
	align-items: center;
	min-height: var(--hit-area-min);
	gap: var(--6);
	width: fit-content;
	text-decoration: none;
	opacity: var(--opacity-text-muted);
	transition: opacity var(--transition-fast) var(--ease-state);

	&:hover {
		opacity: var(--opacity-full);
	}
`;
