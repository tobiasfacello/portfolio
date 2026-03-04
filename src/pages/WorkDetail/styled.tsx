import styled from 'styled-components';
import { Link } from 'react-router-dom';
import { glassBorder, glassCard, noisePatternBackground, iconWrapper, responsiveCardPadding, imageCardContent } from '../../styles/mixins';
import { mq } from '../../config/breakpoints';

export const StyledWorkDetail = styled.main`
	width: 100%;
	min-height: 100vh;
	display: flex;
	flex-direction: column;
	align-items: center;
	padding: 0 20px;

	${mq.up('mobile-lg')} {
		padding: 0 40px;
	}

	${mq.up('desktop-sm')} {
		padding: 0 60px;
	}
`;

export const StyledDetailContent = styled.article`
	width: 100%;
	max-width: 1100px;
	display: flex;
	flex-direction: column;
	gap: 48px;
	padding: 36px 0 72px;

	${mq.up('mobile-lg')} {
		gap: 64px;
		padding: 48px 0 96px;
	}
`;

export const StyledSection = styled.section`
	width: 100%;
	display: flex;
	flex-direction: column;
	gap: 20px;
`;

export const StyledSectionTitle = styled.h2`
	font-family: var(--font-geist-pixel-circle);
	font-size: 14px;
	font-weight: 700;
	letter-spacing: 2px;
	text-transform: uppercase;
	color: var(--primary);
	opacity: 0.6;
`;

export const StyledTextContent = styled.div`
	max-width: 700px;
`;

export const StyledParagraph = styled.p`
	font-family: var(--font-geist-pixel-circle);
	font-size: 15px;
	line-height: 1.7;
	color: var(--text);
	opacity: 0.85;

	${mq.up('mobile-lg')} {
		font-size: 16px;
	}
`;

export const StyledProcessStep = styled.div`
	display: flex;
	flex-direction: column;
	gap: 8px;
	padding-left: 16px;
	border-left: 2px solid var(--secondary-60);
`;

export const StyledProcessTitle = styled.h3`
	font-family: var(--font-geist-pixel-circle);
	font-size: 16px;
	font-weight: 700;
	color: var(--text);

	${mq.up('mobile-lg')} {
		font-size: 18px;
	}
`;

/* ── Hero Showcase ── */

export const StyledHeroShowcase = styled.div`
	width: 100%;
	overflow: hidden;
	${glassBorder(true)}
	${responsiveCardPadding}
	${imageCardContent()}
`;

/* ── Design System Frame ── */

export const StyledDesignSystemFrame = styled.div`
	position: relative;
	width: 100%;
	border-radius: 20px;
	${glassCard(true)}
	${responsiveCardPadding}
	${imageCardContent()}
`;

/* ── Phone Mockups Gallery ── */

export const StyledPhoneGallery = styled.div`
	display: flex;
	gap: 16px;
	overflow-x: auto;
	scroll-snap-type: x mandatory;
	-webkit-overflow-scrolling: touch;
	padding-bottom: 8px;

	/* Hide scrollbar */
	scrollbar-width: none;
	&::-webkit-scrollbar {
		display: none;
	}

	${mq.up('mobile-lg')} {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
		overflow-x: visible;
		scroll-snap-type: none;
		padding-bottom: 0;
	}
`;

export const StyledPhoneCard = styled.div`
	flex: 0 0 75%;
	scroll-snap-align: start;
	overflow: hidden;
	${glassBorder(true)}
	${responsiveCardPadding}
	${imageCardContent(1.02)}

	${mq.up('mobile-lg')} {
		flex: none;
	}
`;

/* ── Meta Card (footer) ── */

export const StyledMetaCard = styled.div`
	width: 100%;
	display: flex;
	flex-direction: column;
	gap: 24px;
	${glassBorder(true)}
	${noisePatternBackground}
	${responsiveCardPadding}
`;

export const StyledMetaGrid = styled.div`
	display: grid;
	grid-template-columns: 1fr 1fr;
	gap: 24px;

	${mq.up('mobile-lg')} {
		grid-template-columns: repeat(3, 1fr);
	}
`;

export const StyledMetaItem = styled.div`
	display: flex;
	flex-direction: column;
	gap: 6px;
`;

export const StyledMetaLabel = styled.span`
	font-family: var(--font-geist-pixel-circle);
	font-size: 11px;
	font-weight: 700;
	letter-spacing: 1.5px;
	text-transform: uppercase;
	color: var(--primary);
	opacity: 0.5;
`;

export const StyledMetaValue = styled.span`
	font-family: var(--font-geist-pixel-circle);
	font-size: 14px;
	color: var(--text);
	opacity: 0.85;
`;

export const StyledPillsRow = styled.div`
	display: flex;
	flex-wrap: wrap;
	gap: 8px;
`;

/* ── Tool Pill (work detail variant) ── */

export const StyledToolPillIcon = styled.span`
	${iconWrapper('14px')}
	color: var(--text);
	transition: color 300ms;
`;

export const StyledToolPillLabel = styled.span`
	font-family: var(--font-geist-pixel-circle);
	font-size: 10px;
	text-align: center;
	color: var(--text);
`;

export const StyledToolPill = styled.span`
	width: auto;
	height: 22px;
	display: flex;
	justify-content: center;
	align-items: center;
	gap: 4px;
	padding: var(--4) var(--8);
	border: 1px solid var(--text);
	border-radius: 30px;
	opacity: 0.6;
	transition: all 300ms;

	&:hover {
		opacity: 1;
		background-color: var(--accent);
		border-color: var(--primary);
	}

	&:hover ${StyledToolPillLabel} {
		color: var(--pill-text-hovered);
	}

	&:hover ${StyledToolPillIcon} {
		color: var(--pill-text-hovered);
	}
`;

/* ── Meta Summary (DetailHeader) ── */

export const StyledMetaSummary = styled.div`
	display: flex;
	align-items: center;
	gap: 8px;
	font-family: var(--font-geist-pixel-circle);
	font-size: 14px;
	color: var(--text);
	opacity: 0.6;
`;

export const StyledMetaDot = styled.span`
	width: 3px;
	height: 3px;
	border-radius: 50%;
	background-color: var(--text);
	opacity: 0.4;
`;

/* ── Link Preview ── */

export const StyledLinkPreview = styled.a`
	display: flex;
	flex-direction: column;
	gap: 8px;
	text-decoration: none;
	color: inherit;
	${glassBorder(true)}
	${responsiveCardPadding}

	&:hover::after {
		background: linear-gradient(
			to bottom,
			var(--glass-border-bold-hover-start),
			var(--glass-border-bold-hover-end)
		);
	}
`;

export const StyledLinkUrl = styled.span`
	font-family: var(--font-geist-pixel-circle);
	font-size: 13px;
	color: var(--primary);
	opacity: 0.6;
`;

export const StyledLinkTitle = styled.span`
	font-family: var(--font-geist-pixel-circle);
	font-size: 18px;
	font-weight: 700;
	color: var(--text);
`;

export const StyledLinkDescription = styled.span`
	font-family: var(--font-geist-pixel-circle);
	font-size: 14px;
	color: var(--text);
	opacity: 0.7;
`;

export const StyledLinkThumbnail = styled.div`
	max-height: 200px;
	border-radius: 12px;
	overflow: hidden;

	${mq.up('mobile-lg')} {
		border-radius: 8px;
	}

	& > img {
		width: 100%;
		height: 100%;
		display: block;
		object-fit: cover;
	}
`;

/* ── Detail Header ── */

export const StyledDetailHeader = styled.div`
	display: flex;
	flex-direction: column;
	gap: 20px;
`;

export const StyledBackLink = styled(Link)`
	display: inline-flex;
	align-items: center;
	gap: 8px;
	font-family: var(--font-geist-pixel-circle);
	font-size: 14px;
	color: var(--primary);
	text-decoration: none;
	opacity: 0.6;
	transition: opacity 200ms;

	&:hover {
		opacity: 1;
	}

	&::before {
		content: '\u2190';
	}
`;

export const StyledTitle = styled.h1`
	font-family: var(--font-geist-pixel-circle);
	font-size: 36px;
	font-weight: 700;
	color: var(--text);
	letter-spacing: -0.5px;

	${mq.up('mobile-lg')} {
		font-size: 48px;
	}
`;

