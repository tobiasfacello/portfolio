import { useTranslation } from 'react-i18next';
import type { TFunction } from 'i18next';

//* Components
import WidgetBase from '../WidgetBase';
import TwitterWidgetSkeleton from '../../Skeleton/TwitterWidgetSkeleton';

//* Styled
import {
	StyledTweetList,
	StyledTweetItem,
	StyledTweetThumbnail,
	StyledTweetContent,
	StyledTweetText,
	StyledTweetMeta,
	StyledTweetStat,
	StyledFooterLabel,
	StyledFooterMeta,
} from './styled';
import { StyledWidgetHandle } from '../WidgetBase/styled';

//* Shared
import { POP_IN_STAGGER_MS } from '../shared/digitPop';

//* Icon registry
import { iconRegistry } from '../../Icon';

//? Hooks
import { useTweets } from '../../../hooks/useTweets';
import { useTheme } from '../../../hooks/useTheme';

//? Data
import { TWITTER_HANDLE, TWITTER_URL } from '../../../data/socialFeed';

//* Assets
import profileDark from '../../../assets/images/profile.jpg';
import profileLight from '../../../assets/images/profile-light.jpg';

function ClockSvg() {
	return (
		<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
			<circle cx="8" cy="8" r="6.5" />
			<polyline points="8 4.5 8 8 10.5 10" />
		</svg>
	);
}

function getRelativeTimeKey(dateStr: string): { key: string; count: number } {
	const date = new Date(dateStr);
	const now = new Date();
	const diffDays = Math.floor((now.getTime() - date.getTime()) / 86400000);

	if (diffDays <= 0) return { key: 'today', count: 0 };
	if (diffDays === 1) return { key: 'oneDay', count: 1 };
	if (diffDays < 30) return { key: 'daysAgo', count: diffDays };
	if (diffDays < 365) return { key: 'monthsAgo', count: Math.floor(diffDays / 30) };
	return { key: 'yearsAgo', count: Math.floor(diffDays / 365) };
}

function formatRelativeTime(t: TFunction<'home'>, dateStr: string): string {
	const { key, count } = getRelativeTimeKey(dateStr);
	return t(`activity.twitter.timeAgo.${key}`, { count });
}

export default function TwitterWidget() {
	const { t } = useTranslation('home');
	const { tweets, loading, error } = useTweets();
	const { isDarkMode } = useTheme();
	const profileImg = isDarkMode ? profileDark : profileLight;

	const visibleTweets = tweets;
	const lastActivity = visibleTweets[0]
		? formatRelativeTime(t, visibleTweets[0].date)
		: null;

	return (
		<WidgetBase
			icon={iconRegistry.twitter}
			platformName="Twitter"
			profileUrl={TWITTER_URL}
			loading={loading}
			error={error}
			skeleton={<TwitterWidgetSkeleton />}
			footer={
				visibleTweets.length > 0
					? (
						<>
							<StyledFooterLabel>
								{t('activity.twitter.recentCount', { count: visibleTweets.length })}
							</StyledFooterLabel>
							{lastActivity && (
								<StyledFooterMeta>
									{t('activity.twitter.lastActivity', { time: lastActivity })}
								</StyledFooterMeta>
							)}
						</>
					)
					: undefined
			}
		>
			<StyledWidgetHandle>{TWITTER_HANDLE}</StyledWidgetHandle>

			<StyledTweetList data-lenis-prevent>
				{visibleTweets.map((tweet, i) => (
					<StyledTweetItem
						key={tweet.id}
						href={tweet.url}
						target="_blank"
						rel="noopener noreferrer"
						style={{ animationDelay: `${i * POP_IN_STAGGER_MS}ms` }}
					>
						<StyledTweetThumbnail>
							<img src={profileImg} alt="Tobias Facello" loading="lazy" />
						</StyledTweetThumbnail>
						<StyledTweetContent>
							<StyledTweetText>{tweet.text}</StyledTweetText>
							<StyledTweetMeta>
								<StyledTweetStat>
									<ClockSvg />
									{formatRelativeTime(t, tweet.date)}
								</StyledTweetStat>
							</StyledTweetMeta>
						</StyledTweetContent>
					</StyledTweetItem>
				))}
			</StyledTweetList>
		</WidgetBase>
	);
}
