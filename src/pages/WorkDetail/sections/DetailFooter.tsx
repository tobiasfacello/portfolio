import { useTranslation } from 'react-i18next';
import { toolIcons } from '../../../data/toolIcons';
import {
	StyledSection,
	StyledMetaCard,
	StyledMetaGrid,
	StyledMetaItem,
	StyledMetaLabel,
	StyledMetaValue,
	StyledPillsRow,
	StyledToolPill,
	StyledToolPillIcon,
	StyledToolPillLabel,
} from '../styled';
import { useScrollReveal } from '../../../hooks/useScrollReveal';

interface DetailFooterProps {
	tools: string[];
	publishedDate: string;
	outcome: string;
	collaborators: string[];
}

function DetailFooter({ tools, publishedDate, outcome, collaborators }: DetailFooterProps) {
	const { t } = useTranslation('workDetail');
	const revealRef = useScrollReveal<HTMLElement>();
	const staggerRef = useScrollReveal();

	return (
		<StyledSection ref={revealRef} className="reveal-fade-up">
			<StyledMetaCard>
				<StyledMetaGrid>
					<StyledMetaItem>
						<StyledMetaLabel>{t('sections.publishedDate')}</StyledMetaLabel>
						<StyledMetaValue>{publishedDate}</StyledMetaValue>
					</StyledMetaItem>
					<StyledMetaItem>
						<StyledMetaLabel>{t('sections.outcome')}</StyledMetaLabel>
						<StyledMetaValue>{outcome}</StyledMetaValue>
					</StyledMetaItem>
					{collaborators.length > 0 && (
						<StyledMetaItem>
							<StyledMetaLabel>{t('sections.collaborators')}</StyledMetaLabel>
							<StyledMetaValue>{collaborators.join(', ')}</StyledMetaValue>
						</StyledMetaItem>
					)}
				</StyledMetaGrid>
				<div>
					<StyledMetaLabel>{t('sections.tools')}</StyledMetaLabel>
					<StyledPillsRow ref={staggerRef} className="reveal-stagger" style={{ marginTop: 8 }}>
						{tools.map((tool) => {
							const ToolIcon = toolIcons[tool];
							return (
								<StyledToolPill key={tool}>
									{ToolIcon && (
										<StyledToolPillIcon aria-hidden="true">
											<ToolIcon />
										</StyledToolPillIcon>
									)}
									<StyledToolPillLabel>{tool}</StyledToolPillLabel>
								</StyledToolPill>
							);
						})}
					</StyledPillsRow>
				</div>
			</StyledMetaCard>
		</StyledSection>
	);
}

export default DetailFooter;
