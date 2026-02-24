import { useTranslation } from 'react-i18next';
import {
	StyledSection,
	StyledSectionTitle,
	StyledProcessStep,
	StyledProcessTitle,
	StyledParagraph,
} from '../styled';
import { useScrollReveal } from '../../../hooks/useScrollReveal';

interface ProcessStep {
	title: string;
	content: string;
}

interface ProcessSectionProps {
	process: Record<string, ProcessStep>;
}

function ProcessSection({ process }: ProcessSectionProps) {
	const { t } = useTranslation('workDetail');
	const revealRef = useScrollReveal<HTMLElement>();

	return (
		<StyledSection ref={revealRef} className="reveal-fade-up">
			<StyledSectionTitle>{t('sections.process')}</StyledSectionTitle>
			{Object.values(process).map((step) => (
				<StyledProcessStep key={step.title}>
					<StyledProcessTitle>{step.title}</StyledProcessTitle>
					<StyledParagraph>{step.content}</StyledParagraph>
				</StyledProcessStep>
			))}
		</StyledSection>
	);
}

export default ProcessSection;
