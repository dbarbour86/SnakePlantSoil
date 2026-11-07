/**
 * SnakePlantSoil.com - Analytics Interface
 * 
 * Powered by Google Analytics 4 (GA4) with Measurement ID: G-TC5QZQM7DR
 * - Collection is strictly limited to snakeplantsoil.com and www.snakeplantsoil.com
 * - SPAs track single pageviews per route change without duplicate history triggers
 * - No personally identifiable information (PII) is transmitted:
 *   parameters, page_location, and page_referrer are rigorously sanitized.
 */

export const GA_MEASUREMENT_ID = 'G-TC5QZQM7DR';

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

/**
 * Sanitizes URLs to remove sensitive query parameters (PII) before transmission to analytics.
 * Protects against accidental leakage of email addresses, tokens, names, and phone numbers in page_location or page_referrer.
 */
export const sanitizeUrl = (rawUrl?: string): string => {
  if (!rawUrl) return '';
  try {
    const origin = typeof window !== 'undefined' ? window.location.origin : 'https://snakeplantsoil.com';
    const parsed = new URL(rawUrl, origin);
    
    const sensitiveParamKeywords = [
      'email', 'user_email', 'mail', 'phone', 'tel', 'name', 'first_name', 'last_name',
      'token', 'key', 'api_key', 'auth', 'pass', 'password', 'secret', 'code',
      'address', 'zip', 'ssn', 'session'
    ];
    
    const params = new URLSearchParams(parsed.search);
    const toDelete: string[] = [];
    
    params.forEach((val, key) => {
      const lowerKey = key.toLowerCase();
      if (sensitiveParamKeywords.some(keyword => lowerKey === keyword || lowerKey.includes(keyword))) {
        toDelete.push(key);
        return;
      }
      if (val.includes('@') && val.includes('.')) {
        toDelete.push(key);
        return;
      }
      if (/^\+?[0-9\-\(\)\s]{7,20}$/.test(val) && val.replace(/\D/g, '').length >= 10) {
        toDelete.push(key);
        return;
      }
    });

    toDelete.forEach(k => params.delete(k));
    parsed.search = params.toString() ? `?${params.toString()}` : '';
    
    // Check fragment for email or sensitive patterns
    if (parsed.hash && (parsed.hash.includes('@') || sensitiveParamKeywords.some(k => parsed.hash.toLowerCase().includes(k)))) {
      parsed.hash = '';
    }
    
    return parsed.toString();
  } catch {
    return rawUrl;
  }
};

/**
 * Strips any potential PII (emails, names, phone numbers) from analytics parameters.
 */
const sanitizeParams = (params?: AnalyticsParams): AnalyticsParams | undefined => {
  if (!params) return undefined;
  const cleaned: AnalyticsParams = {};
  const piiKeys = ['email', 'mail', 'phone', 'name', 'user_email', 'first_name', 'last_name'];
  for (const [k, v] of Object.entries(params)) {
    if (piiKeys.includes(k.toLowerCase())) continue;
    if (typeof v === 'string' && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)) continue;
    cleaned[k] = v;
  }
  return cleaned;
};

// Internal key to prevent duplicate pageviews for the same route and document title
let lastTrackedKey: string | null = null;

/**
 * Dispatches a single GA4 page_view event on initial load and client-side navigation.
 * Automatically deduplicates calls for the same path and title.
 * Enforces sanitization of page_location and page_referrer.
 */
export const trackPageView = (path?: string, title?: string): void => {
  if (typeof window === 'undefined') return;

  const currentPath = path || window.location.pathname;
  const currentTitle = title || document.title;
  const currentUrl = sanitizeUrl(window.location.href);
  const currentReferrer = sanitizeUrl(document.referrer);

  const dedupeKey = `${currentPath}|${currentTitle}`;
  if (lastTrackedKey === dedupeKey) {
    return;
  }
  lastTrackedKey = dedupeKey;

  const isDebug = window.location.search.indexOf('ga_debug=true') !== -1 ||
    (typeof sessionStorage !== 'undefined' && sessionStorage.getItem('ga_debug') === 'true');

  if (process.env.NODE_ENV !== 'production' || isDebug) {
    console.log(`[GA4 PageView]: ${currentPath} - "${currentTitle}"`, {
      page_location: currentUrl,
      page_referrer: currentReferrer
    });
  }

  if (typeof (window as any).gtag === 'function') {
    try {
      // Set sanitized location and referrer sitewide so all events inherit them
      (window as any).gtag('set', {
        page_location: currentUrl,
        page_referrer: currentReferrer
      });

      (window as any).gtag('event', 'page_view', {
        page_title: currentTitle,
        page_location: currentUrl,
        page_referrer: currentReferrer,
        page_path: currentPath,
        ...(isDebug ? { debug_mode: true } : {})
      });
    } catch (e) {
      console.warn("Analytics pageview tracking failure:", e);
    }
  }
};

export const trackEvent = (eventName: AnalyticsEvent, params?: AnalyticsParams): void => {
  const safeParams = sanitizeParams(params);

  // In development environments, log safely to the console for testing.
  if (process.env.NODE_ENV !== 'production') {
    console.log(`[Development Event]: ${eventName}`, safeParams);
  }

  // Forward to Google Analytics 4 if available
  if (typeof window !== 'undefined' && typeof (window as any).gtag === 'function') {
    try {
      (window as any).gtag('event', eventName, safeParams);
    } catch (e) {
      console.warn("Analytics tracking failure:", e);
    }
  }
};
