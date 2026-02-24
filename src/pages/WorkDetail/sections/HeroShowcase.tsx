import { useEffect, useMemo } from 'react';
import { StyledSection, StyledHeroShowcase } from '../styled';
import { useScrollReveal } from '../../../hooks/useScrollReveal';
import { useLightbox } from '../../../context/LightboxContext';
import type { LightboxImage } from '../../../types';

interface HeroShowcaseProps {
	src: string;
	alt: string;
}

function HeroShowcase({ src, alt }: HeroShowcaseProps) {
	const revealRef = useScrollReveal<HTMLElement>();
	const { register, open } = useLightbox();

	const heroImages: LightboxImage[] = useMemo(() => [{ src, alt }], [src, alt]);

	useEffect(() => {
		return register(heroImages);
	}, [register, heroImages]);

	const handleKeyDown = (e: React.KeyboardEvent) => {
		if (e.key === 'Enter' || e.key === ' ') {
			e.preventDefault();
			open(src);
		}
	};

	return (
		<StyledSection ref={revealRef} className="reveal-scale">
			<StyledHeroShowcase
				style={{ viewTransitionName: 'work-hero' }}
				onClick={() => open(src)}
				onKeyDown={handleKeyDown}
				role="button"
				tabIndex={0}
				aria-label={`View ${alt} full size`}
			>
				<img src={src} alt={alt} loading="eager" />
			</StyledHeroShowcase>
		</StyledSection>
	);
}

export default HeroShowcase;
