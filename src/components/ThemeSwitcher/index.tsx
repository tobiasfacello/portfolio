//? Hooks
import { useTheme } from '../../hooks/useTheme';

//* Styles
import { StyledToggleGroup, StyledToggleButton } from '../ToggleGroup/styled';

//* Components
import Tooltip from '../Tooltip';

//! Types
import { ThemeMode } from '../../types';

const SunIcon = () => (
	<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
		<circle cx="8" cy="8" r="3" />
		<path d="M8 1.5v1M8 13.5v1M1.5 8h1M13.5 8h1M3.4 3.4l.7.7M11.9 11.9l.7.7M3.4 12.6l.7-.7M11.9 4.1l.7-.7" />
	</svg>
);

const MoonIcon = () => (
	<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
		<path d="M13.5 8.5a5.5 5.5 0 0 1-7.5-7.5 6 6 0 1 0 7.5 7.5Z" />
	</svg>
);

const MonitorIcon = () => (
	<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
		<rect x="2" y="2.5" width="12" height="8" rx="1" />
		<path d="M5.5 13.5h5M8 10.5v3" />
	</svg>
);

const modes: { mode: ThemeMode; Icon: React.FC }[] = [
	{ mode: 'light', Icon: SunIcon },
	{ mode: 'dark', Icon: MoonIcon },
	{ mode: 'system', Icon: MonitorIcon },
];

function ThemeSwitcher() {
	const { themeMode, setThemeMode } = useTheme();

	return (
		<StyledToggleGroup>
			{modes.map(({ mode, Icon }) => (
				<Tooltip key={mode} text={mode.charAt(0).toUpperCase() + mode.slice(1)}>
					<StyledToggleButton
						$active={themeMode === mode}
						$variant="icon"
						onClick={() => setThemeMode(mode)}
						aria-label={`Theme: ${mode}`}
						aria-pressed={themeMode === mode}
					>
						<Icon />
					</StyledToggleButton>
				</Tooltip>
			))}
		</StyledToggleGroup>
	);
}

export default ThemeSwitcher;
