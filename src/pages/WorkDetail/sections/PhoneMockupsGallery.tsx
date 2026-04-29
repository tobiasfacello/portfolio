import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { StyledSection, StyledSectionTitle, StyledPhoneGallery, StyledPhoneCard } from '../styled';
import { useScrollReveal } from '../../../hooks/useScrollReveal';
import { useLightbox } from '../../../context/LightboxContext';

interface MockupImage {
	src: string;
	alt: string;
}

interface PhoneMockupsGalleryProps {
	images: MockupImage[];
}

function PhoneMockupsGallery({ images }: PhoneMockupsGalleryProps) {
	const { t } = useTranslation('workDetail');
	const revealRef = useScrollReveal<HTMLElement>();
	const { register, open } = useLightbox();

	useEffect(() => {
		return register(images);
	}, [register, images]);

	const handleKeyDown = (src: string) => (e: React.KeyboardEvent) => {
		if (e.key === 'Enter' || e.key === ' ') {
			e.preventDefault();
			open(src);
		}
	};

	return (
		<StyledSection ref={revealRef} className="reveal-scale">
			<StyledSectionTitle>{t('sections.mockups')}</StyledSectionTitle>
			<StyledPhoneGallery>
				{images.map((img) => (
					<StyledPhoneCard
						key={img.alt}
						onClick={() => open(img.src)}
						onKeyDown={handleKeyDown(img.src)}
						role="button"
						tabIndex={0}
						aria-label={`View ${img.alt} full size`}
					>
						<img src={img.src} alt={img.alt} loading="lazy" decoding="async" />
					</StyledPhoneCard>
				))}
			</StyledPhoneGallery>
		</StyledSection>
	);
}

export default PhoneMockupsGallery;
