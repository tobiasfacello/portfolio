import { useEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { StyledSection, StyledSectionTitle, StyledDesignSystemFrame } from '../styled';
import { useScrollReveal } from '../../../hooks/useScrollReveal';
import { useLightbox } from '../../../context/LightboxContext';
import type { LightboxImage } from '../../../types';

interface DesignSystemSectionProps {
	src: string;
	alt: string;
}

function DesignSystemSection({ src, alt }: DesignSystemSectionProps) {
	const { t } = useTranslation('workDetail');
	const revealRef = useScrollReveal<HTMLElement>();
	const { register, open } = useLightbox();

	const dsImages: LightboxImage[] = useMemo(() => [{ src, alt }], [src, alt]);

	useEffect(() => {
		return register(dsImages);
	}, [register, dsImages]);

	const handleKeyDown = (e: React.KeyboardEvent) => {
		if (e.key === 'Enter' || e.key === ' ') {
			e.preventDefault();
			open(src);
		}
	};

	return (
		<StyledSection ref={revealRef} className="reveal-scale">
			<StyledSectionTitle>{t('sections.designSystem')}</StyledSectionTitle>
			<StyledDesignSystemFrame
				onClick={() => open(src)}
				onKeyDown={handleKeyDown}
				role="button"
				tabIndex={0}
				aria-label={`View ${alt} full size`}
			>
				<img src={src} alt={alt} loading="lazy" decoding="async" />
			</StyledDesignSystemFrame>
		</StyledSection>
	);
}

export default DesignSystemSection;
