//* Components
import WidgetBase from '../WidgetBase';

//* Styled
import {
	StyledTweetList,
	StyledTweetItem,
	StyledTweetThumbnail,
	StyledTweetContent,
	StyledTweetText,
	StyledTweetMeta,
	StyledTweetStat,
} from './styled';
import { StyledWidgetHandle, StyledWidgetStat } from '../WidgetBase/styled';

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

const formatDateCache = new Map<string, string>();
function formatDate(dateStr: string): string {
	const cached = formatDateCache.get(dateStr);
	if (cached) return cached;

	const date = new Date(dateStr);
	const now = new Date();
	const diffMs = now.getTime() - date.getTime();
	const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

	let result: string;
	if (diffDays === 0) result = 'today';
	else if (diffDays === 1) result = '1d ago';
	else if (diffDays < 30) result = `${diffDays}d ago`;
	else if (diffDays < 365) result = `${Math.floor(diffDays / 30)}mo ago`;
	else result = `${Math.floor(diffDays / 365)}y ago`;

	formatDateCache.set(dateStr, result);
	return result;
}

export default function TwitterWidget() {
	const { tweets, loading, error } = useTweets();
	const { isDarkMode } = useTheme();
	const profileImg = isDarkMode ? profileDark : profileLight;

	return (
		<WidgetBase
			icon={iconRegistry.twitter}
			platformName="Twitter"
			profileUrl={TWITTER_URL}
			loading={loading}
			error={error}
		>
			<StyledWidgetHandle>{TWITTER_HANDLE}</StyledWidgetHandle>
			<StyledWidgetStat>~100 posts</StyledWidgetStat>

			<StyledTweetList>
				{tweets.slice(0, 3).map((tweet) => (
					<StyledTweetItem
						key={tweet.id}
						href={tweet.url}
						target="_blank"
						rel="noopener noreferrer"
					>
						<StyledTweetThumbnail>
							<img src={profileImg} alt="Tobias Facello" loading="lazy" />
						</StyledTweetThumbnail>
						<StyledTweetContent>
							<StyledTweetText>{tweet.text}</StyledTweetText>
							<StyledTweetMeta>
								<StyledTweetStat>
									<ClockSvg />
									{formatDate(tweet.date)}
								</StyledTweetStat>
							</StyledTweetMeta>
						</StyledTweetContent>
					</StyledTweetItem>
				))}
			</StyledTweetList>
		</WidgetBase>
	);
}
