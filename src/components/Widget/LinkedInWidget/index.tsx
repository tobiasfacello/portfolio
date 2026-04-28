import { useTranslation } from 'react-i18next';

//? Hooks
import { useTheme } from '../../../hooks/useTheme';

//* Components
import WidgetBase from '../WidgetBase';
import LinkedInWidgetSkeleton from '../../Skeleton/LinkedInWidgetSkeleton';
import Text from '../../Text';

//* Styled
import {
	StyledProfileInfo,
	StyledPosition,
	StyledLocation,
	StyledSectionLabel,
	StyledExperienceList,
	StyledExperienceItem,
	StyledCompanyLogo,
	StyledExperienceContent,
	StyledExperienceTitle,
	StyledExperiencePeriod,
	StyledCurrentBadge,
	StyledFooterLabel,
	StyledFooterMeta,
} from './styled';

//* Shared
import { POP_IN_STAGGER_MS } from '../shared/digitPop';

//* Icon registry
import { iconRegistry } from '../../Icon';

//? Data
import { LINKEDIN_URL } from '../../../data/socialFeed';
import { linkedinProfile } from '../../../data/staticSocial';

const visibleExperience = linkedinProfile.experience?.slice(0, 4);
const totalPositions = linkedinProfile.experience?.length ?? 0;

export default function LinkedInWidget() {
	const { t } = useTranslation('home');
	const { isDarkMode } = useTheme();

	return (
		<WidgetBase
			icon={iconRegistry.linkedin}
			platformName="LinkedIn"
			profileUrl={LINKEDIN_URL}
			skeleton={<LinkedInWidgetSkeleton />}
			footer={
				totalPositions > 0
					? (
						<>
							{linkedinProfile.location && (
								<StyledFooterLabel>
									{t('activity.linkedin.basedIn', { location: linkedinProfile.location })}
								</StyledFooterLabel>
							)}
							<StyledFooterMeta>
								{t('activity.linkedin.positionsCount', { count: totalPositions })}
							</StyledFooterMeta>
						</>
					)
					: undefined
			}
		>
			<StyledProfileInfo>
				<Text as="span" variant="subtitle-sm">
					{linkedinProfile.name}
				</Text>
				{linkedinProfile.company && (
					<StyledPosition>
						{linkedinProfile.position} @ {linkedinProfile.company}
					</StyledPosition>
				)}
				{linkedinProfile.location && (
					<StyledLocation>{linkedinProfile.location}</StyledLocation>
				)}
				{visibleExperience && visibleExperience.length > 0 && (
					<>
						<StyledSectionLabel>{t('activity.linkedin.experience')}</StyledSectionLabel>
						<StyledExperienceList>
							{visibleExperience.map((exp, i) => (
								<StyledExperienceItem
									key={`${exp.company}-${exp.title}`}
									style={{ animationDelay: `${i * POP_IN_STAGGER_MS}ms` }}
								>
									{(exp.companyLogo || exp.companyLogoLight) && (
										<StyledCompanyLogo
											src={isDarkMode ? (exp.companyLogoLight || exp.companyLogo) : exp.companyLogo}
											alt={exp.company}
										/>
									)}
									<StyledExperienceContent>
										<StyledExperienceTitle>
											{exp.title} @ {exp.company}
											{exp.current && (
												<StyledCurrentBadge>
													{t('activity.linkedin.currentBadge')}
												</StyledCurrentBadge>
											)}
										</StyledExperienceTitle>
										<StyledExperiencePeriod>
											{exp.period}
										</StyledExperiencePeriod>
									</StyledExperienceContent>
								</StyledExperienceItem>
							))}
						</StyledExperienceList>
					</>
				)}
			</StyledProfileInfo>
		</WidgetBase>
	);
}
