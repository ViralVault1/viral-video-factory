import { supabase } from '../lib/supabaseClient';

export interface LicenseKey {
  id: string;
  key_code: string;
  description: string;
  duration_days: number;
  plan_price_id: string;
  status: string;
  redeemed_by_user_id?: string;
  redeemed_at?: string;
  expires_at?: string;
  created_at: string;
}

export const redeemLicenseKey = async (keyCode: string): Promise<{ success: boolean; message: string }> => {
  try {
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session) {
      throw new Error('You must be logged in to redeem a key.');
    }

    const { data, error } = await supabase.functions.invoke('redeem-license-key', {
      body: { keyCode },
    });

    if (error) {
      throw new Error(error.message || 'Failed to redeem license key');
    }

    return data;

  } catch (error: any) {
    throw new Error(error.message || 'Failed to redeem license key');
  }
};

export const createLicenseKey = async (
  description: string,
  durationDays: number,
  planPriceId: string
): Promise<LicenseKey> => {
  const generateKeyCode = (): string => {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
    let key = 'VVF';
    for (let i = 0; i < 4; i++) {
      let segment = '';
      for (let j = 0; j < 4; j++) {
        segment += chars.charAt(Math.floor(Math.random() * chars.length));
      }
      key += `-${segment}`;
    }
    return key;
  };

  const keyCode = generateKeyCode();

  const { data, error } = await supabase
    .from('license_keys')
    .insert({
      key_code: keyCode,
      description,
      duration_days: durationDays,
      plan_price_id: planPriceId,
      status: 'active',
    })
    .select()
    .single();

  if (error) {
    throw new Error(`Failed to create license key: ${error.message}`);
  }

  return data as LicenseKey;
};

export const getActiveLicenseKeys = async (): Promise<LicenseKey[]> => {
  const { data, error } = await supabase
    .from('license_keys')
    .select('*')
    .eq('status', 'active')
    .order('created_at', { ascending: false });

  if (error) {
    throw new Error(error.message);
  }

  return data as LicenseKey[];
};
