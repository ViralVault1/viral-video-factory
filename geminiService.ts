import { GoogleGenAI, Type, Modality, GenerateContentResponse } from "@google/genai";
import { NextSteps, ContentIdeas, StockVideo, Scene, InspirationContent, ViralOptimizations, ProductHuntReport, CharacterStoryReport, ProductAdReport, BrandKit, AdTemplate, ChatMessage, CalendarContent, ContentPlan, PostIdea, ContentDrafts, YouTubeRemixKit, AiModel, AIPersona, AIContentStrategy, AIPersonaContentPackage, CreditAction, AutopilotSettings } from "../types";
import { Theme } from "../contexts/ThemeContext";
import { API_KEY, PEXELS_API_KEY, isPexelsConfigured, isGeminiConfigured } from "../lib/apiKeys";
import * as lumaService from './lumaService';
import { sampleStockVideos } from "../config/sampleStockVideos";

let ai: GoogleGenAI | null = null;

const getAiClient = (): GoogleGenAI => {
    if (!isGeminiConfigured) {
        // This should technically not be reached if the App.tsx guard is working
        throw new Error("Gemini API key not configured. Please set VITE_API_KEY in your environment variables.");
    }
    if (!ai) {
        ai = new GoogleGenAI({ apiKey: API_KEY! });
    }
    return ai;
};


const enhanceErrorMessage = (error: unknown, fallbackMessage: string): Error => {
    console.error(fallbackMessage, error);
    if (error instanceof Error) {
        // FIX: Added a specific check for API quota errors to provide a more user-friendly message.
        if (error.message.includes('RESOURCE_EXHAUSTED') || error.message.includes('429')) {
             return new Error("API Quota Exceeded: You have likely exceeded your free tier usage limit. Please check your Google AI Studio plan and billing details to continue.");
        }
        // Append more context to the original error message for other cases
        return new Error(`${fallbackMessage}. Details: ${error.message}`);
    }
    return new Error(`${fallbackMessage}. An unknown error occurred.`);
};


// Utility to convert data URL to base64 string and mimeType
const dataUrlToParts = (dataUrl: string): { mimeType: string; data: string } => {
    const parts = dataUrl.split(',');
    const mimeType = parts[0].match(/:(.*?);/)?.[1];
    const data = parts[1];
    if (!mimeType || !data) {
        throw new Error("Invalid data URL");
    }
    return { mimeType, data };
};

const getInspirationPrompt = (theme: Theme, topic: string) => {
    if (theme === 'pixar') {
        return `You are a creative director at a world-class animation studio like Disney or Pixar. A user wants inspiration on the topic: "${topic}".
