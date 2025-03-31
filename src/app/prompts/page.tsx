"use client";

import { useState, useEffect } from "react";
import { useAuth } from "../../contexts/AuthContext";
import PromptForm from "../../components/PromptForm";
import PromptCard from "../../components/PromptCard";
import Login from "../../components/Login";
import {
  getUserPrompts,
  savePrompt,
  deletePrompt,
  Prompt,
} from "../../services/promptService";
import { nanoid } from "nanoid";

export default function PromptsPage() {
  const { isAuthenticated } = useAuth();
  const [prompts, setPrompts] = useState<Prompt[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [generatedPrompt, setGeneratedPrompt] = useState<Prompt | null>(null);

  useEffect(() => {
    if (isAuthenticated) {
      loadPrompts();
    }
  }, [isAuthenticated]);

  const loadPrompts = async () => {
    if (!isAuthenticated) return;

    try {
      // Instead of loading from Firebase, we'll load from localStorage for simplicity
      const savedPrompts = localStorage.getItem("savedPrompts");
      if (savedPrompts) {
        setPrompts(JSON.parse(savedPrompts));
      }
    } catch (error) {
      console.error("Error loading prompts:", error);
    }
  };

  const handlePromptGenerated = async (promptData: any) => {
    setIsLoading(true);
    try {
      // Create a new prompt with a generated ID
      const newPrompt: Prompt = {
        id: nanoid(),
        title: promptData.title,
        role: promptData.role,
        goal: promptData.goal,
        format: promptData.format,
        context: promptData.context,
        constraints: promptData.constraints,
        style: promptData.style,
        full_prompt: promptData.full_prompt,
        raw_input: promptData.raw_input,
        template_used: promptData.template_used || null,
        userId: "shared", // We now have a single user
        createdAt: new Date(),
      };

      // Set as the currently generated prompt
      setGeneratedPrompt(newPrompt);

      // Add to prompts list
      const updatedPrompts = [newPrompt, ...prompts];
      setPrompts(updatedPrompts);

      // Save to localStorage
      localStorage.setItem("savedPrompts", JSON.stringify(updatedPrompts));
    } catch (error) {
      console.error("Error saving prompt:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeletePrompt = async (promptId: string) => {
    try {
      // Filter out the deleted prompt
      const updatedPrompts = prompts.filter((prompt) => prompt.id !== promptId);
      setPrompts(updatedPrompts);

      // Save to localStorage
      localStorage.setItem("savedPrompts", JSON.stringify(updatedPrompts));

      // If the deleted prompt is the currently displayed one, clear it
      if (generatedPrompt && generatedPrompt.id === promptId) {
        setGeneratedPrompt(null);
      }
    } catch (error) {
      console.error("Error deleting prompt:", error);
    }
  };

  if (!isAuthenticated) {
    return <Login />;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-center mb-8 text-gray-900 dark:text-white">
        Create & Manage Your Prompts
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div>
          <PromptForm
            onPromptGenerated={handlePromptGenerated}
            isLoading={isLoading}
          />

          {generatedPrompt && (
            <div className="mt-8">
              <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">
                Most Recently Generated Prompt
              </h2>
              <PromptCard
                prompt={generatedPrompt}
                onDelete={handleDeletePrompt}
              />
            </div>
          )}
        </div>

        <div>
          <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">
            Your Saved Prompts
          </h2>

          {prompts.length === 0 ? (
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md text-center">
              <p className="text-gray-600 dark:text-gray-300">
                You don't have any saved prompts yet. Create your first one!
              </p>
            </div>
          ) : (
            <div className="space-y-6">
              {prompts.map((prompt) => (
                <PromptCard
                  key={prompt.id}
                  prompt={prompt}
                  onDelete={handleDeletePrompt}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
