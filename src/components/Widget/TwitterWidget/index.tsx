import { useTranslation } from 'react-i18next';
import type { TFunction } from 'i18next';

//* Components
import WidgetBase from '../WidgetBase';
import TwitterWidgetSkeleton from '../../Skeleton/TwitterWidgetSkeleton';

//* Styled
import {
	StyledPinnedCard,
	StyledAuthorRow,
	StyledAvatar,
	StyledAuthorInfo,
	StyledAuthorName,
	StyledVerifiedBadge,
	StyledAuthorMeta,
	StyledTweetBody,
	StyledStatsRow,
	StyledStat,
	StyledFooterLabel,
	StyledFooterMeta,
} from './styled';
//* Icon registry
import { iconRegistry } from '../../Icon';

//? Hooks
import { usePinnedTweet } from '../../../hooks/usePinnedTweet';
import { useTheme } from '../../../hooks/useTheme';

//? Data
import { TWITTER_URL } from '../../../data/socialFeed';

//* Assets
import profileDark from '../../../assets/images/profile.webp';
import profileLight from '../../../assets/images/profile-light.webp';

function VerifiedSvg() {
	return (
		<svg viewBox="0 0 22 22" fill="none" aria-hidden="true">
			<path
				fill="currentColor"
				d="M20.396 11c-.018-.646-.215-1.275-.57-1.816-.354-.54-.852-.972-1.438-1.246.223-.607.27-1.264.14-1.897-.131-.634-.437-1.218-.882-1.687-.47-.445-1.053-.75-1.687-.882-.633-.13-1.29-.083-1.897.14-.273-.587-.704-1.086-1.245-1.44S11.647 1.62 11 1.604c-.646.017-1.273.213-1.813.568s-.969.854-1.24 1.44c-.608-.223-1.267-.272-1.902-.14-.635.13-1.22.436-1.69.882-.445.47-.749 1.055-.878 1.688-.13.633-.08 1.29.144 1.896-.587.274-1.087.705-1.443 1.245-.356.54-.555 1.17-.574 1.817.02.647.218 1.276.574 1.817.356.54.856.972 1.443 1.245-.224.606-.274 1.263-.144 1.896.13.634.433 1.218.877 1.688.47.443 1.054.747 1.687.878.633.132 1.29.084 1.897-.136.274.586.705 1.084 1.246 1.439.54.354 1.17.551 1.816.569.647-.016 1.276-.213 1.817-.567s.972-.854 1.245-1.44c.604.239 1.266.296 1.903.164.636-.132 1.22-.447 1.68-.907.46-.46.776-1.044.908-1.681s.075-1.299-.165-1.903c.586-.274 1.084-.705 1.439-1.246.354-.54.551-1.17.569-1.816z"
			/>
			<path
				fill="var(--background)"
				d="M9.662 14.85l-3.429-3.428 1.293-1.302 2.072 2.072 4.4-4.794 1.347 1.246z"
			/>
		</svg>
	);
}

function HeartSvg() {
	return (
		<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
			<path d="M8 13.5s-5-3-5-7a3 3 0 0 1 5-2.2A3 3 0 0 1 13 6.5c0 4-5 7-5 7z" />
		</svg>
	);
}

function RetweetSvg() {
	return (
		<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
			<polyline points="11 2 14 5 11 8" />
			<path d="M14 5H5a2 2 0 0 0-2 2v1" />
			<polyline points="5 14 2 11 5 8" />
			<path d="M2 11h9a2 2 0 0 0 2-2V8" />
		</svg>
	);
}

function ReplySvg() {
	return (
		<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
			<path d="M14 8a5.5 5.5 0 0 1-7.5 5L2 14l1-3A5.5 5.5 0 1 1 14 8z" />
		</svg>
	);
}

function ViewSvg() {
	return (
		<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
			<path d="M1 8s2.5-5 7-5 7 5 7 5-2.5 5-7 5-7-5-7-5z" />
			<circle cx="8" cy="8" r="2" />
		</svg>
	);
}

function getRelativeTimeKey(dateStr: string): { key: string; count: number } {
	const time = new Date(dateStr).getTime();
	// Unparseable / non-ISO date → safe default instead of "NaN years ago".
	if (Number.isNaN(time)) return { key: 'today', count: 0 };

	const diffDays = Math.floor((Date.now() - time) / 86400000);

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

function formatCompactNumber(n: number): string {
	if (!Number.isFinite(n)) return '0';
	if (n < 1000) return String(n);
	if (n < 1_000_000) {
		const value = n / 1000;
		const formatted = value % 1 === 0 ? String(value) : value.toFixed(1);
		// toFixed can round 999,950–999,999 up to "1000.0" — roll over to M.
		if (Number(formatted) >= 1000) return '1M';
		return `${formatted}K`;
	}
	const value = n / 1_000_000;
	return `${value % 1 === 0 ? value : value.toFixed(1)}M`;
}

export default function TwitterWidget() {
	const { t } = useTranslation('home');
	const { tweet, loading, error } = usePinnedTweet();
	const { isDarkMode } = useTheme();

	const fallbackAvatar = isDarkMode ? profileDark : profileLight;
	const avatarSrc = tweet?.author.profilePicture || fallbackAvatar;
	const relativeDate = tweet ? formatRelativeTime(t, tweet.date) : null;

	return (
		<WidgetBase
			icon={iconRegistry.twitter}
			platformName="Twitter"
			profileUrl={TWITTER_URL}
			loading={loading}
			error={error}
			skeleton={<TwitterWidgetSkeleton />}
			footer={
				tweet && relativeDate
					? (
						<>
							<StyledFooterLabel>{t('activity.twitter.pinnedLabel')}</StyledFooterLabel>
							<StyledFooterMeta>
								{t('activity.twitter.lastActivity', { time: relativeDate })}
							</StyledFooterMeta>
						</>
					)
					: undefined
			}
		>
			{tweet && (
				<StyledPinnedCard
					href={tweet.url}
					target="_blank"
					rel="noopener noreferrer"
					aria-label={t('activity.twitter.openPinned', { defaultValue: 'Open pinned tweet' })}
				>
					<StyledAuthorRow>
						<StyledAvatar>
							<img src={avatarSrc} alt={tweet.author.name} loading="lazy" decoding="async" />
						</StyledAvatar>
						<StyledAuthorInfo>
							<StyledAuthorName>
								<span>{tweet.author.name}</span>
								{tweet.author.isVerified && (
									<StyledVerifiedBadge aria-label="Verified">
										<VerifiedSvg />
									</StyledVerifiedBadge>
								)}
							</StyledAuthorName>
							<StyledAuthorMeta>
								@{tweet.author.userName} · {relativeDate}
							</StyledAuthorMeta>
						</StyledAuthorInfo>
					</StyledAuthorRow>

					<StyledTweetBody>{tweet.text}</StyledTweetBody>

					<StyledStatsRow>
						<StyledStat>
							<HeartSvg />
							{formatCompactNumber(tweet.stats.likes)}
						</StyledStat>
						<StyledStat>
							<RetweetSvg />
							{formatCompactNumber(tweet.stats.retweets)}
						</StyledStat>
						<StyledStat>
							<ReplySvg />
							{formatCompactNumber(tweet.stats.replies)}
						</StyledStat>
						<StyledStat>
							<ViewSvg />
							{formatCompactNumber(tweet.stats.views)}
						</StyledStat>
					</StyledStatsRow>
				</StyledPinnedCard>
			)}
		</WidgetBase>
	);
}
