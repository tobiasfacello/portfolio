import { useTranslation } from 'react-i18next';
import PillTag from '../../../components/Pill';
import {
	StyledDetailHeader,
	StyledBackLink,
	StyledTitle,
	StyledMetaSummary,
	StyledMetaDot,
	StyledPillsRow,
} from '../styled';
import { useScrollReveal } from '../../../hooks/useScrollReveal';

interface DetailHeaderProps {
	title: string;
	roles: string[];
	tags?: string[];
	publishedDate: string;
	outcome: string;
}

function DetailHeader({ title, roles, tags, publishedDate, outcome }: DetailHeaderProps) {
	const { t } = useTranslation('common');
	const revealRef = useScrollReveal();

	return (
		<StyledDetailHeader ref={revealRef} className="reveal-fade-up">
			<StyledBackLink to="/" viewTransition>
				{t('back')}
			</StyledBackLink>
			<StyledTitle>{title}</StyledTitle>
			<StyledMetaSummary>
				<span>{publishedDate}</span>
				<StyledMetaDot />
				<span>{outcome}</span>
			</StyledMetaSummary>
			<StyledPillsRow>
				{roles.map((role) => (
					<PillTag
						key={role}
						tag={role}
						p={['4', '8', '4', '8']}
					/>
				))}
				{tags && tags.map((tag) => (
					<PillTag
						key={tag}
						tag={tag}
						p={['4', '8', '4', '8']}
					/>
				))}
			</StyledPillsRow>
		</StyledDetailHeader>
	);
}

export default DetailHeader;
