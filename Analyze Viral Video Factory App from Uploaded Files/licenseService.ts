import { supabase, isSupabaseConfigured } from '../lib/supabaseClient';
import { LicenseKey } from '../types';

/**
 * Generates a random, human-readable license key string.
 */
const generateKeyCode = (): string => {
  const prefix = "VVF";
  const segments = 4;
  const segmentLength = 4;
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; // Avoid ambiguous chars like I, 1, O, 0
  let key = `${prefix}`;

  for (let i = 0; i < segments; i++) {
    let segment = '';
    for (let j = 0; j < segmentLength; j++) {
      segment += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    key += `-${segment}`;
  }
  return key;
};

/**
 * Inserts a new license key into the database.
 * This should only be called from an admin-protected page.
 */
export const createLicenseKey = async (
    description: string,
    durationDays: number,
    planPriceId: string
): Promise<LicenseKey> => {
    if (!isSupabaseConfigured) {
        throw new Error('Supabase is not configured.');
    }
    
    const keyCode = generateKeyCode();

    const { data, error } = await supabase
        .from('license_keys')
        .insert({
            key_code: keyCode,
            description,
            duration_days: durationDays,
            plan_price_id: planPriceId,
        })
        .select()
        .single();
    
    if (error) {
        console.error("Error creating license key:", error);
        throw new Error(`Failed to create license key: ${error.message}`);
    }
    
    return data as LicenseKey;
};

/**
 * Fetches all active (unredeemed) license keys.
 * This should only be called from an admin-protected page.
 */
export const getActiveLicenseKeys = async (): Promise<LicenseKey[]> => {
    if (!isSupabaseConfigured) return [];

    const { data, error } = await supabase
        .from('license_keys')
        .select('*')
        .eq('status', 'active')
        .order('created_at', { ascending: false });

    if (error) {
        console.error("Error fetching active license keys:", error);
        throw new Error(error.message);
    }

    return data as LicenseKey[];
};

/**
 * Calls a Supabase Edge Function to redeem a license key.
 * 
 * IMPORTANT: You must create a Supabase Edge Function named 'redeem-license-key'.
 * This server-side function must handle all the logic securely:
 * 1. Authenticate the user.
 * 2. Validate the provided 'key_code' from the request body.
 * 3. Check if the key exists in the 'license_keys' table and its status is 'active'.
 * 4. If valid, create a new entry in the 'subscriptions' table for the user.
 *    - Set status to 'trialing'.
 *    - Set 'price_id' from the license key.
 *    - Calculate 'current_period_end' based on now() + 'duration_days'.
 * 5. Update the license key's status to 'redeemed' and record the 'redeemed_by_user_id'.
 * 6. Return a success or error message.
 */
export const redeemLicenseKey = async (keyCode: string): Promise<{ success: boolean; message: string }> => {
    if (!isSupabaseConfigured) {
        throw new Error('Supabase is not configured.');
    }

    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
        throw new Error('You must be logged in to redeem a key.');
    }

    try {
        const { data, error } = await supabase.functions.invoke('redeem-license-key', {
            body: { keyCode },
        });

        if (error) {
            throw new Error(error.message || 'An unknown error occurred when redeeming the key.');
        }

        return data;

    } catch (error) {
        console.error('Error invoking redeem-license-key function:', error);
        // This often indicates a CORS or network issue, which `invoke` should handle, but we catch it just in case.
        if (error instanceof Error && error.message.includes('fetch')) {
             throw new Error('Failed to connect to the server. Please check your network connection and ensure the backend function is deployed correctly.');
        }
        // Re-throw the original error if it's not a fetch-related one.
        throw error;
    }
};
