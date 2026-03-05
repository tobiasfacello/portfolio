import styled from 'styled-components';
import { useTranslation } from 'react-i18next';

//* Components
import Container from './Container';
import Text from '../Text';
import BlogCard from '../BlogCard';

//? Hooks & Config
import { useBreakpoint, isMobile } from '../../hooks/useBreakpoint';
import { blogConfig } from '../../config/responsive';

//* Styles
import { sectionBase } from '../../styles/mixins';

//? Types
import type { BlogCardLayout } from '../../types';

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

const CARD_LAYOUTS: BlogCardLayout[] = ['horizontal', 'vertical', 'horizontal-reverse'];

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
				<Text as="h2" variant="subtitle-sm" style={isMobile(bp) ? { alignSelf: 'flex-start' } : undefined}>
					{t('blog.title')}
				</Text>
				<StyledBlogGrid $columns={cfg.gridColumns} $gap={cfg.gridGap}>
					{posts.map((post, i) => (
						<BlogCard
							key={i}
							title={post.title}
							excerpt={post.excerpt}
							thumbnail={blogPlaceholders[i]}
							layout={CARD_LAYOUTS[i]}
						/>
					))}
				</StyledBlogGrid>
			</Container>
		</StyledBlog>
	);
}
