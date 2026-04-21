import styled from 'styled-components';
import { shimmerSurface } from './shimmer';

const TWEET_COUNT = 3;

const HandlePlaceholder = styled.span`
	display: block;
	width: 96px;
	height: 10px;
	border-radius: 3px;
	${shimmerSurface}
`;

const StatPlaceholder = styled.span`
	display: block;
	width: 100px;
	height: 10px;
	border-radius: 3px;
	${shimmerSurface}

	&::after {
		animation-delay: 0.1s;
	}
`;

const TweetList = styled.div`
	display: flex;
	flex-direction: column;
	gap: var(--6);
	width: 100%;
	flex: 1;
`;

const TweetItem = styled.div`
	display: flex;
	flex-direction: row;
	gap: var(--8);
	padding: var(--6);
	border-radius: var(--radius-sm);
	contain: layout paint;
`;

const TweetThumbnail = styled.span`
	display: block;
	width: 32px;
	height: 32px;
	border-radius: var(--radius-sm);
	flex-shrink: 0;
	${shimmerSurface}
`;

const TweetContent = styled.div`
	display: flex;
	flex-direction: column;
	gap: var(--4);
	min-width: 0;
	flex: 1;
	justify-content: center;
`;

const TweetText = styled.span<{ $delay: number; $w: string }>`
	display: block;
	width: ${({ $w }) => $w};
	height: 9px;
	border-radius: 2px;
	${shimmerSurface}

	&::after {
		animation-delay: ${({ $delay }) => $delay}s;
	}
`;

const TweetMeta = styled.span<{ $delay: number }>`
	display: block;
	width: 48px;
	height: 8px;
	border-radius: 2px;
	${shimmerSurface}

	&::after {
		animation-delay: ${({ $delay }) => $delay}s;
	}
`;

const textWidths = ['92%', '78%', '85%'];

function TwitterWidgetSkeleton() {
	return (
		<div
			role="status"
			aria-live="polite"
			aria-busy="true"
			aria-label="Cargando actividad de Twitter"
			style={{ display: 'contents' }}
		>
			<HandlePlaceholder aria-hidden="true" />
			<StatPlaceholder aria-hidden="true" />

			<TweetList aria-hidden="true">
				{Array.from({ length: TWEET_COUNT }, (_, i) => (
					<TweetItem key={i}>
						<TweetThumbnail />
						<TweetContent>
							<TweetText $w={textWidths[i % textWidths.length]} $delay={i * 0.08} />
							<TweetMeta $delay={i * 0.08 + 0.05} />
						</TweetContent>
					</TweetItem>
				))}
			</TweetList>
		</div>
	);
}

export default TwitterWidgetSkeleton;
