import { lazy, Suspense } from 'react';
import styled from 'styled-components';
import { useTranslation } from 'react-i18next';

//* Components
import Container from './Container';
import Text from '../Text';
import BlogCardSkeleton from '../Skeleton/BlogCardSkeleton';
import { iconRegistry } from '../Icon';

const BlogCard = lazy(() => import('../BlogCard'));

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

const StyledTitleRow = styled.div`
	display: flex;
	width: 100%;
	align-items: center;
	gap: var(--12);
`;

const StyledComingSoon = styled.span`
	display: inline-flex;
	align-items: center;
	gap: var(--4);
	font-family: var(--font-geist-pixel-circle);
	font-size: var(--font-size-caption);
	line-height: 1;
	letter-spacing: 0.06em;
	text-transform: uppercase;
	color: var(--accent);
`;

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
						{t('blog.title')}
					</Text>
					<StyledComingSoon role="status">
						<iconRegistry.toolCase width={12} height={12} aria-hidden="true" focusable="false" />
						{t('blog.comingSoon')}
					</StyledComingSoon>
				</StyledTitleRow>
				<StyledBlogGrid
					$columns={cfg.gridColumns}
					$gap={cfg.gridGap}
					aria-hidden="true"
				>
					{posts.map((post, i) => (
						<Suspense key={post.title} fallback={<BlogCardSkeleton />}>
							<BlogCard
								title={post.title}
								excerpt={post.excerpt}
								thumbnail={blogPlaceholders[i]}
								tags={post.tags}
							/>
						</Suspense>
					))}
				</StyledBlogGrid>
			</Container>
		</StyledBlog>
	);
}
