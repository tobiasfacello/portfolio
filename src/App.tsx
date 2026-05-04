//! React
import { Suspense } from 'react';

//! Router
import { createBrowserRouter, RouterProvider, Outlet } from 'react-router-dom';

//! Lenis
import ReactLenis from 'lenis/react';

//* Context
import { ThemeProvider } from './context/ThemeContext';
import { BreakpointProvider } from './context/BreakpointContext';

//* Components
import ErrorBoundary from './components/ErrorBoundary';
import Home from './pages/Home';
import { RouterErrorPage, NotFoundPage } from './pages/ErrorPage';

//? Hooks
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
			<RouterProvider router={router} />
		</ErrorBoundary>
	);
}

export default App;
