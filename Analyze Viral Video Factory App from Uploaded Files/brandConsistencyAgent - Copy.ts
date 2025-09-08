// Brand Consistency Agent - Advanced Brand Management with N8N Integration
import { BaseAIAgent, AgentResponse, UserContext } from './aiAgentsService';
import { Type } from "@google/genai";

export interface BrandAnalysis {
  overallScore: number; // 1-100
  voiceConsistency: VoiceConsistency;
  visualAlignment: VisualAlignment;
  messageAlignment: MessageAlignment;
  audienceResonance: AudienceResonance;
  platformOptimization: PlatformOptimization[];
  improvementRecommendations: ImprovementRecommendation[];
  n8nWorkflowData: N8NWorkflowData;
}

export interface VoiceConsistency {
  score: number; // 1-100
  currentTone: string;
  targetTone: string;
  deviations: VoiceDeviation[];
  corrections: VoiceCorrection[];
  examples: VoiceExample[];
}

export interface VoiceDeviation {
  element: string;
  current: string;
  expected: string;
  severity: 'low' | 'medium' | 'high';
  correction: string;
}

export interface VoiceCorrection {
  original: string;
  corrected: string;
  reasoning: string;
  impact: string;
}

export interface VoiceExample {
  scenario: string;
  goodExample: string;
  badExample: string;
  explanation: string;
}

export interface VisualAlignment {
  score: number;
  colorConsistency: ColorConsistency;
  fontConsistency: FontConsistency;
  logoPlacement: LogoPlacement;
  visualStyle: VisualStyle;
  recommendations: VisualRecommendation[];
}

export interface ColorConsistency {
  primaryColorUsage: number; // percentage
  secondaryColorUsage: number;
  brandColorCompliance: number;
  suggestions: string[];
}

export interface FontConsistency {
  fontUsage: string;
  consistency: number;
  readability: number;
  brandAlignment: number;
}

export interface LogoPlacement {
  visibility: number;
  positioning: string;
  size: string;
  recommendations: string[];
}

export interface VisualStyle {
  styleConsistency: number;
  brandAlignment: number;
  platformOptimization: number;
  improvements: string[];
}

export interface VisualRecommendation {
  element: string;
  current: string;
  recommended: string;
  reasoning: string;
  priority: 'high' | 'medium' | 'low';
}

export interface MessageAlignment {
  score: number;
  valueAlignment: ValueAlignment;
  audienceAlignment: AudienceAlignment;
  goalAlignment: GoalAlignment;
  consistencyMetrics: ConsistencyMetric[];
}

export interface ValueAlignment {
  score: number;
  alignedValues: string[];
  conflictingElements: string[];
  recommendations: string[];
}

export interface AudienceAlignment {
  score: number;
  targetMatch: number;
  languageAppropriate: boolean;
  culturalSensitivity: number;
  adjustments: string[];
}

export interface GoalAlignment {
  score: number;
  goalSupport: string[];
  goalConflicts: string[];
  optimizations: string[];
}

export interface ConsistencyMetric {
  metric: string;
  score: number;
  benchmark: number;
  improvement: string;
}

export interface AudienceResonance {
  score: number;
  demographicMatch: DemographicMatch;
  psychographicMatch: PsychographicMatch;
  engagementPrediction: EngagementPrediction;
  resonanceFactors: ResonanceFactor[];
}

export interface DemographicMatch {
  ageGroup: string;
  location: string;
  interests: string[];
  matchScore: number;
}

export interface PsychographicMatch {
  values: string[];
  lifestyle: string[];
  personality: string[];
  matchScore: number;
}

export interface EngagementPrediction {
  predictedEngagement: number;
  confidenceLevel: number;
  factors: string[];
  optimizations: string[];
}

export interface ResonanceFactor {
  factor: string;
  impact: number;
  optimization: string;
}

export interface PlatformOptimization {
  platform: string;
  currentAlignment: number;
  optimizedVersion: OptimizedContent;
  brandConsistency: number;
  platformSpecificAdjustments: PlatformAdjustment[];
}

export interface OptimizedContent {
  content: string;
  visualElements: string[];
  hashtags: string[];
  postingTime: string;
  brandElements: BrandElement[];
}

export interface PlatformAdjustment {
  element: string;
  adjustment: string;
  reasoning: string;
  brandImpact: string;
}

export interface BrandElement {
  element: string;
  implementation: string;
  visibility: string;
  impact: string;
}

export interface ImprovementRecommendation {
  category: 'voice' | 'visual' | 'message' | 'audience' | 'platform';
  priority: 'critical' | 'high' | 'medium' | 'low';
  recommendation: string;
  implementation: string[];
  expectedImpact: string;
  timeline: string;
  successMetrics: string[];
}

export interface N8NWorkflowData {
  webhookUrl: string;
  workflowTrigger: WorkflowTrigger;
  platformData: PlatformData[];
  brandValidation: BrandValidation;
  postingSchedule: PostingSchedule;
  qualityGates: QualityGate[];
}

export interface WorkflowTrigger {
  triggerType: 'immediate' | 'scheduled' | 'approval_required';
  conditions: TriggerCondition[];
  approvalRequired: boolean;
  brandScoreThreshold: number;
}

export interface TriggerCondition {
  condition: string;
  value: any;
  action: string;
}

export interface PlatformData {
  platform: string;
  content: string;
  hashtags: string[];
  scheduledTime: string;
  brandScore: number;
  optimizations: string[];
  mediaUrls: string[];
}

export interface BrandValidation {
  passed: boolean;
  score: number;
  issues: ValidationIssue[];
  approvals: ValidationApproval[];
}

export interface ValidationIssue {
  severity: 'critical' | 'warning' | 'info';
  issue: string;
  recommendation: string;
  autoFix: boolean;
}

export interface ValidationApproval {
  element: string;
  status: 'approved' | 'needs_review' | 'rejected';
  reasoning: string;
}

export interface PostingSchedule {
  platforms: ScheduledPost[];
  coordination: CoordinationStrategy;
  timing: TimingStrategy;
}

export interface ScheduledPost {
  platform: string;
  scheduledTime: string;
  content: string;
  brandScore: number;
  dependencies: string[];
}

export interface CoordinationStrategy {
  strategy: 'simultaneous' | 'staggered' | 'sequential';
  intervals: number[]; // minutes between posts
  reasoning: string;
}

export interface TimingStrategy {
  primaryPlatform: string;
  optimalTimes: Record<string, string>;
  timezoneConsiderations: string[];
}

export interface QualityGate {
  gate: string;
  threshold: number;
  action: 'proceed' | 'review' | 'block';
  notification: boolean;
}

export class BrandConsistencyAgent extends BaseAIAgent {
  constructor() {
    super('BrandConsistency', 'gemini-pro'); // Premium model for brand analysis
  }

  async process(data: any, context: UserContext): Promise<AgentResponse> {
    const { action } = data;

    try {
      switch (action) {
        case 'analyze-brand-consistency':
          return await this.analyzeBrandConsistency(data.content, data.platforms, context);
        case 'optimize-for-brand':
          return await this.optimizeForBrand(data.content, data.platform, context);
        case 'validate-brand-alignment':
          return await this.validateBrandAlignment(data.content, context);
        case 'prepare-n8n-workflow':
          return await this.prepareN8NWorkflow(data.content, data.platforms, context);
        case 'cross-platform-optimization':
          return await this.crossPlatformOptimization(data.content, data.platforms, context);
        case 'brand-voice-correction':
          return await this.brandVoiceCorrection(data.content, context);
        case 'audience-brand-alignment':
          return await this.audienceBrandAlignment(data.content, data.targetAudience, context);
        default:
          throw new Error(`Unknown action: ${action}`);
      }
    } catch (error) {
      return {
        success: false,
        data: null,
        confidence: 0,
        suggestions: ['Please try again or contact support if the issue persists.']
      };
    }
  }

  private async analyzeBrandConsistency(content: string, platforms: string[], context: UserContext): Promise<AgentResponse> {
    const cacheKey = `brand-analysis-${content.slice(0, 50)}-${platforms.join('-')}`;
    
    const analysis = await this.getCachedOrGenerate(
      cacheKey,
      async () => {
        const prompt = this.buildBrandAnalysisPrompt(content, platforms, context);
        const response = await this.generateWithLLM(prompt, 'gemini-pro', {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              overallScore: { type: Type.NUMBER },
              voiceConsistency: {
                type: Type.OBJECT,
                properties: {
                  score: { type: Type.NUMBER },
                  currentTone: { type: Type.STRING },
                  targetTone: { type: Type.STRING },
                  deviations: {
                    type: Type.ARRAY,
                    items: {
                      type: Type.OBJECT,
                      properties: {
                        element: { type: Type.STRING },
                        current: { type: Type.STRING },
                        expected: { type: Type.STRING },
                        severity: { type: Type.STRING },
                        correction: { type: Type.STRING }
                      }
                    }
                  },
                  corrections: {
                    type: Type.ARRAY,
                    items: {
                      type: Type.OBJECT,
                      properties: {
                        original: { type: Type.STRING },
                        corrected: { type: Type.STRING },
                        reasoning: { type: Type.STRING },
                        impact: { type: Type.STRING }
                      }
                    }
                  }
                }
              },
              platformOptimization: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    platform: { type: Type.STRING },
                    currentAlignment: { type: Type.NUMBER },
                    brandConsistency: { type: Type.NUMBER },
                    optimizedVersion: {
                      type: Type.OBJECT,
                      properties: {
                        content: { type: Type.STRING },
                        visualElements: { type: Type.ARRAY, items: { type: Type.STRING } },
                        hashtags: { type: Type.ARRAY, items: { type: Type.STRING } },
                        postingTime: { type: Type.STRING }
                      }
                    }
                  }
                }
              },
              improvementRecommendations: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    category: { type: Type.STRING },
                    priority: { type: Type.STRING },
                    recommendation: { type: Type.STRING },
                    implementation: { type: Type.ARRAY, items: { type: Type.STRING } },
                    expectedImpact: { type: Type.STRING },
                    timeline: { type: Type.STRING }
                  }
                }
              },
              n8nWorkflowData: {
                type: Type.OBJECT,
                properties: {
                  webhookUrl: { type: Type.STRING },
                  workflowTrigger: {
                    type: Type.OBJECT,
                    properties: {
                      triggerType: { type: Type.STRING },
                      approvalRequired: { type: Type.BOOLEAN },
                      brandScoreThreshold: { type: Type.NUMBER }
                    }
                  },
                  platformData: {
                    type: Type.ARRAY,
                    items: {
                      type: Type.OBJECT,
                      properties: {
                        platform: { type: Type.STRING },
                        content: { type: Type.STRING },
                        hashtags: { type: Type.ARRAY, items: { type: Type.STRING } },
                        scheduledTime: { type: Type.STRING },
                        brandScore: { type: Type.NUMBER }
                      }
                    }
                  }
                }
              }
            },
            required: ["overallScore", "voiceConsistency", "platformOptimization", "improvementRecommendations", "n8nWorkflowData"]
          }
        });

        return JSON.parse(response.text);
      },
      60 * 60 * 1000 // Cache for 1 hour
    );

    // Trigger N8N workflow if brand score is above threshold
    if (analysis.overallScore >= 80 && context.brandKit?.n8nWebhookUrl) {
      await this.triggerN8NWorkflow(analysis.n8nWorkflowData, context.brandKit.n8nWebhookUrl);
    }

    await this.saveAgentData(context.userId, 'brand-analysis', {
      content: content.slice(0, 100),
      platforms,
      analysis,
      timestamp: new Date().toISOString()
    });

    return {
      success: true,
      data: analysis,
      confidence: analysis.overallScore,
      suggestions: analysis.improvementRecommendations?.map((rec: any) => rec.recommendation) || []
    };
  }

  private buildBrandAnalysisPrompt(content: string, platforms: string[], context: UserContext): string {
    const brandKit = context.brandKit;
    
    return `You are the world's leading brand consistency expert and social media strategist. Analyze this content for brand alignment and prepare it for automated multi-platform posting via N8N.

CONTENT TO ANALYZE:
"${content}"

TARGET PLATFORMS: ${platforms.join(', ')}

BRAND GUIDELINES:
${brandKit ? `
- Brand Voice: ${brandKit.voice || 'Professional, engaging, authentic'}
- Brand Tone: ${brandKit.tone || 'Friendly yet authoritative'}
- Brand Values: ${brandKit.values?.join(', ') || 'Innovation, quality, customer-first'}
- Primary Color: ${brandKit.colors?.primary || '#000000'}
- Secondary Color: ${brandKit.colors?.secondary || '#ffffff'}
- Target Audience: ${brandKit.targetAudience || context.profile.targetAudience}
- N8N Webhook: ${brandKit.n8nWebhookUrl ? 'Configured' : 'Not configured'}
` : `
- Brand Voice: ${context.profile.voicePreference}
- Content Style: ${context.profile.contentType}
- Target Audience: ${context.profile.targetAudience}
- Niche: ${context.profile.niche}
`}

USER CONTEXT:
- Content Type: ${context.profile.contentType}
- Historical Performance: ${context.performance.avgViews} avg views
- Best Topics: ${context.performance.bestPerformingTopics.join(', ')}

ANALYSIS REQUIREMENTS:

1. OVERALL BRAND SCORE (1-100):
   - Voice consistency analysis
   - Visual alignment assessment
   - Message alignment evaluation
   - Audience resonance prediction

2. VOICE CONSISTENCY ANALYSIS:
   - Compare current tone vs target brand voice
   - Identify deviations and provide corrections
   - Rate consistency score (1-100)
   - Provide specific voice correction examples

3. PLATFORM OPTIMIZATION:
   For each platform (${platforms.join(', ')}):
   - Adapt content while maintaining brand consistency
   - Optimize for platform-specific requirements
   - Maintain brand voice across adaptations
   - Suggest optimal posting times
   - Include platform-specific hashtags
   - Rate brand consistency for each adaptation

4. IMPROVEMENT RECOMMENDATIONS:
   - Prioritized list of brand consistency improvements
   - Specific implementation steps
   - Expected impact on brand alignment
   - Timeline for implementation
   - Success metrics to track

5. N8N WORKFLOW PREPARATION:
   - Prepare data structure for N8N automation
   - Set brand score thresholds for auto-posting
   - Define approval requirements for low-scoring content
   - Create platform-specific posting schedules
   - Include quality gates and validation rules

ADVANCED BRAND ANALYSIS:
- Psychological brand alignment assessment
- Audience resonance prediction
- Cross-platform brand consistency
- Competitive brand differentiation
- Cultural sensitivity analysis
- Brand evolution recommendations

N8N INTEGRATION REQUIREMENTS:
- Webhook-ready data structure
- Platform-specific content variations
- Automated quality gates
- Brand score thresholds
- Approval workflows for edge cases
- Scheduling coordination across platforms

QUALITY STANDARDS:
- Brand score must be 80+ for auto-posting
- Voice consistency must be 85+ across all platforms
- All recommendations must be actionable
- Platform optimizations must maintain brand integrity
- N8N data must be immediately usable

Generate analysis so comprehensive that it ensures perfect brand consistency across all platforms while maximizing viral potential.`;
  }

  private async optimizeForBrand(content: string, platform: string, context: UserContext): Promise<AgentResponse> {
    const prompt = `Optimize this content for brand consistency on ${platform}:

CONTENT: "${content}"
PLATFORM: ${platform}
BRAND VOICE: ${context.brandKit?.voice || context.profile.voicePreference}
TARGET AUDIENCE: ${context.profile.targetAudience}

Provide:
1. Brand-optimized version
2. Voice consistency improvements
3. Platform-specific brand adaptations
4. Visual brand element suggestions
5. Brand score prediction (1-100)
6. N8N workflow data for automated posting

Maintain viral potential while ensuring perfect brand alignment.`;

    const optimization = await this.generateWithLLM(prompt, 'gemini-pro');

    return {
      success: true,
      data: { optimization: optimization.text },
      confidence: 91,
      suggestions: [
        'Implement brand voice corrections',
        'Add suggested visual brand elements',
        'Test optimized version for engagement'
      ]
    };
  }

  private async validateBrandAlignment(content: string, context: UserContext): Promise<AgentResponse> {
    const prompt = `Validate brand alignment for this content:

CONTENT: "${content}"
BRAND GUIDELINES: ${JSON.stringify(context.brandKit || {})}
USER PROFILE: ${JSON.stringify(context.profile)}

Provide:
1. Brand alignment score (1-100)
2. Specific alignment issues
3. Correction recommendations
4. Approval status for automated posting
5. Quality gate results

Rate each element: voice, values, audience, visual consistency.`;

    const validation = await this.generateWithLLM(prompt, 'gemini-flash');

    return {
      success: true,
      data: { validation: validation.text },
      confidence: 88,
      suggestions: [
        'Address critical alignment issues',
        'Implement recommended corrections',
        'Re-validate after improvements'
      ]
    };
  }

  private async prepareN8NWorkflow(content: string, platforms: string[], context: UserContext): Promise<AgentResponse> {
    const workflowData = {
      content,
      platforms,
      brandKit: context.brandKit,
      userProfile: context.profile,
      timestamp: new Date().toISOString(),
      webhookUrl: context.brandKit?.n8nWebhookUrl || '',
      qualityGates: {
        brandScore: 80,
        voiceConsistency: 85,
        audienceAlignment: 80
      }
    };

    // If webhook URL is configured, trigger the workflow
    if (context.brandKit?.n8nWebhookUrl) {
      await this.triggerN8NWorkflow(workflowData, context.brandKit.n8nWebhookUrl);
    }

    return {
      success: true,
      data: { workflowData },
      confidence: 95,
      suggestions: [
        'N8N workflow prepared and triggered',
        'Monitor automated posting results',
        'Review brand consistency across platforms'
      ]
    };
  }

  private async crossPlatformOptimization(content: string, platforms: string[], context: UserContext): Promise<AgentResponse> {
    const prompt = `Create cross-platform optimizations while maintaining brand consistency:

CONTENT: "${content}"
PLATFORMS: ${platforms.join(', ')}
BRAND VOICE: ${context.brandKit?.voice || 'Professional and engaging'}

For each platform, provide:
1. Platform-optimized content version
2. Brand consistency score
3. Platform-specific brand elements
4. Hashtag strategy
5. Optimal posting time
6. Visual brand recommendations

Ensure perfect brand alignment across all platforms.`;

    const optimization = await this.generateWithLLM(prompt, 'gemini-pro');

    return {
      success: true,
      data: { optimization: optimization.text },
      confidence: 93,
      suggestions: [
        'Use platform-specific optimizations',
        'Maintain brand voice across all versions',
        'Coordinate posting times for maximum impact'
      ]
    };
  }

  private async brandVoiceCorrection(content: string, context: UserContext): Promise<AgentResponse> {
    const prompt = `Correct brand voice inconsistencies in this content:

CONTENT: "${content}"
TARGET BRAND VOICE: ${context.brandKit?.voice || context.profile.voicePreference}
BRAND VALUES: ${context.brandKit?.values?.join(', ') || 'Quality, innovation, customer-first'}

Provide:
1. Voice-corrected version
2. Specific corrections made
3. Reasoning for each change
4. Brand voice consistency score
5. Before/after comparison

Maintain content effectiveness while perfecting brand voice.`;

    const correction = await this.generateWithLLM(prompt, 'gemini-flash');

    return {
      success: true,
      data: { correction: correction.text },
      confidence: 89,
      suggestions: [
        'Apply voice corrections',
        'Review brand voice guidelines',
        'Test corrected version for engagement'
      ]
    };
  }

  private async audienceBrandAlignment(content: string, targetAudience: string, context: UserContext): Promise<AgentResponse> {
    const prompt = `Analyze audience-brand alignment for this content:

CONTENT: "${content}"
TARGET AUDIENCE: ${targetAudience}
BRAND POSITIONING: ${context.brandKit?.voice || 'Professional and engaging'}

Analyze:
1. Audience resonance score
2. Brand message alignment
3. Cultural sensitivity
4. Demographic appropriateness
5. Psychographic match
6. Engagement prediction

Provide optimization recommendations for better audience-brand alignment.`;

    const alignment = await this.generateWithLLM(prompt, 'gemini-flash');

    return {
      success: true,
      data: { alignment: alignment.text },
      confidence: 86,
      suggestions: [
        'Optimize for target audience',
        'Maintain brand authenticity',
        'Test audience response'
      ]
    };
  }

  private async triggerN8NWorkflow(workflowData: any, webhookUrl: string): Promise<void> {
    try {
      const response = await fetch(webhookUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          trigger: 'brand-analysis-complete',
          data: workflowData,
          timestamp: new Date().toISOString(),
          source: 'viral-video-factory-brand-agent'
        })
      });

      if (!response.ok) {
        throw new Error(`N8N webhook failed: ${response.status}`);
      }

      console.log('N8N workflow triggered successfully');
    } catch (error) {
      console.error('Failed to trigger N8N workflow:', error);
      // Don't throw error - this shouldn't break the main flow
    }
  }
}

export default BrandConsistencyAgent;

