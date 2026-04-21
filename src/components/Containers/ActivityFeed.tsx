import styled from 'styled-components';
import { useTranslation } from 'react-i18next';

//* Components
import Container from './Container';
import Text from '../Text';
import ShinyLabel from '../ShinyLabel';
import GitHubWidget from '../Widget/GitHubWidget';
import TwitterWidget from '../Widget/TwitterWidget';
import LinkedInWidget from '../Widget/LinkedInWidget';

//? Hooks & Config
import { useBreakpoint, isMobile } from '../../hooks/useBreakpoint';
import { activityFeedConfig } from '../../config/responsive';

//* Styles
import { sectionBase } from '../../styles/mixins';

const StyledActivityFeed = styled.section`
	${sectionBase('activity')}
	justify-content: space-between;
	padding: var(--20) var(--12);
`;

const StyledWidgetGrid = styled.div<{ $columns: number; $gap: string }>`
	width: 100%;
	display: grid;
	grid-template-columns: repeat(${(props) => props.$columns}, 1fr);
	gap: ${(props) => props.$gap};
`;

const StyledTitleRow = styled.div`
	display: flex;
	width: 100%;
	align-items: center;
	gap: var(--12);
`;

export default function ActivityFeed() {
	const bp = useBreakpoint();
	const cfg = activityFeedConfig[bp];
	const { t } = useTranslation('home');

	return (
		<StyledActivityFeed>
			<Container
				w={cfg.outerW}
				maxW={cfg.outerMaxW}
				direction="column"
				justify="space-between"
				align={isMobile(bp) ? 'center' : 'start'}
				gap={cfg.outerGap}
			>
				<StyledTitleRow>
					<Text as="h2" variant="subtitle-sm">
						{t('activity.title')}
					</Text>
					<ShinyLabel label={t('activity.liveFeed')} icon="radioTower" />
				</StyledTitleRow>
				<StyledWidgetGrid $columns={cfg.gridColumns} $gap={cfg.gridGap}>
					<GitHubWidget />
					<TwitterWidget />
					<LinkedInWidget />
				</StyledWidgetGrid>
			</Container>
		</StyledActivityFeed>
	);
}
