import { useTranslation } from 'react-i18next';
import { StyledToggleGroup, StyledToggleButton } from '../ToggleGroup/styled';

function LanguageSwitcher() {
	const { i18n } = useTranslation();

	const changeLanguage = (lng: string) => {
		i18n.changeLanguage(lng);
		localStorage.setItem('language', lng);
		document.documentElement.lang = lng;
	};

	return (
		<StyledToggleGroup role="radiogroup" aria-label="Language">
			<StyledToggleButton
				role="radio"
				$active={i18n.language === 'en'}
				$variant="text"
				onClick={() => changeLanguage('en')}
				aria-label="Switch to English"
				aria-checked={i18n.language === 'en'}
			>
				EN
			</StyledToggleButton>
			<StyledToggleButton
				role="radio"
				$active={i18n.language === 'es'}
				$variant="text"
				onClick={() => changeLanguage('es')}
				aria-label="Cambiar a español"
				aria-checked={i18n.language === 'es'}
			>
				ES
			</StyledToggleButton>
			<StyledToggleButton
				role="radio"
				$active={i18n.language === 'pt'}
				$variant="text"
				onClick={() => changeLanguage('pt')}
				aria-label="Mudar para português"
				aria-checked={i18n.language === 'pt'}
			>
				PT
			</StyledToggleButton>
		</StyledToggleGroup>
	);
}

export default LanguageSwitcher;
