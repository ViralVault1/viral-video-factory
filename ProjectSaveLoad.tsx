import React, { useState, useEffect } from 'react';
import { Scene } from '../types';

interface ProjectData {
  id: string;
  name: string;
  script: string;
  scenes: Scene[];
  voiceSettings: {
    voice: string;
    volume: number;
  };
  musicSettings: {
    url: string | null;
    volume: number;
  };
  createdAt: string;
  updatedAt: string;
}

interface ProjectSaveLoadProps {
  currentProject: Partial<ProjectData>;
  onLoadProject: (project: ProjectData) => void;
  onSaveProject: (project: ProjectData) => void;
}

export const ProjectSaveLoad: React.FC<ProjectSaveLoadProps> = ({
  currentProject,
  onLoadProject,
  onSaveProject,
}) => {
  const [savedProjects, setSavedProjects] = useState<ProjectData[]>([]);
  const [showSaveDialog, setShowSaveDialog] = useState(false);
  const [showLoadDialog, setShowLoadDialog] = useState(false);
  const [projectName, setProjectName] = useState('');

  useEffect(() => {
    loadSavedProjects();
  }, []);

  const loadSavedProjects = () => {
    try {
      const saved = localStorage.getItem('savedProjects');
      if (saved) {
        setSavedProjects(JSON.parse(saved));
      }
    } catch (error) {
      console.error('Error loading saved projects:', error);
    }
  };

  const saveProject = () => {
    if (!projectName.trim()) return;

    const project: ProjectData = {
      id: currentProject.id || generateId(),
      name: projectName.trim(),
      script: currentProject.script || '',
      scenes: currentProject.scenes || [],
      voiceSettings: currentProject.voiceSettings || { voice: 'alloy', volume: 0.8 },
      musicSettings: currentProject.musicSettings || { url: null, volume: 0.3 },
      createdAt: currentProject.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    try {
      const existingIndex = savedProjects.findIndex(p => p.id === project.id);
      let updatedProjects;
      
      if (existingIndex >= 0) {
        updatedProjects = [...savedProjects];
        updatedProjects[existingIndex] = project;
      } else {
        updatedProjects = [project, ...savedProjects];
      }

      // Keep only the 10 most recent projects
      updatedProjects = updatedProjects.slice(0, 10);
      
      localStorage.setItem('savedProjects', JSON.stringify(updatedProjects));
      setSavedProjects(updatedProjects);
      onSaveProject(project);
      setShowSaveDialog(false);
      setProjectName('');
    } catch (error) {
      console.error('Error saving project:', error);
      alert('Failed to save project. Please try again.');
    }
  };

  const loadProject = (project: ProjectData) => {
    onLoadProject(project);
    setShowLoadDialog(false);
  };

  const deleteProject = (projectId: string) => {
    if (confirm('Are you sure you want to delete this project?')) {
      const updatedProjects = savedProjects.filter(p => p.id !== projectId);
      localStorage.setItem('savedProjects', JSON.stringify(updatedProjects));
      setSavedProjects(updatedProjects);
    }
  };

  const generateId = () => {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="flex space-x-2">
      {/* Save Button */}
      <button
        onClick={() => setShowSaveDialog(true)}
        className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors flex items-center space-x-2"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3-3m0 0l-3 3m3-3v12" />
        </svg>
        <span>Save</span>
      </button>

      {/* Load Button */}
      <button
        onClick={() => setShowLoadDialog(true)}
        className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors flex items-center space-x-2"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3V10" />
        </svg>
        <span>Load</span>
      </button>

      {/* Save Dialog */}
      {showSaveDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold mb-4">Save Project</h3>
            <input
              type="text"
              value={projectName}
              onChange={(e) => setProjectName(e.target.value)}
              placeholder="Enter project name..."
              className="w-full p-3 border border-gray-300 rounded-lg mb-4 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              autoFocus
            />
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowSaveDialog(false)}
                className="px-4 py-2 text-gray-600 hover:text-gray-800"
              >
                Cancel
              </button>
              <button
                onClick={saveProject}
                disabled={!projectName.trim()}
                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Load Dialog */}
      {showLoadDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[80vh] overflow-hidden">
            <h3 className="text-lg font-semibold mb-4">Load Project</h3>
            
            {savedProjects.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <svg className="w-12 h-12 mx-auto mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <p>No saved projects found</p>
                <p className="text-sm">Create and save a project to see it here</p>
              </div>
            ) : (
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {savedProjects.map((project) => (
                  <div
                    key={project.id}
                    className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-900">{project.name}</h4>
                        <p className="text-sm text-gray-500 mt-1">
                          {project.scenes.length} scenes • Updated {formatDate(project.updatedAt)}
                        </p>
                        {project.script && (
                          <p className="text-sm text-gray-600 mt-2 line-clamp-2">
                            {project.script.substring(0, 100)}...
                          </p>
                        )}
                      </div>
                      <div className="flex items-center space-x-2 ml-4">
                        <button
                          onClick={() => loadProject(project)}
                          className="px-3 py-1 bg-green-500 text-white text-sm rounded hover:bg-green-600 transition-colors"
                        >
                          Load
                        </button>
                        <button
                          onClick={() => deleteProject(project.id)}
                          className="px-3 py-1 bg-red-500 text-white text-sm rounded hover:bg-red-600 transition-colors"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
            
            <div className="flex justify-end mt-6">
              <button
                onClick={() => setShowLoadDialog(false)}
                className="px-4 py-2 text-gray-600 hover:text-gray-800"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

