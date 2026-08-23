/**
 * Snake Plant Soil Lab - Provider-Agnostic Analytics Interface
 * 
 * INTEGRATION BOUNDARY:
 * To connect a production analytics provider (like Google Analytics 4, Plausible, Fathom, etc.):
 * 1. Load the provider's tracking script in your index.html.
 * 2. Update the `trackEvent` function below to forward calls to the global tracker object (e.g. `window.gtag('event', name, params)`).
 */

export interface AnalyticsParams {
  stepIndex?: number;
  questionId?: string;
  answerId?: string;
  recommendedProfile?: string;
  productId?: string;
  productName?: string;
  selectionSummary?: string;
  [key: string]: any;
}

export type AnalyticsEvent = 
  | 'soil_check_started'
  | 'soil_check_step_completed'
  | 'soil_check_completed'
  | 'soil_profile_recommended'
  | 'commercial_product_viewed'
  | 'affiliate_link_clicked'
  | 'future_product_interest_started'
  | 'future_product_interest_submitted'
  | 'diy_mix_guide_clicked';

export const trackEvent = (eventName: AnalyticsEvent, params?: AnalyticsParams): void => {
  // In development environments, we log events safely to the console for testing.
  if (process.env.NODE_ENV !== 'production') {
    console.log(`[Development Event]: ${eventName}`, params);
  }

  // Forward to Google Analytics 4 if available
  if (typeof window !== 'undefined' && (window as any).gtag) {
    try {
      (window as any).gtag('event', eventName, params);
    } catch (e) {
      console.warn("Analytics tracking failure:", e);
    }
  }

  // Forward to other custom trackers if needed:
  // if (typeof window !== 'undefined' && (window as any).plausible) {
  //   (window as any).plausible(eventName, { props: params });
  // }
};
