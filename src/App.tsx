//! Router
import { createBrowserRouter, RouterProvider, Outlet, useLocation } from 'react-router-dom';

//! Lenis
import ReactLenis from 'lenis/react';

//* Context
import { ThemeProvider } from './context/ThemeContext';
import { SplashProvider, useSplash } from './context/SplashContext';

//* Components
import ErrorBoundary from './components/ErrorBoundary';
import Home from './pages/Home';
import { RouterErrorPage, NotFoundPage } from './pages/ErrorPage';
import SplashScreen from './components/SplashScreen';

//? Hooks
import { useScrollReset } from './hooks/useScrollReset';

//* Styles
import './App.css';

function ScrollReset() {
	useScrollReset();
	return null;
}

function SplashGuard() {
	const { isSplashActive } = useSplash();
	const location = useLocation();

	if (isSplashActive && location.pathname === '/') {
		return <SplashScreen />;
	}
	return null;
}

function AppShell() {
	const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

	const content = (
		<ThemeProvider>
			<ScrollReset />
			<SplashGuard />
			<Outlet />
		</ThemeProvider>
	);

	return prefersReducedMotion ? (
		content
	) : (
		<ReactLenis options={{ lerp: 0.12, duration: 1.2, smoothWheel: true }} root>
			{content}
		</ReactLenis>
	);
}

const router = createBrowserRouter([
	{
		element: <AppShell />,
		errorElement: <RouterErrorPage />,
		children: [
			{ path: '/', element: <Home /> },
			{
				path: '/work/:slug',
				lazy: async () => {
					const mod = await import('./pages/WorkDetail');
					return { Component: mod.default };
				},
			},
			{
				path: '*',
				element: <NotFoundPage />,
			},
		],
	},
]);

function App() {
	return (
		<ErrorBoundary>
			<SplashProvider>
				<RouterProvider router={router} />
			</SplashProvider>
		</ErrorBoundary>
	);
}

export default App;
