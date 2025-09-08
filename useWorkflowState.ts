import React, { useReducer, Reducer } from 'react';
import { WorkflowState, WorkflowAction, Scene } from '../types';

const voices = [
  { id: 'alloy', name: 'Alloy', type: 'Standard' },
  { id: 'echo', name: 'Echo', type: 'Standard' },
  { id: 'fable', name: 'Fable', type: 'Standard' },
  { id: 'onyx', name: 'Onyx', type: 'Premium' },
  { id: 'nova', name: 'Nova', type: 'Premium' },
  { id: 'shimmer', name: 'Shimmer', type: 'Premium' },
];

const initialState: WorkflowState = {
    searchTopic: '',
    isSearching: false,
    inspirationResults: [],
    
    videoLink: '',
    headlines: [],
    isLoadingHeadlines: false,
    
    script: '',
    isGeneratingScript: false,
    isRewriting: false,
    isOptimizing: false,
    viralOptimizations: null,
    
    selectedVoice: voices[0].id,
    selectedMusic: 'none',
    backgroundMusicUrl: null,
  
    generationMode: 'ai',
    selectedAiModel: 'veo',
    // FIX: Added missing 'selectedVideoLength' property to satisfy the WorkflowState type.
    selectedVideoLength: 'short-clip',
    visualPrompt: '',
    soundEffects: '',
    isGeneratingVideo: false,
    videoUrl: null,
    audioUrl: null,
    silentVideoUrl: null,
    voiceoverUrl: null,
    scenes: null,
    kineticStyle: { font: 'font-sans', palette: 'black-white', animation: 'highlight', background: '#000000' },
    kineticPreviewReady: false,
    subtitles: null,
    isGeneratingSubtitles: false,
  
    isEditing: false,
    textOverlay: { text: '', position: 'bottom', color: '#FFFFFF' },
