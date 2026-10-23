//? Types
import { AnalyticsEvent } from '../types';

// Events only fire on user interaction, so the analytics client is loaded on
// first use instead of shipping in the entry chunk. Same module as the lazily
// rendered <Analytics /> in App, so it's one shared chunk.
export function trackEvent(event: AnalyticsEvent): void {
	void import('@vercel/analytics/react').then(({ track }) => {
		if ('data' in event) {
			track(event.name, event.data);
			return;
		}

		track(event.name);
	});
}
