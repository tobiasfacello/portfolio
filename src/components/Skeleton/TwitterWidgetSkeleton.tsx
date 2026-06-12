import styled from 'styled-components';
import { shimmerSurface } from './shimmer';

const HandlePlaceholder = styled.span`
	display: block;
	width: 96px;
	height: 10px;
	border-radius: 3px;
	${shimmerSurface}
`;

const Card = styled.div`
	display: flex;
	flex-direction: column;
	gap: var(--12);
	padding: var(--8);
	width: 100%;
	flex: 1;
`;

const AuthorRow = styled.div`
	display: flex;
	align-items: center;
	gap: var(--8);
	width: 100%;
`;

const Avatar = styled.span`
	display: block;
	width: 40px;
	height: 40px;
	border-radius: var(--radius-circle);
	flex-shrink: 0;
	${shimmerSurface}
`;

const AuthorInfo = styled.div`
	display: flex;
	flex-direction: column;
	gap: var(--4);
	min-width: 0;
	flex: 1;
`;

const NameLine = styled.span`
	display: block;
	width: 60%;
	height: 10px;
	border-radius: 3px;
	${shimmerSurface}
`;

const HandleLine = styled.span`
	display: block;
	width: 40%;
	height: 8px;
	border-radius: 3px;
	${shimmerSurface}

	&::after {
		animation-delay: 0.08s;
	}
`;

const TextLine = styled.span<{ $delay: number; $w: string }>`
	display: block;
	width: ${({ $w }) => $w};
	height: 9px;
	border-radius: 2px;
	${shimmerSurface}

	&::after {
		animation-delay: ${({ $delay }) => $delay}s;
	}
`;

const TextBlock = styled.div`
	display: flex;
	flex-direction: column;
	gap: var(--6);
	width: 100%;
`;

const MediaBlock = styled.span`
	display: block;
	width: 100%;
	aspect-ratio: 16 / 9;
	border-radius: var(--radius-sm);
	${shimmerSurface}

	&::after {
		animation-delay: 0.16s;
	}
`;

const StatsRow = styled.div`
	display: flex;
	align-items: center;
	gap: var(--16);
	width: 100%;
`;

const StatPlaceholder = styled.span<{ $delay: number }>`
	display: block;
	width: 36px;
	height: 9px;
	border-radius: 2px;
	${shimmerSurface}

	&::after {
		animation-delay: ${({ $delay }) => $delay}s;
	}
`;

const textWidths = ['92%', '78%'];

function TwitterWidgetSkeleton() {
	return (
		<div
			role="status"
			aria-live="polite"
			aria-busy="true"
			aria-label="Cargando tweet destacado"
			style={{ display: 'contents' }}
		>
			<HandlePlaceholder aria-hidden="true" />

			<Card aria-hidden="true">
				<AuthorRow>
					<Avatar />
					<AuthorInfo>
						<NameLine />
						<HandleLine />
					</AuthorInfo>
				</AuthorRow>

				<TextBlock>
					{textWidths.map((w, i) => (
						<TextLine key={i} $w={w} $delay={i * 0.08} />
					))}
				</TextBlock>

				<MediaBlock />

				<StatsRow>
					{[0, 1, 2, 3].map((i) => (
						<StatPlaceholder key={i} $delay={i * 0.04 + 0.2} />
					))}
				</StatsRow>
			</Card>
		</div>
	);
}

export default TwitterWidgetSkeleton;
