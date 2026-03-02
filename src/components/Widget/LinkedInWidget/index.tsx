//? Hooks
import { useTheme } from '../../../hooks/useTheme';

//* Components
import WidgetBase from '../WidgetBase';
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
} from './styled';

//* Icon registry
import { iconRegistry } from '../../Icon';

//? Data
import { LINKEDIN_URL } from '../../../data/socialFeed';
import { linkedinProfile } from '../../../data/staticSocial';

export default function LinkedInWidget() {
	const { isDarkMode } = useTheme();
	const visibleExperience = linkedinProfile.experience?.slice(0, 4);

	return (
		<WidgetBase
			icon={iconRegistry.linkedin}
			platformName="LinkedIn"
			profileUrl={LINKEDIN_URL}
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
						<StyledSectionLabel>Experience</StyledSectionLabel>
						<StyledExperienceList>
							{visibleExperience.map((exp) => (
								<StyledExperienceItem
									key={`${exp.company}-${exp.title}`}
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
													Current
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
