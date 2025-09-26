import React, { useState } from 'react';
import { FileText, Trash2, Download, Copy, Eye, Clock, CheckCircle, AlertCircle, X, Plus } from 'lucide-react';
import { toast } from 'react-hot-toast';

// Import LLM services
import llmRouter from '../services/llmRouter';

// Define TaskType properly
const TaskType = { 
  SCRIPT_WRITING: 'script_writing',
  CONTENT_GENERATION: 'content_generation',
  ARTICLE_WRITING: 'article_writing'
};

const AutoWriterPage = () => {
  const [topic, setTopic] = useState('');
  const [customTitles, setCustomTitles] = useState('');
  const [articleQueue, setArticleQueue] = useState([]);
  const [generatedArticles, setGeneratedArticles] = useState([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isGeneratingArticles, setIsGeneratingArticles] = useState(false);
  const [selectedArticle, setSelectedArticle] = useState(null);
  const [selectedNiches, setSelectedNiches] = useState(['Food & Cooking']);
  const [showNicheDropdown, setShowNicheDropdown] = useState(false);
  
  const [config, setConfig] = useState({
    articleStyle: 'Informative',
    pointOfView: 'Second-person',
    articleLength: 'Medium (~1500 words)',
    featuredImage: 'Yes (+1 Credit)',
    imagesInArticle: '3 Images (+3 Credits)',
    photoStyle: 'Photographic'
  });

  const availableNiches = [
    'Food & Cooking', 'Health & Fitness', 'Technology', 'Business & Finance',
    'Travel & Lifestyle', 'Home & Garden', 'Fashion & Beauty', 'Education & Learning',
    'Entertainment & Gaming', 'Parenting & Family', 'Sports & Recreation', 'Arts & Crafts',
    'Personal Development', 'Science & Nature', 'Automotive', 'Real Estate',
    'Marketing & SEO', 'Photography', 'Music & Audio', 'Pet Care', 'DIY & Crafts',
    'Mental Health', 'Cryptocurrency', 'Sustainability', 'Fitness & Nutrition',
    'Career Development', 'Relationships', 'Productivity', 'Investing', 'Gaming',
    'Social Media', 'E-commerce', 'Artificial Intelligence', 'Web Development'
  ];

  const handleNicheToggle = (niche) => {
    setSelectedNiches(prev => {
      if (prev.includes(niche)) {
        return prev.filter(n => n !== niche);
      } else {
        return [...prev, niche];
      }
    });
  };

  const removeNiche = (niche) => {
    setSelectedNiches(prev => prev.filter(n => n !== niche));
  };

  const testLLMConnection = async () => {
    console.log('Testing LLM connection...');
    try {
      toast.loading('Testing LLM connection...', { id: 'llm-test' });
      
      const result = await llmRouter.executeTask(
        'Write exactly this: "LLM test successful - content generation working"',
        { type: TaskType.CONTENT_GENERATION }
      );
      
      toast.dismiss('llm-test');
      
      // Comprehensive debugging
      console.log('=== LLM DEBUGGING ===');
      console.log('1. Raw result:', result);
      console.log('2. Result type:', typeof result);
      console.log('3. Result constructor:', result?.constructor?.name);
      console.log('4. Result keys:', result ? Object.keys(result) : 'No keys');
      console.log('5. JSON stringify:', JSON.stringify(result, null, 2));
      
      // Try every possible extraction method
      let content = '';
      let extractionMethod = 'none';
      
      if (typeof result === 'string') {
        content = result;
        extractionMethod = 'direct_string';
      } else if (result && typeof result === 'object') {
        // Try direct properties
        if (result.content) {
          content = result.content;
          extractionMethod = 'result.content';
        } else if (result.text) {
          content = result.text;
          extractionMethod = 'result.text';
        } else if (result.response) {
          content = result.response;
          extractionMethod = 'result.response';
        } else if (result.output) {
          content = result.output;
          extractionMethod = 'result.output';
        } else if (result.message) {
          content = result.message;
          extractionMethod = 'result.message';
        }
        
        // Try OpenAI format
        else if (result.choices && result.choices[0]) {
          if (result.choices[0].message?.content) {
            content = result.choices[0].message.content;
            extractionMethod = 'openai_message_content';
          } else if (result.choices[0].text) {
            content = result.choices[0].text;
            extractionMethod = 'openai_choices_text';
          }
        }
        
        // Try Gemini format
        else if (result.candidates && result.candidates[0]) {
          if (result.candidates[0].content?.parts?.[0]?.text) {
            content = result.candidates[0].content.parts[0].text;
            extractionMethod = 'gemini_candidates';
          }
        }
        
        // Try nested response
        else if (result.data) {
          if (typeof result.data === 'string') {
            content = result.data;
            extractionMethod = 'result.data_string';
          } else if (result.data.content) {
            content = result.data.content;
            extractionMethod = 'result.data.content';
          }
        }
        
        // Last resort - look for any string value in the object
        else {
          for (const [key, value] of Object.entries(result)) {
            if (typeof value === 'string' && value.length > 10) {
              content = value;
              extractionMethod = `fallback_${key}`;
              break;
            }
          }
        }
      }
      
      console.log('6. Extracted content:', content);
      console.log('7. Content length:', content?.length || 0);
      console.log('8. Extraction method:', extractionMethod);
      console.log('=== END DEBUGGING ===');
      
      if (content && content.length > 0) {
        toast.success('LLM connection successful!');
        alert(`LLM Test SUCCESS!\n\nExtraction Method: ${extractionMethod}\nProvider: ${result.provider || 'Unknown'}\nContent Length: ${content.length}\nContent: "${content}"`);
      } else {
        toast.error('LLM connected but no content extracted!');
        const debugInfo = `
Raw Result Type: ${typeof result}
Raw Result: ${JSON.stringify(result, null, 2)}
Extraction Method: ${extractionMethod}
Available Keys: ${result ? Object.keys(result).join(', ') : 'none'}
        `;
        alert(`LLM CONNECTED BUT NO CONTENT!\n\nDebug Info:${debugInfo}`);
      }
      
    } catch (error) {
      toast.dismiss('llm-test');
      toast.error('LLM connection failed!');
      console.error('LLM Test Failed:', error);
      alert(`LLM Test Failed: ${error.message}`);
    }
  };

  const handleGenerateTitles = async () => {
    if (!topic.trim()) {
      toast.error('Please enter a topic');
      return;
    }

    if (selectedNiches.length === 0) {
      toast.error('Please select at least one niche');
      return;
    }
    
    setIsGenerating(true);
    try {
      const nichesText = selectedNiches.join(', ');
      const prompt = `Generate 5 professional, high-converting article titles about "${topic}" for the ${nichesText} industry.

TITLE QUALITY STANDARDS:
- Each title must be 40-70 characters for optimal SEO
- Include power words that drive engagement (Ultimate, Complete, Essential, Proven, etc.)
- Use numbers and specifics where relevant (5 Ways, 10 Tips, Step-by-Step, etc.)
- Create curiosity gaps that compel clicks
- Target commercial and informational search intent
- Include primary keywords naturally

TITLE FORMATS TO USE:
1. How-to Guide: "How to [Achieve Result] in [Timeframe]: [Specific Method]"
2. Listicle: "[Number] [Adjective] [Topic] That [Benefit] in [Year]"
3. Ultimate Guide: "The Complete Guide to [Topic]: [Specific Outcome]"
4. Problem/Solution: "[Problem]? Here's How to [Solution] Fast"
5. Comparison: "[Option A] vs [Option B]: Which is Better for [Use Case]?"

AUDIENCE: ${config.articleStyle} content for ${nichesText} professionals and enthusiasts

Generate exactly 5 titles optimized for high click-through rates and search rankings. Return only the titles, one per line:`;

      toast.loading('Generating article titles...', { id: 'title-gen' });
      
      const result = await llmRouter.executeTask(
        prompt,
        { type: TaskType.CONTENT_GENERATION }
      );
      
      toast.dismiss('title-gen');
      
      // Extract content using comprehensive method detection
      let content = '';
      let extractionMethod = 'none';
      
      console.log('Title generation - Raw result:', result);
      console.log('Title generation - Result type:', typeof result);
      
      if (typeof result === 'string') {
        content = result;
        extractionMethod = 'direct_string';
      } else if (result && typeof result === 'object') {
        // Try direct properties first
        if (result.content) {
          content = result.content;
          extractionMethod = 'result.content';
        } else if (result.text) {
          content = result.text;
          extractionMethod = 'result.text';
        } else if (result.response) {
          content = result.response;
          extractionMethod = 'result.response';
        } else if (result.output) {
          content = result.output;
          extractionMethod = 'result.output';
        } else if (result.message) {
          content = result.message;
          extractionMethod = 'result.message';
        }
        
        // Try OpenAI format
        else if (result.choices && result.choices[0]) {
          if (result.choices[0].message?.content) {
            content = result.choices[0].message.content;
            extractionMethod = 'openai_message_content';
          } else if (result.choices[0].text) {
            content = result.choices[0].text;
            extractionMethod = 'openai_choices_text';
          }
        }
        
        // Try Gemini format
        else if (result.candidates && result.candidates[0]) {
          if (result.candidates[0].content?.parts?.[0]?.text) {
            content = result.candidates[0].content.parts[0].text;
            extractionMethod = 'gemini_candidates';
          }
        }
        
        // Try nested data
        else if (result.data) {
          if (typeof result.data === 'string') {
            content = result.data;
            extractionMethod = 'result.data_string';
          } else if (result.data.content) {
            content = result.data.content;
            extractionMethod = 'result.data.content';
          }
        }
        
        // Last resort - find any string property
        else {
          for (const [key, value] of Object.entries(result)) {
            if (typeof value === 'string' && value.length > 5) {
              content = value;
              extractionMethod = `fallback_${key}`;
              break;
            }
          }
        }
      }
      
      console.log('Title extraction result:', {
        hasContent: !!content,
        contentLength: content?.length || 0,
        extractionMethod,
        contentPreview: content?.substring(0, 200)
      });
      
      if (!content || content.trim().length < 10) {
        console.error('Title generation failed - no content received');
        toast.error('No titles received from AI. Please try again.');
        return;
      }
      
      const lines = content.split('\n').filter(line => line.trim());
      const titles = [];
      
      for (const line of lines) {
        // Remove numbering, bullets, and clean up
        const cleaned = line
          .replace(/^\d+\.?\s*/, '')
          .replace(/^[-•*]\s*/, '')
          .replace(/^["']/, '')
          .replace(/["']$/, '')
          .trim();
        
        if (cleaned && cleaned.length > 10 && cleaned.length < 200) {
          titles.push(cleaned);
        }
      }
      
      if (titles.length > 0) {
        setCustomTitles(titles.join('\n'));
        toast.success(`Generated ${titles.length} titles!`);
        console.log('Parsed titles:', titles);
      } else {
        // Fallback: use the raw response
        setCustomTitles(content);
        toast.success('Titles generated! Please review and edit as needed.');
        console.log('Using raw response as fallback');
      }
      
    } catch (error) {
      toast.dismiss('title-gen');
      console.error('Title generation failed:', error);
      toast.error(`Failed to generate titles: ${error.message}`);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleAddTitlesToQueue = () => {
    if (!customTitles.trim()) {
      toast.error('No titles to add');
      return;
    }
    
    const titles = customTitles.split('\n').filter(title => title.trim());
    const newTitles = titles.map(title => ({
      id: Date.now().toString() + Math.random(),
      title: title.trim(),
      niches: [...selectedNiches]
    }));
    
    setArticleQueue(prev => [...prev, ...newTitles]);
    setCustomTitles('');
    toast.success(`Added ${newTitles.length} titles to queue!`);
  };

  const handleRemoveFromQueue = (id) => {
    setArticleQueue(prev => prev.filter(item => item.id !== id));
    toast.success('Removed from queue');
  };

  const calculateCredits = () => {
    let creditsPerArticle = 1;
    
    if (config.featuredImage === 'Yes (+1 Credit)') creditsPerArticle += 1;
    
    const imageCount = parseInt(config.imagesInArticle.match(/\d+/)?.[0] || '0');
    creditsPerArticle += imageCount;
    
    return articleQueue.length * creditsPerArticle;
  };

  const getTargetWordCount = () => {
    if (config.articleLength.includes('Short')) return 800;
    if (config.articleLength.includes('Medium')) return 1500;
    if (config.articleLength.includes('Long')) return 3000;
    return 1500;
  };

  const generateSingleArticle = async (queueItem, targetWordCount) => {
    const { title, niches } = queueItem;
    const nichesText = niches.join(', ');
    
    console.log(`Starting article generation for: "${title}"`);
    
    // Simplified, more direct prompt for better content generation
    const prompt = `Write a complete ${targetWordCount}-word article titled: "${title}"

Topic: ${title}
Style: ${config.articleStyle}
Audience: ${nichesText} readers
Length: ${targetWordCount} words

Write a full article with:

1. Engaging introduction (2-3 paragraphs)
2. Main content with 4-5 sections using ## headings
3. Practical tips and examples
4. Strong conclusion

Start writing the complete article now:`;

    try {
      console.log('Sending prompt to LLM router...');
      
      const result = await llmRouter.executeTask(
        prompt,
        { 
          type: TaskType.ARTICLE_WRITING,
          maxTokens: Math.min(4000, Math.ceil(targetWordCount * 2)),
          temperature: 0.7
        }
      );
      
      console.log('LLM response received:', {
        provider: result.provider,
        contentLength: result.content?.length || 0,
        hasContent: !!result.content
      });
      
      // Extract content using comprehensive method detection
      let content = '';
      let extractionMethod = 'none';
      
      console.log('Article generation - Raw result:', result);
      console.log('Article generation - Result type:', typeof result);
      
      if (typeof result === 'string') {
        content = result;
        extractionMethod = 'direct_string';
      } else if (result && typeof result === 'object') {
        // Try direct properties first
        if (result.content) {
          content = result.content;
          extractionMethod = 'result.content';
        } else if (result.text) {
          content = result.text;
          extractionMethod = 'result.text';
        } else if (result.response) {
          content = result.response;
          extractionMethod = 'result.response';
        } else if (result.output) {
          content = result.output;
          extractionMethod = 'result.output';
        } else if (result.message) {
          content = result.message;
          extractionMethod = 'result.message';
        }
        
        // Try OpenAI format
        else if (result.choices && result.choices[0]) {
          if (result.choices[0].message?.content) {
            content = result.choices[0].message.content;
            extractionMethod = 'openai_message_content';
          } else if (result.choices[0].text) {
            content = result.choices[0].text;
            extractionMethod = 'openai_choices_text';
          }
        }
        
        // Try Gemini format
        else if (result.candidates && result.candidates[0]) {
          if (result.candidates[0].content?.parts?.[0]?.text) {
            content = result.candidates[0].content.parts[0].text;
            extractionMethod = 'gemini_candidates';
          }
        }
        
        // Try nested data
        else if (result.data) {
          if (typeof result.data === 'string') {
            content = result.data;
            extractionMethod = 'result.data_string';
          } else if (result.data.content) {
            content = result.data.content;
            extractionMethod = 'result.data.content';
          }
        }
        
        // Last resort - find any string property
        else {
          for (const [key, value] of Object.entries(result)) {
            if (typeof value === 'string' && value.length > 10) {
              content = value;
              extractionMethod = `fallback_${key}`;
              break;
            }
          }
        }
      }
      
      console.log('Content extraction result:', {
        hasContent: !!content,
        contentLength: content?.length || 0,
        extractionMethod,
        contentPreview: content?.substring(0, 100)
      });
      
      if (!content || typeof content !== 'string' || content.trim().length < 20) {
        console.error('Content validation failed:', {
          hasContent: !!content,
          contentType: typeof content,
          contentLength: content?.length || 0,
          extractionMethod,
          rawResult: result
        });
        throw new Error(`Generated content is invalid. Length: ${content?.length || 0}, Type: ${typeof content}, Method: ${extractionMethod}`);
      }
      
      // Post-process content for better quality
      let processedContent = content;
      
      // Ensure proper formatting
      if (!processedContent.includes('##')) {
        // Add structure if missing
        const lines = processedContent.split('\n');
        const title = lines[0].replace(/^#\s*/, '');
        const remainingContent = lines.slice(1).join('\n');
        
        processedContent = `# ${title}\n\n## Introduction\n\n${remainingContent}`;
      }
      
      // Ensure minimum quality standards
      const wordCount = processedContent.split(/\s+/).length;
      const hasSubheadings = (processedContent.match(/##/g) || []).length >= 2;
      const hasConclusion = processedContent.toLowerCase().includes('conclusion') || 
                           processedContent.toLowerCase().includes('summary') ||
                           processedContent.toLowerCase().includes('final');
      
      // Quality validation
      if (wordCount < targetWordCount * 0.7) {
        console.warn(`Article word count (${wordCount}) is below target (${targetWordCount})`);
      }
      
      if (!hasSubheadings) {
        console.warn('Article lacks proper subheadings structure');
      }
      
      const article = {
        id: Date.now().toString() + Math.random(),
        title,
        content: processedContent,
        wordCount,
        status: 'completed',
        generatedAt: new Date().toISOString(),
        niches,
        config: { ...config },
        provider: result.provider || 'Unknown',
        qualityScore: {
          wordCount: wordCount >= targetWordCount * 0.7,
          hasSubheadings,
          hasConclusion,
          overall: wordCount >= targetWordCount * 0.7 && hasSubheadings
        }
      };
      
      console.log('Article generated successfully:', {
        title,
        wordCount,
        provider: result.provider
      });
      
      return article;
      
    } catch (error) {
      console.error(`Failed to generate article for "${title}":`, error);
      
      const errorArticle = {
        id: Date.now().toString() + Math.random(),
        title,
        content: `# ${title}\n\n*Article generation failed: ${error.message}*\n\nThis could be due to:\n- API rate limits\n- Network connectivity issues\n- Invalid API keys\n- LLM service unavailable\n\nPlease check your API configuration and try again.\n\n**Debug Info:**\n- Error: ${error.message}\n- Time: ${new Date().toISOString()}\n- Task Type: ${TaskType.ARTICLE_WRITING}`,
        wordCount: 25,
        status: 'error',
        generatedAt: new Date().toISOString(),
        niches,
        config: { ...config },
        error: error.message
      };
      
      return errorArticle;
    }
  };

  const handleGenerateArticles = async () => {
    if (articleQueue.length === 0) {
      toast.error('No articles in queue');
      return;
    }
    
    console.log(`Starting bulk generation of ${articleQueue.length} articles`);
    console.log('Queue contents:', articleQueue.map(item => item.title));
    
    setIsGeneratingArticles(true);
    const targetWordCount = getTargetWordCount();
    
    try {
      toast.success(`Starting generation of ${articleQueue.length} articles...`);
      
      const articles = [];
      let successCount = 0;
      let errorCount = 0;
      
      for (let i = 0; i < articleQueue.length; i++) {
        const queueItem = articleQueue[i];
        
        toast.loading(
          `Generating article ${i + 1} of ${articleQueue.length}: ${queueItem.title.substring(0, 50)}...`, 
          { id: 'generation-progress' }
        );
        
        console.log(`\n=== GENERATING ARTICLE ${i + 1}/${articleQueue.length} ===`);
        console.log(`Title: ${queueItem.title}`);
        console.log(`Target words: ${targetWordCount}`);
        
        try {
          const article = await generateSingleArticle(queueItem, targetWordCount);
          articles.push(article);
          
          if (article.status === 'completed') {
            successCount++;
            console.log(`✅ Article ${i + 1} completed: ${article.wordCount} words`);
          } else {
            errorCount++;
            console.log(`❌ Article ${i + 1} failed: ${article.error}`);
          }
        } catch (error) {
          console.error(`❌ Article ${i + 1} threw error:`, error);
          const errorArticle = {
            id: Date.now().toString() + Math.random(),
            title: queueItem.title,
            content: `# ${queueItem.title}\n\n*Article generation failed: ${error.message}*`,
            wordCount: 10,
            status: 'error',
            generatedAt: new Date().toISOString(),
            niches: queueItem.niches,
            config: { ...config },
            error: error.message
          };
          articles.push(errorArticle);
          errorCount++;
        }
        
        // Progress update
        const progressPercent = Math.round(((i + 1) / articleQueue.length) * 100);
        console.log(`Progress: ${progressPercent}% (${i + 1}/${articleQueue.length})`);
        
        // Add delay between requests to avoid rate limits (except for last article)
        if (i < articleQueue.length - 1) {
          console.log('Waiting 2 seconds before next generation...');
          await new Promise(resolve => setTimeout(resolve, 2000));
        }
      }
      
      console.log(`\n=== BULK GENERATION COMPLETE ===`);
      console.log(`Total articles generated: ${articles.length}`);
      console.log(`Successful: ${successCount}`);
      console.log(`Failed: ${errorCount}`);
      
      // Update state with all generated articles
      setGeneratedArticles(prev => {
        const updated = [...prev, ...articles];
        console.log(`Total articles in state: ${updated.length}`);
        return updated;
      });
      
      // Clear the queue
      setArticleQueue([]);
      console.log('Queue cleared');
      
      toast.dismiss('generation-progress');
      
      // Show final results
      if (successCount > 0) {
        toast.success(`Successfully generated ${successCount} articles!`);
      }
      if (errorCount > 0) {
        toast.error(`${errorCount} articles failed to generate`);
      }
      
    } catch (error) {
      console.error('Bulk article generation failed:', error);
      toast.error(`Article generation failed: ${error.message}`);
      toast.dismiss('generation-progress');
    } finally {
      setIsGeneratingArticles(false);
    }
  };

  const viewArticle = (article) => {
    setSelectedArticle(article);
  };

  const downloadArticle = (article) => {
    const blob = new Blob([article.content], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${article.title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.md`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast.success('Article downloaded!');
  };

  const copyArticle = async (article) => {
    try {
      await navigator.clipboard.writeText(article.content);
      toast.success('Article copied to clipboard!');
    } catch (error) {
      toast.error('Failed to copy article');
    }
  };

  const downloadAllArticles = () => {
    if (generatedArticles.length === 0) {
      toast.error('No articles to download');
      return;
    }

    const allContent = generatedArticles.map(article => 
      `${'='.repeat(60)}\n${article.title}\n${'='.repeat(60)}\n\n${article.content}\n\n\n`
    ).join('');

    const blob = new Blob([allContent], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `all_articles_${new Date().toISOString().split('T')[0]}.md`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast.success('All articles downloaded!');
  };

  const clearAllArticles = () => {
    if (window.confirm('Are you sure you want to delete all generated articles?')) {
      setGeneratedArticles([]);
      toast.success('All articles cleared!');
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 text-white">
      <div className="text-center py-8 border-b border-slate-700">
        <div className="flex justify-center mb-4">
          <div className="w-12 h-12 bg-green-500 rounded-lg flex items-center justify-center">
            <FileText className="w-6 h-6 text-white" />
          </div>
        </div>
        <h1 className="text-4xl font-bold mb-2">Auto Writer Studio</h1>
        <p className="text-slate-400 max-w-2xl mx-auto">
          Generate hundreds of high-quality, SEO-optimized articles in the background. From title 
          generation to final content, automate your entire writing workflow.
        </p>
      </div>

      <div className="max-w-7xl mx-auto p-6">
        <div className="mb-6 text-center space-y-4">
          <button 
            onClick={testLLMConnection} 
            className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
          >
            Test LLM Connection
          </button>
          <p className="text-xs text-slate-400">Click to verify LLM services are working properly</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <div className="bg-slate-800 rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-4 flex items-center">
              <span className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center text-sm font-bold mr-3">1</span>
              Generate Article Titles
            </h2>
            
            <div className="space-y-4">
              <div>
                <input
                  type="text"
                  placeholder="Enter a topic, e.g., 'Labrador training tips'"
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:border-purple-500"
                />
                <button
                  onClick={handleGenerateTitles}
                  disabled={isGenerating || !topic.trim() || selectedNiches.length === 0}
                  className="mt-3 px-6 py-2 bg-purple-600 hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg font-medium transition-colors"
                >
                  {isGenerating ? 'Generating...' : 'Generate Titles'}
                </button>
              </div>

              <div>
                <p className="text-sm text-slate-400 mb-2">OR add your own titles below</p>
                <textarea
                  placeholder="Paste your article titles here, one per line."
                  value={customTitles}
                  onChange={(e) => setCustomTitles(e.target.value)}
                  rows={8}
                  className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:border-purple-500 resize-none"
                />
              </div>

              <button
                onClick={handleAddTitlesToQueue}
                disabled={!customTitles.trim()}
                className="w-full px-4 py-3 bg-orange-600 hover:bg-orange-700 disabled:bg-slate-600 disabled:cursor-not-allowed rounded-lg font-medium transition-colors"
              >
                Add Titles to Queue
              </button>
            </div>
          </div>

          <div className="bg-slate-800 rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-4 flex items-center">
              <span className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center text-sm font-bold mr-3">2</span>
              Configure Article Details
            </h2>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Niches (Select Multiple)</label>
                
                <div className="flex flex-wrap gap-2 mb-2">
                  {selectedNiches.map(niche => (
                    <span key={niche} className="bg-purple-600 text-white px-3 py-1 rounded-full text-sm flex items-center gap-1">
                      {niche}
                      <button
                        onClick={() => removeNiche(niche)}
                        className="hover:bg-purple-700 rounded-full p-0.5"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                </div>

                <div className="relative">
                  <button
                    onClick={() => setShowNicheDropdown(!showNicheDropdown)}
                    className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-purple-500 text-left flex items-center justify-between"
                  >
                    <span>Add niches...</span>
                    <Plus className="w-4 h-4" />
                  </button>
                  
                  {showNicheDropdown && (
                    <div className="absolute z-10 w-full mt-1 bg-slate-700 border border-slate-600 rounded-lg max-h-60 overflow-y-auto">
                      {availableNiches.map(niche => (
                        <button
                          key={niche}
                          onClick={() => {
                            handleNicheToggle(niche);
                            setShowNicheDropdown(false);
                          }}
                          className={`w-full px-4 py-2 text-left hover:bg-slate-600 transition-colors ${
                            selectedNiches.includes(niche) ? 'bg-purple-600 text-white' : 'text-slate-300'
                          }`}
                        >
                          {niche}
                          {selectedNiches.includes(niche) && <span className="float-right">✓</span>}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Article Style</label>
                  <select
                    value={config.articleStyle}
                    onChange={(e) => setConfig(prev => ({ ...prev, articleStyle: e.target.value }))}
                    className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-purple-500"
                  >
                    <option>Informative</option>
                    <option>Conversational</option>
                    <option>Formal</option>
                    <option>Humorous</option>
                    <option>Professional</option>
                    <option>Casual</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Point of View</label>
                  <select
                    value={config.pointOfView}
                    onChange={(e) => setConfig(prev => ({ ...prev, pointOfView: e.target.value }))}
                    className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-purple-500"
                  >
                    <option>First-person</option>
                    <option>Second-person</option>
                    <option>Third-person</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Article Length</label>
                <select
                  value={config.articleLength}
                  onChange={(e) => setConfig(prev => ({ ...prev, articleLength: e.target.value }))}
                  className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-purple-500"
                >
                  <option>Short (~800 words)</option>
                  <option>Medium (~1500 words)</option>
                  <option>Long (~3000 words)</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Featured Image</label>
                  <select
                    value={config.featuredImage}
                    onChange={(e) => setConfig(prev => ({ ...prev, featuredImage: e.target.value }))}
                    className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-purple-500"
                  >
                    <option>Yes (+1 Credit)</option>
                    <option>No</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Images in Article</label>
                  <select
                    value={config.imagesInArticle}
                    onChange={(e) => setConfig(prev => ({ ...prev, imagesInArticle: e.target.value }))}
                    className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-purple-500"
                  >
                    <option>0 Images</option>
                    <option>1 Image (+1 Credit)</option>
                    <option>3 Images (+3 Credits)</option>
                    <option>5 Images (+5 Credits)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Photo Style</label>
                <select
                  value={config.photoStyle}
                  onChange={(e) => setConfig(prev => ({ ...prev, photoStyle: e.target.value }))}
                  className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-purple-500"
                >
                  <option>Photographic</option>
                  <option>Illustration</option>
                  <option>Minimalist</option>
                  <option>Artistic</option>
                </select>
              </div>

              <div className="bg-slate-700 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">Generate Articles</span>
                  <span className="text-lg font-bold text-green-400">{calculateCredits()} Credits</span>
                </div>
                <p className="text-xs text-slate-400 mb-3">
                  Queue articles and generate them automatically in the background.
                </p>
                <button
                  onClick={handleGenerateArticles}
                  disabled={articleQueue.length === 0 || isGeneratingArticles}
                  className="w-full px-4 py-3 bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg font-medium transition-all"
                >
                  {isGeneratingArticles ? 'Generating Articles...' : `Generate ${articleQueue.length} Articles (${calculateCredits()} Credits)`}
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-slate-800 rounded-lg p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4">Queue of Articles to Generate</h2>
          
          {articleQueue.length === 0 ? (
            <div className="text-center py-8">
              <FileText className="w-12 h-12 text-slate-600 mx-auto mb-4" />
              <p className="text-slate-400">Your generation queue is empty.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {articleQueue.map((item) => (
                <div key={item.id} className="bg-slate-700 rounded-lg p-4 flex items-center justify-between">
                  <div className="flex-1">
                    <h3 className="font-medium text-white">{item.title}</h3>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {item.niches.map(niche => (
                        <span key={niche} className="text-xs bg-purple-600 text-white px-2 py-1 rounded">
                          {niche}
                        </span>
                      ))}
                    </div>
                  </div>
                  <button
                    onClick={() => handleRemoveFromQueue(item.id)}
                    className="ml-4 p-2 text-red-400 hover:text-red-300 hover:bg-red-900/20 rounded-lg transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="bg-slate-800 rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold">Generated Articles ({generatedArticles.length})</h2>
            {generatedArticles.length > 0 && (
              <div className="flex gap-2">
                <button
                  onClick={downloadAllArticles}
                  className="px-4 py-2 bg-green-600 hover:bg-green-700 rounded-lg font-medium transition-colors flex items-center gap-2"
                >
                  <Download className="w-4 h-4" />
                  Download All
                </button>
                <button
                  onClick={clearAllArticles}
                  className="px-4 py-2 bg-red-600 hover:bg-red-700 rounded-lg font-medium transition-colors flex items-center gap-2"
                >
                  <Trash2 className="w-4 h-4" />
                  Clear All
                </button>
              </div>
            )}
          </div>
          
          {generatedArticles.length === 0 ? (
            <div className="text-center py-8">
              <FileText className="w-12 h-12 text-slate-600 mx-auto mb-4" />
              <p className="text-slate-400">No articles generated yet.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {generatedArticles.map((article) => (
                <div key={article.id} className="bg-slate-700 rounded-lg p-4">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="font-medium text-white text-sm leading-tight">{article.title}</h3>
                    <div className="flex items-center ml-2">
                      {article.status === 'completed' ? (
                        <CheckCircle className="w-4 h-4 text-green-400" />
                      ) : (
                        <AlertCircle className="w-4 h-4 text-red-400" />
                      )}
                    </div>
                  </div>
                  
                  <div className="flex flex-wrap gap-1 mb-3">
                    {article.niches?.map(niche => (
                      <span key={niche} className="text-xs bg-purple-600 text-white px-2 py-1 rounded">
                        {niche}
                      </span>
                    ))}
                  </div>
                  
                  <div className="text-xs text-slate-400 mb-3">
                    <div className="flex items-center gap-2">
                      <Clock className="w-3 h-3" />
                      {new Date(article.generatedAt).toLocaleString()}
                    </div>
                    <div className="mt-1 flex items-center gap-2">
                      <span>{article.wordCount} words • {article.status}</span>
                      {article.qualityScore && (
                        <div className="flex items-center gap-1">
                          <div className={`w-2 h-2 rounded-full ${
                            article.qualityScore.overall ? 'bg-green-400' : 
                            article.qualityScore.wordCount ? 'bg-yellow-400' : 'bg-red-400'
                          }`}></div>
                          <span className="text-xs">
                            {article.qualityScore.overall ? 'High Quality' : 
                             article.qualityScore.wordCount ? 'Good' : 'Basic'}
                          </span>
                        </div>
                      )}
                      {article.provider && (
                        <span className="text-xs bg-slate-600 px-2 py-0.5 rounded">
                          {article.provider}
                        </span>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex gap-2">
                    <button
                      onClick={() => viewArticle(article)}
                      className="flex-1 px-3 py-2 bg-blue-600 hover:bg-blue-700 rounded text-xs font-medium transition-colors flex items-center justify-center gap-1"
                    >
                      <Eye className="w-3 h-3" />
                      View
                    </button>
                    <button
                      onClick={() => copyArticle(article)}
                      className="flex-1 px-3 py-2 bg-gray-600 hover:bg-gray-700 rounded text-xs font-medium transition-colors flex items-center justify-center gap-1"
                    >
                      <Copy className="w-3 h-3" />
                      Copy
                    </button>
                    <button
                      onClick={() => downloadArticle(article)}
                      className="flex-1 px-3 py-2 bg-green-600 hover:bg-green-700 rounded text-xs font-medium transition-colors flex items-center justify-center gap-1"
                    >
                      <Download className="w-3 h-3" />
                      Save
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {selectedArticle && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-slate-800 rounded-lg max-w-4xl w-full max-h-[90vh] overflow-hidden">
            <div className="flex items-center justify-between p-6 border-b border-slate-700">
              <h2 className="text-xl font-semibold">{selectedArticle.title}</h2>
              <button
                onClick={() => setSelectedArticle(null)}
                className="p-2 hover:bg-slate-700 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
              <div className="prose prose-invert max-w-none">
                <pre className="whitespace-pre-wrap font-sans text-sm leading-relaxed">
                  {selectedArticle.content}
                </pre>
              </div>
            </div>
            <div className="flex gap-2 p-6 border-t border-slate-700">
              <button
                onClick={() => copyArticle(selectedArticle)}
                className="px-4 py-2 bg-gray-600 hover:bg-gray-700 rounded-lg font-medium transition-colors flex items-center gap-2"
              >
                <Copy className="w-4 h-4" />
                Copy
              </button>
              <button
                onClick={() => downloadArticle(selectedArticle)}
                className="px-4 py-2 bg-green-600 hover:bg-green-700 rounded-lg font-medium transition-colors flex items-center gap-2"
              >
                <Download className="w-4 h-4" />
                Download
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AutoWriterPage;
