// Predefined license templates for different promotional scenarios
export interface LicenseTemplate {
  id: string;
  name: string;
  description: string;
  category: 'trial' | 'promotion' | 'partnership' | 'seasonal' | 'influencer' | 'enterprise';
  duration: number; // days, -1 for unlimited
  creditsAmount?: number;
  planId?: string;
  suggestedQuantity: number;
  useCase: string;
  keyPrefix?: string;
}

export const licenseTemplates: LicenseTemplate[] = [
  // TRIAL LICENSES
  {
    id: 'free-trial-7',
    name: '7-Day Free Trial',
    description: '7-day access to Pro features',
    category: 'trial',
    duration: 7,
    creditsAmount: 50,
    suggestedQuantity: 100,
    useCase: 'New user onboarding, landing page conversions',
    keyPrefix: 'TRIAL7'
  },
  {
    id: 'free-trial-14',
    name: '14-Day Free Trial',
    description: '14-day access to Pro features',
    category: 'trial',
    duration: 14,
    creditsAmount: 100,
    suggestedQuantity: 50,
    useCase: 'Product demos, webinar attendees',
    keyPrefix: 'TRIAL14'
  },
  {
    id: 'extended-trial-30',
    name: '30-Day Extended Trial',
    description: '30-day access to Pro features',
    category: 'trial',
    duration: 30,
    creditsAmount: 200,
    suggestedQuantity: 25,
    useCase: 'High-value prospects, enterprise evaluations',
    keyPrefix: 'EXTEND30'
  },

  // SEASONAL PROMOTIONS
  {
    id: 'black-friday-50',
    name: 'Black Friday 50% Off',
    description: 'Black Friday 2024 - 50% off Pro Plan for 3 months',
    category: 'seasonal',
    duration: 90,
    creditsAmount: 500,
    suggestedQuantity: 1000,
    useCase: 'Black Friday marketing campaign',
    keyPrefix: 'BF50'
  },
  {
    id: 'cyber-monday-60',
    name: 'Cyber Monday 60% Off',
    description: 'Cyber Monday 2024 - 60% off Enterprise for 2 months',
    category: 'seasonal',
    duration: 60,
    creditsAmount: 1000,
    suggestedQuantity: 500,
    useCase: 'Cyber Monday flash sale',
    keyPrefix: 'CM60'
  },
  {
    id: 'new-year-fresh',
    name: 'New Year Fresh Start',
    description: 'New Year 2025 - Free month of Pro to kickstart content creation',
    category: 'seasonal',
    duration: 31,
    creditsAmount: 300,
    suggestedQuantity: 2000,
    useCase: 'New Year resolution marketing',
    keyPrefix: 'NY2025'
  },
  {
    id: 'summer-creator',
    name: 'Summer Creator Boost',
    description: 'Summer 2024 - Extra credits for vacation content',
    category: 'seasonal',
    duration: 60,
    creditsAmount: 400,
    suggestedQuantity: 750,
    useCase: 'Summer content creation campaign',
    keyPrefix: 'SUMMER'
  },

  // INFLUENCER & PARTNERSHIP
  {
    id: 'influencer-collab',
    name: 'Influencer Collaboration',
    description: 'Complimentary Pro access for content creators',
    category: 'influencer',
    duration: 90,
    creditsAmount: 1000,
    suggestedQuantity: 10,
    useCase: 'Influencer partnerships, sponsored content',
    keyPrefix: 'CREATOR'
  },
  {
    id: 'youtube-sponsor',
    name: 'YouTube Sponsorship',
    description: 'Sponsored access for YouTube video mentions',
    category: 'influencer',
    duration: 30,
    creditsAmount: 500,
    suggestedQuantity: 50,
    useCase: 'YouTube sponsorship deals',
    keyPrefix: 'YOUTUBE'
  },
  {
    id: 'podcast-guest',
    name: 'Podcast Guest Offer',
    description: 'Special offer for podcast listeners',
    category: 'partnership',
    duration: 21,
    creditsAmount: 150,
    suggestedQuantity: 100,
    useCase: 'Podcast guest appearances',
    keyPrefix: 'PODCAST'
  },

  // ENTERPRISE & BULK
  {
    id: 'enterprise-pilot',
    name: 'Enterprise Pilot Program',
    description: '6-month enterprise evaluation license',
    category: 'enterprise',
    duration: 180,
    creditsAmount: 5000,
    suggestedQuantity: 5,
    useCase: 'Large company evaluations',
    keyPrefix: 'PILOT'
  },
  {
    id: 'team-starter',
    name: 'Team Starter Pack',
    description: '30-day team access for small businesses',
    category: 'enterprise',
    duration: 30,
    creditsAmount: 1000,
    suggestedQuantity: 20,
    useCase: 'Small business team trials',
    keyPrefix: 'TEAM'
  },
  {
    id: 'agency-partner',
    name: 'Agency Partner License',
    description: 'Unlimited access for agency partners',
    category: 'partnership',
    duration: -1, // unlimited
    creditsAmount: 10000,
    suggestedQuantity: 3,
    useCase: 'Marketing agency partnerships',
    keyPrefix: 'AGENCY'
  },

  // PROMOTIONAL CAMPAIGNS
  {
    id: 'product-hunt-launch',
    name: 'Product Hunt Launch Special',
    description: 'Product Hunt launch day exclusive offer',
    category: 'promotion',
    duration: 45,
    creditsAmount: 250,
    suggestedQuantity: 500,
    useCase: 'Product Hunt launch campaign',
    keyPrefix: 'PH2024'
  },
  {
    id: 'beta-tester-reward',
    name: 'Beta Tester Reward',
    description: 'Thank you gift for beta testers',
    category: 'promotion',
    duration: 60,
    creditsAmount: 500,
    suggestedQuantity: 100,
    useCase: 'Beta tester appreciation',
    keyPrefix: 'BETA'
  },
  {
    id: 'referral-bonus',
    name: 'Referral Bonus',
    description: 'Bonus for successful referrals',
    category: 'promotion',
    duration: 30,
    creditsAmount: 200,
    suggestedQuantity: 200,
    useCase: 'Referral program rewards',
    keyPrefix: 'REFER'
  },
  {
    id: 'social-media-contest',
    name: 'Social Media Contest Prize',
    description: 'Prize for social media contest winners',
    category: 'promotion',
    duration: 30,
    creditsAmount: 300,
    suggestedQuantity: 50,
    useCase: 'Social media engagement campaigns',
    keyPrefix: 'WINNER'
  },

  // EDUCATIONAL & NON-PROFIT
  {
    id: 'student-discount',
    name: 'Student Discount',
    description: 'Educational discount for students',
    category: 'promotion',
    duration: 120,
    creditsAmount: 400,
    suggestedQuantity: 100,
    useCase: 'Educational institution partnerships',
    keyPrefix: 'STUDENT'
  },
  {
    id: 'nonprofit-support',
    name: 'Non-Profit Support',
    description: 'Complimentary access for non-profit organizations',
    category: 'partnership',
    duration: 365,
    creditsAmount: 2000,
    suggestedQuantity: 10,
    useCase: 'Non-profit organization support',
    keyPrefix: 'NONPROFIT'
  },

  // EVENT-BASED
  {
    id: 'conference-attendee',
    name: 'Conference Attendee Special',
    description: 'Special offer for conference attendees',
    category: 'promotion',
    duration: 30,
    creditsAmount: 200,
    suggestedQuantity: 300,
    useCase: 'Conference booth promotions',
    keyPrefix: 'CONF'
  },
  {
    id: 'webinar-exclusive',
    name: 'Webinar Exclusive Offer',
    description: 'Exclusive offer for webinar attendees',
    category: 'promotion',
    duration: 21,
    creditsAmount: 150,
    suggestedQuantity: 500,
    useCase: 'Webinar lead generation',
    keyPrefix: 'WEBINAR'
  }
];

// Helper functions for license management
export const getLicenseTemplatesByCategory = (category: LicenseTemplate['category']) => {
  return licenseTemplates.filter(template => template.category === category);
};

export const getSeasonalTemplates = () => {
  return getLicenseTemplatesByCategory('seasonal');
};

export const getTrialTemplates = () => {
  return getLicenseTemplatesByCategory('trial');
};

export const getPromotionalTemplates = () => {
  return getLicenseTemplatesByCategory('promotion');
};

export const getInfluencerTemplates = () => {
  return getLicenseTemplatesByCategory('influencer');
};

export const getEnterpriseTemplates = () => {
  return getLicenseTemplatesByCategory('enterprise');
};

// Generate bulk licenses from template
export const generateBulkLicensesFromTemplate = (
  template: LicenseTemplate,
  quantity: number = template.suggestedQuantity
) => {
  const licenses = [];
  for (let i = 0; i < quantity; i++) {
    licenses.push({
      description: `${template.description} (${i + 1}/${quantity})`,
      duration: template.duration,
      creditsAmount: template.creditsAmount,
      planId: template.planId,
      keyPrefix: template.keyPrefix
    });
  }
  return licenses;
};

// Get template by ID
export const getLicenseTemplateById = (id: string): LicenseTemplate | undefined => {
  return licenseTemplates.find(template => template.id === id);
};

// Get current seasonal templates based on date
export const getCurrentSeasonalTemplates = (): LicenseTemplate[] => {
  const now = new Date();
  const month = now.getMonth() + 1; // 1-12
  const day = now.getDate();

  // Black Friday/Cyber Monday (November)
  if (month === 11 && day >= 20) {
    return licenseTemplates.filter(t => 
      t.id.includes('black-friday') || t.id.includes('cyber-monday')
    );
  }

  // New Year (December/January)
  if (month === 12 || (month === 1 && day <= 15)) {
    return licenseTemplates.filter(t => t.id.includes('new-year'));
  }

  // Summer (June-August)
  if (month >= 6 && month <= 8) {
    return licenseTemplates.filter(t => t.id.includes('summer'));
  }

  return [];
};

