export interface WaitlistSubmission {
  recommendedProfile: string;
  preferredBagSize: 'small' | 'medium' | 'large';
  productStyle: 'premixed' | 'booster';
  pricePreference?: string;
  email?: string; // Opt-in email field for future use
}

/**
 * Snake Plant Soil Lab - Waitlist Integration Adapter
 * 
 * CURRENT STATUS: Backend Offline (No database/mailing list integrated)
 * 
 * To activate production waitlist signups:
 * 1. Connect this adapter to a database (e.g. Supabase, Firebase) or email platform API (e.g. Mailchimp, SendGrid, ConvertKit).
 * 2. Set the `isBackendConnected` flag to `true`.
 * 3. Restore the email input form field in the UI components (currently disabled to protect user privacy).
 */
export const isBackendConnected = false;

export interface SubmissionResponse {
  success: boolean;
  message: string;
}

export const submitToWaitlist = async (data: WaitlistSubmission): Promise<SubmissionResponse> => {
  // Console logging is disabled to prevent leaking potential mock values or logs
  // console.log("Waitlist Submission Request:", data);

  if (!isBackendConnected) {
    return {
      success: false,
      message: "Early-access signup is coming soon. Waitlist functionality will be enabled when a mailing list or database integration is connected."
    };
  }

  // Future integration template:
  try {
    // const response = await fetch('/api/waitlist', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify(data)
    // });
    // if (!response.ok) throw new Error("Server error");
    // return { success: true, message: "Welcome to the waitlist!" };
    return { success: true, message: "Registered successfully." };
  } catch (e) {
    return { success: false, message: "Submission failed. Please try again later." };
  }
};
