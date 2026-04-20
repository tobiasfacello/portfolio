import { useRef, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { StyledToggleGroup, StyledToggleButton } from '../ToggleGroup/styled';

const languages = [
	{ code: 'en', label: 'Switch to English', text: 'EN' },
	{ code: 'es', label: 'Cambiar a español', text: 'ES' },
	{ code: 'pt', label: 'Mudar para português', text: 'PT' },
] as const;

function LanguageSwitcher() {
	const { i18n } = useTranslation();
	const buttonsRef = useRef<(HTMLButtonElement | null)[]>([]);

	const changeLanguage = (lng: string) => {
		i18n.changeLanguage(lng);
		localStorage.setItem('language', lng);
		document.documentElement.lang = lng;
	};

	const handleKeyDown = useCallback(
		(e: React.KeyboardEvent, index: number) => {
			let nextIndex: number | null = null;

			if (e.key === 'ArrowRight') {
				nextIndex = (index + 1) % languages.length;
			} else if (e.key === 'ArrowLeft') {
				nextIndex = (index - 1 + languages.length) % languages.length;
			}

			if (nextIndex !== null) {
				e.preventDefault();
				buttonsRef.current[nextIndex]?.focus();
				changeLanguage(languages[nextIndex].code);
			}
		},
		[changeLanguage],
	);

	return (
		<StyledToggleGroup role="radiogroup" aria-label="Language">
			{languages.map(({ code, label, text }, index) => (
				<StyledToggleButton
					key={code}
					ref={(el) => { buttonsRef.current[index] = el; }}
					role="radio"
					$active={i18n.language === code}
					$variant="text"
					onClick={() => changeLanguage(code)}
					onKeyDown={(e) => handleKeyDown(e, index)}
					tabIndex={i18n.language === code ? 0 : -1}
					aria-label={label}
					aria-checked={i18n.language === code}
				>
					{text}
				</StyledToggleButton>
			))}
		</StyledToggleGroup>
	);
}

export default LanguageSwitcher;
