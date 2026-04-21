import { lazy, Suspense } from 'react';
import styled from 'styled-components';
import { useTranslation } from 'react-i18next';

//* Components
import Container from './Container';
import Text from '../Text';
import ShinyLabel from '../ShinyLabel';
import BlogCardSkeleton from '../Skeleton/BlogCardSkeleton';

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

export default function Blog() {
	const bp = useBreakpoint();
	const cfg = blogConfig[bp];
	const { t } = useTranslation('home');

	const posts = t('blog.posts', { returnObjects: true }) as Array<{
		title: string;
		excerpt: string;
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
					<ShinyLabel label={t('blog.comingSoon')} icon="toolCase" />
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
								status="in-progress"
							/>
						</Suspense>
					))}
				</StyledBlogGrid>
			</Container>
		</StyledBlog>
	);
}
