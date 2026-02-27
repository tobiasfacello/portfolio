import { useTranslation } from 'react-i18next';
import {
	StyledSection,
	StyledSectionTitle,
	StyledLinkPreview,
	StyledLinkThumbnail,
	StyledLinkUrl,
	StyledLinkTitle,
	StyledLinkDescription,
} from '../styled';
import { useScrollReveal } from '../../../hooks/useScrollReveal';

interface LinkPreviewProps {
	title: string;
	description: string;
	url: string;
	thumbnail?: string;
}

function LinkPreview({ title, description, url, thumbnail }: LinkPreviewProps) {
	const { t } = useTranslation('workDetail');
	const revealRef = useScrollReveal<HTMLElement>();

	return (
		<StyledSection ref={revealRef} className="reveal-fade-up">
			<StyledSectionTitle>{t('sections.livePreview')}</StyledSectionTitle>
			<StyledLinkPreview href={`https://${url}`} target="_blank" rel="noopener noreferrer">
				{thumbnail && (
					<StyledLinkThumbnail>
						<img src={thumbnail} alt={title} loading="lazy" />
					</StyledLinkThumbnail>
				)}
				<StyledLinkUrl>{url}</StyledLinkUrl>
				<StyledLinkTitle>{title}</StyledLinkTitle>
				<StyledLinkDescription>{description}</StyledLinkDescription>
			</StyledLinkPreview>
		</StyledSection>
	);
}

export default LinkPreview;
