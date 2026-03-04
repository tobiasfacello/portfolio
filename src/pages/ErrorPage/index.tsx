//! React Core
import { useCallback } from 'react';

//! Router
import { useNavigate, useRouteError, isRouteErrorResponse } from 'react-router-dom';

//! Styled Components
import styled from 'styled-components';
import { mq } from '../../config/breakpoints';
import { interactiveHover } from '../../styles/mixins';

const asciiLines = [
	'██╗  ██╗ ██████╗ ██╗  ██╗',
	'██║  ██║██╔═══██╗██║  ██║',
	'███████║██║   ██║███████║',
	'╚════██║██║   ██║╚════██║',
	'     ██║╚██████╔╝     ██║',
	'     ╚═╝ ╚═════╝      ╚═╝',
];

const asciiOpacities = [1, 0.9, 0.75, 0.6, 0.45, 0.3];

//* Styled Components

const PageWrapper = styled.div`
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	min-height: 100vh;
	min-height: 100dvh;
	width: 100%;
	padding: var(--24);
	background-color: var(--background);
	gap: var(--36);
`;

const AsciiContainer = styled.pre`
	width: 100%;
	padding: 0;
	margin: 0;
	font-family: 'Courier New', Courier, monospace;
	font-weight: normal;
	line-height: 1.15;
	text-align: center;
	overflow: hidden;
	font-size: 8px;

	${mq.up(425)} {
		font-size: 11px;
	}

	${mq.up('mobile-lg')} {
		font-size: 18px;
	}

	${mq.up('tablet')} {
		font-size: 22px;
	}

	${mq.up('desktop-sm')} {
		font-size: 28px;
	}

	${mq.up('desktop-lg')} {
		font-size: 32px;
	}

	${mq.up(1800)} {
		font-size: 38px;
	}
`;

const AsciiLine = styled.span`
	display: block;
	white-space: pre;
	color: var(--primary);
`;

const Message = styled.p`
	font-family: var(--font-geist-pixel-circle);
	font-size: var(--font-size-subtitle-sm);
	line-height: var(--line-height-subtitle-sm);
	font-weight: 500;
	color: var(--text);
	text-align: center;
	opacity: 0.8;

	${mq.up('mobile-lg')} {
		font-size: var(--font-size-subtitle);
		line-height: var(--line-height-subtitle);
	}
`;

const HomeButton = styled.a`
	display: flex;
	justify-content: center;
	align-items: center;
	height: 36px;
	padding: var(--8) var(--24);
	background-color: transparent;
	border: 1px solid var(--text);
	border-radius: var(--radius-md);
	text-decoration: none;
	cursor: pointer;

	font-family: var(--font-geist-pixel-circle);
	font-size: var(--font-size-label);
	line-height: var(--line-height-label);
	font-weight: 500;
	color: var(--text);

	${interactiveHover}

	&:hover {
		color: var(--pill-text-hovered);
	}
`;

//* Shared Layout

function ErrorLayout({ message, onGoHome }: { message: string; onGoHome: (e: React.MouseEvent) => void }) {
	return (
		<PageWrapper>
			<AsciiContainer aria-label="404" role="img">
				{asciiLines.map((line, i) => (
					<AsciiLine key={i} style={{ opacity: asciiOpacities[i] }}>
						{line}
					</AsciiLine>
				))}
			</AsciiContainer>

			<Message>{message}</Message>

			<HomeButton href="/" onClick={onGoHome}>
				Volver al inicio
			</HomeButton>
		</PageWrapper>
	);
}

//? Types

interface ErrorPageProps {
	onReset?: () => void;
}

function useGoHome() {
	const navigate = useNavigate();
	return useCallback(
		(e: React.MouseEvent) => {
			e.preventDefault();
			navigate('/');
		},
		[navigate]
	);
}

/**
 * RouterErrorPage -- used as `errorElement` in the router config.
 * Has access to useNavigate and useRouteError hooks.
 */
function RouterErrorPage() {
	const routeError = useRouteError();
	const handleGoHome = useGoHome();

	const is404 = isRouteErrorResponse(routeError) && routeError.status === 404;
	const message = is404 ? 'Pagina no encontrada :(' : 'Algo salio mal :(';

	return <ErrorLayout message={message} onGoHome={handleGoHome} />;
}

/**
 * NotFoundPage -- used as the wildcard `path: '*'` route element.
 * Has router context (useNavigate) but no route error.
 */
function NotFoundPage() {
	const handleGoHome = useGoHome();

	return <ErrorLayout message="Pagina no encontrada :(" onGoHome={handleGoHome} />;
}

/**
 * ErrorPage -- used by ErrorBoundary (outside router context).
 * Falls back to window.location for navigation.
 */
function ErrorPage({ onReset }: ErrorPageProps) {
	const handleGoHome = useCallback(
		(e: React.MouseEvent) => {
			e.preventDefault();
			if (onReset) onReset();
			window.location.href = '/';
		},
		[onReset]
	);

	return <ErrorLayout message="Algo salio mal :(" onGoHome={handleGoHome} />;
}

export { RouterErrorPage, NotFoundPage };
export default ErrorPage;
