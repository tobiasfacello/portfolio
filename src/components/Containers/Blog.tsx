import styled from 'styled-components';
import { useTranslation } from 'react-i18next';

//* Components
import Container from './Container';
import Text from '../Text';
import BlogCard from '../BlogCard';
import { iconRegistry } from '../Icon';

//? Hooks & Config
import { useBreakpoint, isMobile } from '../../hooks/useBreakpoint';
import { blogConfig } from '../../config/responsive';

//* Styles
import { sectionBase } from '../../styles/mixins';

//? Data
import { blogPlaceholders } from '../../data/blogPlaceholders';

const StyledBlog = styled.section`
	${sectionBase('blog')}
	justify-content: space-between;
	padding: var(--20) var(--12);
`;

const StyledBlogGrid = styled.div<{ $columns: number; $gap: string }>`
	width: 100%;
	display: grid;
	grid-template-columns: repeat(${(props) => props.$columns}, 1fr);
	gap: ${(props) => props.$gap};
`;

const StyledComingSoonOverlay = styled.div`
	position: absolute;
	inset: 0;
	z-index: 2;
	display: flex;
	align-items: center;
	justify-content: center;
	background: linear-gradient(
		to bottom,
		transparent 0%,
		color-mix(in srgb, var(--overlay-solid) 70%, transparent) 55%
	);
	backdrop-filter: blur(var(--blur-sm));
	-webkit-backdrop-filter: blur(var(--blur-sm));
	border-radius: inherit;
	user-select: none;
	pointer-events: none;
	gap: var(--8);
`;

const MOBILE_TITLE_STYLE = { alignSelf: 'flex-start' } as const;

export default function Blog() {
	const bp = useBreakpoint();
	const cfg = blogConfig[bp];
	const { t } = useTranslation('home');

	const posts = t('blog.posts', { returnObjects: true }) as Array<{
		title: string;
		excerpt: string;
		tags: string[];
	}>;

	return (
		<StyledBlog>
			<StyledComingSoonOverlay>
				<iconRegistry.toolCase width={32} height={32} />
				<Text as="span" variant="title">
					{t('blog.comingSoon')}
				</Text>
			</StyledComingSoonOverlay>
			<Container
				w={cfg.outerW}
				maxW={cfg.outerMaxW}
				direction="column"
				justify="space-between"
				align={isMobile(bp) ? 'center' : 'start'}
				gap={cfg.outerGap}
			>
				<Text as="h2" variant="subtitle-sm" style={isMobile(bp) ? MOBILE_TITLE_STYLE : undefined}>
					{t('blog.title')}
				</Text>
				<StyledBlogGrid $columns={cfg.gridColumns} $gap={cfg.gridGap}>
					{posts.map((post, i) => (
						<BlogCard
							key={post.title}
							title={post.title}
							excerpt={post.excerpt}
							thumbnail={blogPlaceholders[i]}
							tags={post.tags}
						/>
					))}
				</StyledBlogGrid>
			</Container>
		</StyledBlog>
	);
}
