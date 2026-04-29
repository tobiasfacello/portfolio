//? MOLDE
import moldeMacbook from '../assets/works/detail/molde/mockup-macbook.webp';
import moldeDesignSystem from '../assets/works/detail/molde/design-system.webp';
import moldeMockupPhone1 from '../assets/works/detail/molde/mockup-phone-1.webp';
import moldeMockupPhone2 from '../assets/works/detail/molde/mockup-phone-2.webp';

//? INDALO
import indaloMacbook from '../assets/works/detail/indalo/mockup-macbook.webp';
import indaloDesignSystem from '../assets/works/detail/indalo/design-system.webp';
import indaloMockupPhone1 from '../assets/works/detail/indalo/mockup-phone-1.webp';
import indaloMockupPhone2 from '../assets/works/detail/indalo/mockup-phone-2.webp';

//? RANCHO
import ranchoMacbook from '../assets/works/detail/rancho/mockup-macbook.webp';
import ranchoFinalDesign from '../assets/works/detail/rancho/final-design.webp';
import ranchoMockupPhone1 from '../assets/works/detail/rancho/mockup-phone-1.webp';
import ranchoMockupPhone2 from '../assets/works/detail/rancho/mockup-phone-2.webp';
import ranchoMockupPhone3 from '../assets/works/detail/rancho/mockup-phone-3.webp';

export interface WorkImages {
	hero: string;
	designSystem: string;
	phoneMockups: { src: string; alt: string }[];
	thumbnail?: string;
}

export const workImages: Record<string, WorkImages> = {
	molde: {
		hero: moldeMacbook,
		designSystem: moldeDesignSystem,
		phoneMockups: [
			{ src: moldeMockupPhone1, alt: 'Molde mobile mockup' },
			{ src: moldeMockupPhone2, alt: 'Molde mobile mockup 2' },
		],
		thumbnail: moldeMacbook,
	},
	indalo: {
		hero: indaloMacbook,
		designSystem: indaloDesignSystem,
		phoneMockups: [
			{ src: indaloMockupPhone1, alt: 'Indalo mobile mockup' },
			{ src: indaloMockupPhone2, alt: 'Indalo mobile mockup 2' },
		],
		thumbnail: indaloMacbook,
	},
	rancho: {
		hero: ranchoMacbook,
		designSystem: ranchoFinalDesign,
		phoneMockups: [
			{ src: ranchoMockupPhone1, alt: 'El Rancho mobile mockup' },
			{ src: ranchoMockupPhone2, alt: 'El Rancho mobile mockup 2' },
			{ src: ranchoMockupPhone3, alt: 'El Rancho mobile mockup 3' },
		],
		thumbnail: ranchoMacbook,
	},
};
