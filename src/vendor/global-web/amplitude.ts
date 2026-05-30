import * as amplitude from '@amplitude/analytics-browser';
import { env } from '@saga/config-web';
import { logger } from '@saga/logger-middleware';

amplitude.init(env.VITE_AMPLITUDE_API_KEY ?? '');

export const useTrackEvent = () => {
  const trackEvent = (
    eventName: string,
    userName: string,
    eventProperties: Record<string, string> = {},
  ) => {
    logger.debug(`Tracking event: ${eventName} for user: ${userName}`);

    amplitude.track({
      event_type: eventName,
      user_id: userName,
      event_properties: eventProperties,
    });
  };

  return { trackEvent };
};
