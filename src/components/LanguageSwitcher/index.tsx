import { useTranslation } from 'react-i18next';
import { StyledLanguageSwitcher, StyledLangButton } from './styled';

function LanguageSwitcher() {
	const { i18n } = useTranslation();

	const changeLanguage = (lng: string) => {
		i18n.changeLanguage(lng);
		localStorage.setItem('language', lng);
		document.documentElement.lang = lng;
	};

	return (
		<StyledLanguageSwitcher>
			<StyledLangButton
				$active={i18n.language === 'en'}
				onClick={() => changeLanguage('en')}
			>
				EN
			</StyledLangButton>
			<StyledLangButton
				$active={i18n.language === 'es'}
				onClick={() => changeLanguage('es')}
			>
				ES
			</StyledLangButton>
		</StyledLanguageSwitcher>
	);
}

export default LanguageSwitcher;
