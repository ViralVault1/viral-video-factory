import { supabase } from '../lib/supabaseClient';

interface UsageLimits {
  images: number;
  productAds: number;
}

const PLAN_LIMITS: Record<string, UsageLimits> = {
  free: { images: 10, productAds: 5 },
  creator: { images: 100, productAds: 999999 },
  pro: { images: 500, productAds: 999999 }
};

export const usageService = {
  async getCurrentUsage(userId: string) {
    const currentMonth = new Date().toISOString().slice(0, 7); // 'YYYY-MM'
    
    const { data, error } = await supabase
      .from('user_usage')
      .select('*')
      .eq('user_id', userId)
      .eq('month', currentMonth)
      .single();

    if (error && error.code !== 'PGRST116') { // PGRST116 = no rows
      throw error;
    }

    return data || { images_generated: 0, product_ads_generated: 0 };
  },

  async checkLimit(userId: string, type: 'images' | 'productAds', userPlan: string = 'free'): Promise<{ allowed: boolean; current: number; limit: number }> {
    const usage = await this.getCurrentUsage(userId);
    const limits = PLAN_LIMITS[userPlan] || PLAN_LIMITS.free;
    
    const current = type === 'images' ? usage.images_generated : usage.product_ads_generated;
    const limit = type === 'images' ? limits.images : limits.productAds;
    
    return {
      allowed: current < limit,
      current,
      limit
    };
  },

  async incrementUsage(userId: string, type: 'images' | 'productAds') {
    const currentMonth = new Date().toISOString().slice(0, 7);
    
    const { data: existing } = await supabase
      .from('user_usage')
      .select('*')
      .eq('user_id', userId)
      .eq('month', currentMonth)
      .single();

    if (existing) {
      const field = type === 'images' ? 'images_generated' : 'product_ads_generated';
      await supabase
        .from('user_usage')
        .update({
          [field]: existing[field] + 1,
          updated_at: new Date().toISOString()
        })
        .eq('id', existing.id);
    } else {
      await supabase
        .from('user_usage')
        .insert({
          user_id: userId,
          month: currentMonth,
          images_generated: type === 'images' ? 1 : 0,
          product_ads_generated: type === 'productAds' ? 1 : 0
        });
    }
  }
};
