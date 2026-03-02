import { Fragment } from 'react';

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
	StyledTweetDivider,
	StyledHandle,
	StyledPostCount,
} from './styled';

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

function formatDate(dateStr: string): string {
	const date = new Date(dateStr);
	const now = new Date();
	const diffMs = now.getTime() - date.getTime();
	const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

	if (diffDays === 0) return 'today';
	if (diffDays === 1) return '1d ago';
	if (diffDays < 30) return `${diffDays}d ago`;
	if (diffDays < 365) return `${Math.floor(diffDays / 30)}mo ago`;
	return `${Math.floor(diffDays / 365)}y ago`;
}

export default function TwitterWidget() {
	const { tweets, loading, error } = useTweets();
	const { isDarkMode } = useTheme();
	const fallbackImg = isDarkMode ? profileDark : profileLight;

	return (
		<WidgetBase
			icon={iconRegistry.twitter}
			platformName="Twitter"
			profileUrl={TWITTER_URL}
			loading={loading}
			error={error}
		>
			<StyledHandle>{TWITTER_HANDLE}</StyledHandle>
			<StyledPostCount>~100 posts</StyledPostCount>

			<StyledTweetList>
				{tweets.slice(0, 3).map((tweet, index) => (
					<Fragment key={tweet.id}>
						{index > 0 && <StyledTweetDivider />}
						<StyledTweetItem
							href={tweet.url}
							target="_blank"
							rel="noopener noreferrer"
						>
							<StyledTweetThumbnail>
							<img src={tweet.image || fallbackImg} alt="" loading="lazy" />
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
					</Fragment>
				))}
			</StyledTweetList>
		</WidgetBase>
	);
}
