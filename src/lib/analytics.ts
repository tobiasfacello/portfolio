import { track } from '@vercel/analytics';

//? Types
import { AnalyticsEvent } from '../types';

export function trackEvent(event: AnalyticsEvent): void {
	if ('data' in event) {
		track(event.name, event.data);
		return;
	}

	track(event.name);
}
