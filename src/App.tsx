//! React
import { Suspense } from 'react';

//! Router
import { createBrowserRouter, RouterProvider, Outlet } from 'react-router-dom';

//! Lenis
import ReactLenis from 'lenis/react';

//! Analytics
import { Analytics } from '@vercel/analytics/react';
import { SpeedInsights } from '@vercel/speed-insights/react';

//* Context
import { ThemeProvider } from './context/ThemeContext';
import { BreakpointProvider } from './context/BreakpointContext';

//* Components
import ErrorBoundary from './components/ErrorBoundary';
import Home from './pages/Home';
import { RouterErrorPage, NotFoundPage } from './pages/ErrorPage';

//? Hooks & i18n
import { loadWorkDetailNamespace } from './i18n';
import { useScrollReset } from './hooks/useScrollReset';
import { usePrefersReducedMotion } from './hooks/usePrefersReducedMotion';

//* Styles
import './App.css';

const LENIS_OPTIONS = { lerp: 0.12, duration: 1.2, smoothWheel: true } as const;

function ScrollReset() {
	useScrollReset();
	return null;
}

function AppShell() {
	const prefersReducedMotion = usePrefersReducedMotion();

	const content = (
		<BreakpointProvider>
			<ThemeProvider>
				<ScrollReset />
				<Suspense fallback={null}>
					<Outlet />
				</Suspense>
			</ThemeProvider>
		</BreakpointProvider>
	);

	return prefersReducedMotion ? (
		content
	) : (
		<ReactLenis options={LENIS_OPTIONS} root>
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
					// Fetch the page chunk and its translations in parallel instead
					// of chaining the namespace request after the page mounts.
					const [mod] = await Promise.all([
						import('./pages/WorkDetail'),
						loadWorkDetailNamespace(),
					]);
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
			<RouterProvider router={router} />
			<Analytics />
			<SpeedInsights />
		</ErrorBoundary>
	);
}

export default App;
