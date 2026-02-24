import { useTranslation } from 'react-i18next';
import { StyledSection, StyledSectionTitle, StyledTextContent, StyledParagraph } from '../styled';
import { useScrollReveal } from '../../../hooks/useScrollReveal';

interface ProjectOverviewProps {
	overview: string;
}

function ProjectOverview({ overview }: ProjectOverviewProps) {
	const { t } = useTranslation('workDetail');
	const revealRef = useScrollReveal<HTMLElement>();

	return (
		<StyledSection ref={revealRef} className="reveal-fade-up">
			<StyledSectionTitle>{t('sections.overview')}</StyledSectionTitle>
			<StyledTextContent>
				<StyledParagraph>{overview}</StyledParagraph>
			</StyledTextContent>
		</StyledSection>
	);
}

export default ProjectOverview;
