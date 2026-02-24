import { useParams, Navigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { getWorkBySlug, hasDetailPage } from '../../data/works';
import { workImages } from '../../data/workImages';
import { StyledWorkDetail, StyledDetailContent } from './styled';

//? Context
import { LightboxProvider } from '../../context/LightboxContext';

//* Components
import Lightbox from '../../components/Lightbox';

//* Sections
import DetailHeader from './sections/DetailHeader';
import HeroShowcase from './sections/HeroShowcase';
import ProjectOverview from './sections/ProjectOverview';
import DesignSystemSection from './sections/DesignSystemSection';
import ProcessSection from './sections/ProcessSection';
import PhoneMockupsGallery from './sections/PhoneMockupsGallery';
import LinkPreview from './sections/LinkPreview';
import DetailFooter from './sections/DetailFooter';

function WorkDetail() {
	const { slug } = useParams<{ slug: string }>();
	const { t } = useTranslation('workDetail');

	const work = slug ? getWorkBySlug(slug) : undefined;

	if (!work || !hasDetailPage(work)) {
		return <Navigate to="/" replace />;
	}

	const workTitle = t(`${slug}.title`, { ns: 'works' });
	const overview = t(`${slug}.overview`) as string;
	const publishedDate = t(`${slug}.publishedDate`) as string;
	const outcome = t(`${slug}.outcome`) as string;
	const livePreviewUrl = t(`${slug}.livePreviewUrl`) as string;
	const livePreviewDescription = t(`${slug}.livePreviewDescription`) as string;
	const collaborators = t(`${slug}.collaborators`, { returnObjects: true }) as string[];
	const roles = t(`${slug}.roles`, { returnObjects: true }) as string[];
	const tags = t(`${slug}.tags`, { returnObjects: true, defaultValue: [] }) as string[];
	const tools = t(`${slug}.tools`, { returnObjects: true }) as string[];
	const process = t(`${slug}.process`, { returnObjects: true }) as Record<string, { title: string; content: string }>;

	const images = slug ? workImages[slug] : undefined;

	return (
		<LightboxProvider>
		<StyledWorkDetail>
			<StyledDetailContent>
				<DetailHeader
					title={workTitle}
					roles={roles}
					tags={tags}
					publishedDate={publishedDate}
					outcome={outcome}
				/>
				{images && (
					<HeroShowcase src={images.hero} alt={`${workTitle} showcase`} />
				)}
				<ProjectOverview overview={overview} />
				{images && (
					<DesignSystemSection
						src={images.designSystem}
						alt={`${workTitle} design system`}
					/>
				)}
				<ProcessSection process={process} />
				{images && images.phoneMockups.length > 0 && (
					<PhoneMockupsGallery images={images.phoneMockups} />
				)}
				<LinkPreview
					title={workTitle}
					description={livePreviewDescription}
					url={livePreviewUrl}
					thumbnail={images?.thumbnail}
				/>
				<DetailFooter
					tools={tools}
					publishedDate={publishedDate}
					outcome={outcome}
					collaborators={collaborators}
				/>
			</StyledDetailContent>
		</StyledWorkDetail>
		<Lightbox />
		</LightboxProvider>
	);
}

export default WorkDetail;
