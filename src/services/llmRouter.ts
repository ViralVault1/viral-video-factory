import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNotification } from './NotificationProvider';
import { ArticleConfig, ArticleQueueItem } from '../types';
import { generateArticleTitles, generateFullArticle, generateArticleImagePrompt, generateImage } from '../services/geminiService';
import { creditCosts } from '../services/creditService';
import { Card } from './Card';
import { LoaderIcon } from './icons/LoaderIcon';
import { SparklesIcon } from './icons/SparklesIcon';
import { TrashIcon } from './icons/TrashIcon';
import { DocumentTextIcon } from './icons/DocumentTextIcon';
import { CheckIcon } from './icons/CheckIcon';
import { ErrorIcon } from './icons/ErrorIcon';
import { ClockIcon } from './icons/ClockIcon';

const initialConfig: ArticleConfig = {
    niche: 'Pets and pet care',
    style: 'Informative',
    seoOptimized: true,
    language: 'English',
    length: 'Medium (~1500 words)',
    pointOfView: 'Second-person',
    tone: 'Engaging',
    addBold: true,
    faqCount: 5,
    takeawaysCount: 5,
    includeFeaturedImage: true,
    inArticleImageCount: 3,
    imageStyle: 'Photographic',
    externalLinkCount: 0,
    internalLinkCount: 0,
    blogUrlForInternalLinking: '',
};

export const AutoWriterPage: React.FC = () => {
    const { consumeCredits } = useAuth();
    const { showToast } = useNotification();

    const [config, setConfig] = useState<ArticleConfig>(initialConfig);
    const [titlePrompt, setTitlePrompt] = useState('');
    const [isGeneratingTitles, setIsGeneratingTitles] = useState(false);
    const [manualTitles, setManualTitles] = useState('');
    const [articleQueue, setArticleQueue] = useState<ArticleQueueItem[]>([]);
    const [isGeneratingArticles, setIsGeneratingArticles] = useState(false);
    const [totalCost, setTotalCost] = useState(0);

    useEffect(() => {
        const costPerArticle = creditCosts.fullArticleGeneration +
            (config.includeFeaturedImage ? creditCosts.articleImageGeneration : 0) +
            (config.inArticleImageCount * creditCosts.articleImageGeneration);
        const pendingArticles = articleQueue.filter(item => item.status === 'pending').length;
        setTotalCost(pendingArticles * costPerArticle);
    }, [articleQueue, config]);

    const handleGenerateTitles = async () => {
        if (!titlePrompt.trim()) {
            showToast('Please enter a topic to generate titles.', 'error');
            return;
        }
        setIsGeneratingTitles(true);
        try {
            await consumeCredits('articleTitleGeneration');
            const titles = await generateArticleTitles({ ...config, niche: titlePrompt });
            setManualTitles(titles.join('\n'));
            showToast('Titles generated successfully!', 'success');
        } catch (error: any) {
            showToast(error.message, 'error');
        } finally {
            setIsGeneratingTitles(false);
        }
    };

    const handleAddTitlesToQueue = () => {
        const newTitles = manualTitles.split('\n').map(t => t.trim()).filter(t => t.length > 3);
        if (newTitles.length === 0) {
            showToast('No valid titles to add. Titles must be longer than 3 characters.', 'error');
            return;
        }
        const newQueueItems: ArticleQueueItem[] = newTitles.map(title => ({
            id: `${Date.now()}-${Math.random()}`,
            title,
            status: 'pending',
        }));
        setArticleQueue(prev => [...prev, ...newQueueItems]);
        setManualTitles('');
    };
    
    const handleStartGeneration = async () => {
        if (isGeneratingArticles) return;

        const itemsToGenerate = articleQueue.filter(item => item.status === 'pending');
        if (itemsToGenerate.length === 0) {
            showToast('No articles in the queue to generate.', 'info');
            return;
        }
        
        setIsGeneratingArticles(true);

        for (const item of itemsToGenerate) {
            setArticleQueue(prev => prev.map(q => q.id === item.id ? { ...q, status: 'generating' } : q));
            try {
                // Consume all credits for the article upfront
                const imageCreditsToConsume = (config.includeFeaturedImage ? 1 : 0) + config.inArticleImageCount;
                await consumeCredits('fullArticleGeneration');
                for (let i = 0; i < imageCreditsToConsume; i++) {
                    await consumeCredits('articleImageGeneration');
                }

                let articleContent = await generateFullArticle(item.title, config);

                if (config.includeFeaturedImage) {
                    const imagePrompt = await generateArticleImagePrompt(articleContent, config.imageStyle);
                    const imageUrl = await generateImage(imagePrompt, 'text, watermark', '16:9');
                    articleContent = articleContent.replace('[FEATURED_IMAGE]', `![Featured Image for ${item.title}](${imageUrl})`);
                }

                for (let i = 0; i < config.inArticleImageCount; i++) {
                    const imagePrompt = await generateArticleImagePrompt(articleContent, config.imageStyle);
                    const imageUrl = await generateImage(imagePrompt, 'text, watermark', '16:9');
                    // Replace only the first available placeholder
                    articleContent = articleContent.replace('[IN_ARTICLE_IMAGE]', `\n![In-article image](${imageUrl})\n`);
                }

                setArticleQueue(prev => prev.map(q => q.id === item.id ? { ...q, status: 'completed', content: articleContent } : q));

            } catch (error: any) {
                showToast(`Error generating article "${item.title}": ${error.message}`, 'error');
                setArticleQueue(prev => prev.map(q => q.id === item.id ? { ...q, status: 'error', error: error.message } : q));
            }
        }
        setIsGeneratingArticles(false);
        showToast('Article generation complete!', 'success');
    };

    const StatusIcon = ({ status }: { status: ArticleQueueItem['status'] }) => {
        switch (status) {
            case 'pending': return <ClockIcon className="w-5 h-5 text-gray-400 flex-shrink-0" />;
            case 'generating': return <LoaderIcon className="w-5 h-5 text-blue-400 flex-shrink-0" />;
            case 'completed': return <CheckIcon className="w-5 h-5 text-green-400 flex-shrink-0" />;
            case 'error': return <ErrorIcon className="w-5 h-5 text-red-400 flex-shrink-0" />;
            default: return null;
        }
    };

    const ConfigInput: React.FC<{ label: string; children: React.ReactNode }> = ({ label, children }) => (
        <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">{label}</label>
            {children}
        </div>
    );

    const ConfigSelect: React.FC<{ value: any, onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void, children: React.ReactNode }> = ({ value, onChange, children }) => (
         <select value={value} onChange={onChange} className="w-full bg-gray-900 border border-gray-600 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500">
            {children}
         </select>
    );

    return (
        <div className="py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                <div className="text-center mb-12">
                    <DocumentTextIcon className="w-12 h-12 text-green-400 mx-auto mb-2" />
                    <h1 className="text-4xl sm:text-5xl font-bold text-white tracking-tight">Auto Writer Studio</h1>
                    <p className="mt-4 max-w-3xl mx-auto text-lg text-gray-400">
                        Generate hundreds of high-quality, SEO-optimized articles in the background. From title generation to final content, automate your entire writing workflow.
                    </p>
                </div>

                <div className="grid lg:grid-cols-3 gap-8 items-start">
                    <div className="lg:col-span-2 space-y-8">
                        <Card>
                             <h3 className="text-xl font-bold text-white mb-2">1. Generate Article Titles</h3>
                             <div className="flex gap-2">
                                <input
                                    type="text"
                                    value={titlePrompt}
                                    onChange={e => setTitlePrompt(e.target.value)}
                                    placeholder="Enter a topic, e.g., 'Labrador training tips'"
                                    className="flex-grow bg-gray-900 border border-gray-600 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                                />
                                <button onClick={handleGenerateTitles} disabled={isGeneratingTitles} className="bg-purple-600 text-white font-semibold px-5 py-2 rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-50 flex items-center justify-center gap-2">
                                    {isGeneratingTitles ? <LoaderIcon /> : <SparklesIcon />}
                                    <span>Generate</span>
                                </button>
                             </div>
                             <p className="text-xs text-gray-500 mt-2">OR add your own titles below</p>
                             <textarea
                                value={manualTitles}
                                onChange={e => setManualTitles(e.target.value)}
                                rows={8}
                                placeholder="Paste your article titles here, one per line."
                                className="w-full bg-gray-900 border border-gray-600 rounded-lg p-3 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 mt-4"
                             />
                             <button onClick={handleAddTitlesToQueue} className="mt-4 bg-gray-700 text-white font-bold py-2 px-5 rounded-lg hover:bg-gray-600 transition-colors">
                                 Add Titles to Queue
                             </button>
                        </Card>

                        <Card>
                             <h3 className="text-xl font-bold text-white mb-4">Queue of Articles to Generate</h3>
                             <div className="space-y-3 max-h-96 overflow-y-auto pr-2">
                                {articleQueue.length > 0 ? articleQueue.map(item => (
                                    <div key={item.id} className="bg-gray-900/70 p-3 rounded-lg flex items-center justify-between gap-4">
                                        <div className="flex items-center gap-3 flex-1 min-w-0">
                                            <StatusIcon status={item.status} />
                                            <p className="text-white text-sm truncate" title={item.title}>{item.title}</p>
                                        </div>
                                        {item.status !== 'generating' && (
                                            <button onClick={() => setArticleQueue(q => q.filter(i => i.id !== item.id))} className="text-gray-500 hover:text-red-400">
                                                <TrashIcon className="w-4 h-4" />
                                            </button>
                                        )}
                                    </div>
                                )) : (
                                    <p className="text-gray-500 text-center py-8">Your generation queue is empty.</p>
                                )}
                             </div>
                        </Card>
                    </div>

                    <div className="sticky top-20">
                        <Card className="max-h-[80vh] overflow-y-auto">
                            <h3 className="text-xl font-bold text-white mb-4">2. Configure Article Details</h3>
                            <div className="space-y-4">
                                <ConfigInput label="Niche">
                                    <input type="text" value={config.niche} onChange={e => setConfig(c => ({...c, niche: e.target.value}))} className="w-full bg-gray-900 border border-gray-600 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500" />
                                </ConfigInput>
                                <div className="grid grid-cols-2 gap-4">
                                    <ConfigInput label="Article Style">
                                        <ConfigSelect value={config.style} onChange={e => setConfig(c => ({ ...c, style: e.target.value as ArticleConfig['style'] }))}>
                                            <option>Informative</option><option>Conversational</option><option>Formal</option><option>Humorous</option>
                                        </ConfigSelect>
                                    </ConfigInput>
                                    <ConfigInput label="Point of View">
                                        <ConfigSelect value={config.pointOfView} onChange={e => setConfig(c => ({ ...c, pointOfView: e.target.value as ArticleConfig['pointOfView'] }))}>
                                            <option>First-person</option><option>Second-person</option><option>Third-person</option>
                                        </ConfigSelect>
                                    </ConfigInput>
                                </div>
                                <ConfigInput label="Article Length">
                                    <ConfigSelect value={config.length} onChange={e => setConfig(c => ({ ...c, length: e.target.value as ArticleConfig['length'] }))}>
                                        <option>Short (~500 words)</option><option>Medium (~1500 words)</option><option>Long (~3500+ words)</option>
                                    </ConfigSelect>
                                </ConfigInput>
                                <div className="border-t border-gray-700 pt-4 mt-4 space-y-4">
                                    <h4 className="font-semibold text-white">Generate AI Images</h4>
                                    <ConfigInput label="Featured Image">
                                        <ConfigSelect value={config.includeFeaturedImage ? 'Yes' : 'No'} onChange={e => setConfig(c => ({ ...c, includeFeaturedImage: e.target.value === 'Yes' }))}>
                                            <option value="Yes">Yes (+1 Credit)</option><option value="No">No</option>
                                        </ConfigSelect>
                                    </ConfigInput>
                                    <ConfigInput label="Images in Article">
                                        <ConfigSelect value={config.inArticleImageCount} onChange={e => setConfig(c => ({ ...c, inArticleImageCount: Number(e.target.value) }))}>
                                            <option value={0}>0 Images</option><option value={1}>1 Image (+1 Credit)</option><option value={2}>2 Images (+2 Credits)</option><option value={3}>3 Images (+3 Credits)</option><option value={4}>4 Images (+4 Credits)</option>
                                        </ConfigSelect>
                                    </ConfigInput>
                                     <ConfigInput label="Photo Style">
                                        <ConfigSelect value={config.imageStyle} onChange={e => setConfig(c => ({ ...c, imageStyle: e.target.value as ArticleConfig['imageStyle'] }))}>
                                            <option>Photographic</option><option>Cinematic</option><option>Minimalist</option><option>Abstract</option>
                                        </ConfigSelect>
                                    </ConfigInput>
                                </div>

                                <div className="border-t border-gray-700 pt-4 mt-4">
                                    <button onClick={handleStartGeneration} disabled={isGeneratingArticles || totalCost === 0} className="w-full bg-green-500 text-white font-bold py-3 px-8 rounded-lg hover:bg-green-600 transition-colors disabled:opacity-50 flex items-center justify-center gap-2">
                                        {isGeneratingArticles ? <LoaderIcon /> : <SparklesIcon />}
                                        <span>Generate {articleQueue.filter(i => i.status === 'pending').length} Articles ({totalCost} Credits)</span>
                                    </button>
                                    <p className="text-xs text-gray-500 text-center mt-2">After you press 'START' the article generation process will start automatically.</p>
                                </div>
                            </div>
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    );
};
