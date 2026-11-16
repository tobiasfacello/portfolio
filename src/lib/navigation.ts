import type { createBrowserRouter } from 'react-router-dom';

type AppRouter = ReturnType<typeof createBrowserRouter>;
type NavigateOptions = Parameters<AppRouter['navigate']>[1];

let appRouter: AppRouter | null = null;

// App registers its data router here so leaf components can navigate without
// useNavigate(), which subscribes them to the route context: every work card
// re-rendered on the way to a work page just before unmounting. Only for
// absolute paths — there is no current route to resolve a relative one against.
export function registerRouter(router: AppRouter) {
	appRouter = router;
}

export function navigateTo(to: string, options?: NavigateOptions) {
	void appRouter?.navigate(to, options);
}
