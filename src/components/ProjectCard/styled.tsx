import styled, { css } from 'styled-components';
import { glassCard, iconWrapper } from '../../styles/mixins';
import { mq } from '../../config/breakpoints';

export const TechPillIcon = styled.span`
	${iconWrapper('10px')}

	& svg {
		pointer-events: none;
	}
`;

export const TechPillText = styled.span`
	display: inline-block;
	overflow: hidden;
	white-space: nowrap;
	max-width: 80px;
	opacity: 1;
	transition:
		max-width var(--transition-normal) ease-in-out,
		opacity var(--transition-fast) ease-in-out;

	@media (prefers-reduced-motion: reduce) {
		transition: none;
	}
`;

export const TechPill = styled.span<{ $iconOnly?: boolean }>`
	display: inline-flex;
	align-items: center;
	gap: ${(props) => (props.$iconOnly ? '0' : 'var(--4)')};
	height: 18px;
	padding: 0 ${(props) => (props.$iconOnly ? 'var(--4)' : 'var(--6)')};
	font-family: var(--font-geist-pixel-circle);
	font-size: 9px;
	line-height: 1;
	color: var(--text);
	opacity: var(--opacity-muted);
	border: 1px solid var(--text);
	border-radius: var(--radius-pill);
	white-space: nowrap;
	transition:
		opacity var(--transition-normal),
		gap var(--transition-normal) ease-in-out,
		padding var(--transition-normal) ease-in-out;

	${(props) =>
		props.$iconOnly &&
		css`
			${TechPillText} {
				max-width: 0;
				opacity: 0;
			}
		`}

	${mq.up('desktop-sm')} {
		gap: 0;
		padding: 0 var(--4);

		${TechPillText} {
			max-width: 0;
			opacity: 0;
		}
	}
`;

export const StyledProjectCard = styled.a`
	text-decoration: none;
	color: inherit;
	position: relative;
	width: 100%;
	height: 120px;
	min-width: 320px;
	display: flex;
	justify-content: space-between;
	align-items: center;
	padding: var(--8);
	${glassCard(true)}

	${mq.down('mobile-lg')} {
		& {
			max-width: 335px;
		}
	}

	${mq.between('mobile-lg', 'desktop-sm')} {
		& {
			max-width: 380px;
		}
	}

	& > div:last-of-type img {
		max-width: 100px;
		max-height: 100px;
		width: auto;
		height: auto;
		object-fit: contain;
		opacity: var(--opacity-soft);
		transition: all var(--transition-normal);
	}

	&:hover {
		transform: translateY(-2px);
	}

	&:hover > div:last-of-type img {
		opacity: var(--opacity-full);
	}

	&:hover ${TechPill} {
		opacity: var(--opacity-soft);
	}

	${mq.up('desktop-sm')} {
		&:hover ${TechPill} {
			gap: var(--4);
			padding: 0 var(--6);
		}

		&:hover ${TechPillText} {
			max-width: 80px;
			opacity: 1;
		}
	}
`;
