"use client";

import { useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import IndustrySelector from "./IndustrySelector";
import { IndustryTemplate } from "../data/industryTemplates";
import { FiZap, FiSend, FiAlertCircle } from "react-icons/fi";

interface PromptFormProps {
  onPromptGenerated: (promptData: {
    full_prompt: string;
    role?: string;
    goal?: string;
    format?: string;
    context?: string;
    constraints?: string;
    style?: string;
    raw_input: string;
    template_used?: string | null;
  }) => void;
  isLoading: boolean;
}

export default function PromptForm({
  onPromptGenerated,
  isLoading,
}: PromptFormProps) {
  const [userInput, setUserInput] = useState("");
  const [error, setError] = useState("");
  const [selectedTemplate, setSelectedTemplate] =
    useState<IndustryTemplate | null>(null);
  const { isAuthenticated } = useAuth();
  const [isFocused, setIsFocused] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!userInput.trim()) {
      setError("Please enter a prompt description");
      return;
    }

    if (!isAuthenticated) {
      setError("You must be logged in to generate a prompt");
      return;
    }

    setError("");

    try {
      const response = await fetch("/api/generate-prompt", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userInput,
          templateId: selectedTemplate?.id || null,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to generate prompt");
      }

      const data = await response.json();
      onPromptGenerated({
        ...data,
        raw_input: userInput,
        template_used: selectedTemplate?.name || null,
      });

      // Clear the input after successful generation
      setUserInput("");
    } catch (error) {
      console.error("Error generating prompt:", error);
      setError(
        error instanceof Error ? error.message : "An unknown error occurred"
      );
    }
  };

  const handleSelectTemplate = (template: IndustryTemplate | null) => {
    setSelectedTemplate(template);
  };

  return (
    <div className="w-full max-w-3xl mx-auto p-6 bg-[#1E1E3F] rounded-xl shadow-lg transition-all duration-300 hover:shadow-xl border border-gray-700">
      <div className="flex items-center space-x-3 mb-4">
        <div className="p-2.5 bg-purple-900/30 rounded-full">
          <FiZap className="text-purple-400 text-xl" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-white">
            Perfect Prompt Creator
          </h2>
          <p className="text-gray-300">
            Let AI transform your ideas into structured prompts
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <IndustrySelector
          onSelectTemplate={handleSelectTemplate}
          selectedTemplateId={selectedTemplate?.id || null}
        />

        <div className="transition-all duration-200">
          <label
            htmlFor="userInput"
            className="block mb-2 text-sm font-medium text-gray-300 flex items-center"
          >
            <FiSend className="mr-2 text-purple-400" size={14} />
            Your Prompt Description
          </label>
          <div
            className={`relative rounded-lg overflow-hidden ${
              isFocused
                ? "ring-2 ring-purple-500 ring-opacity-50"
                : "border border-gray-600"
            }`}
          >
            <textarea
              id="userInput"
              className="w-full p-4 outline-none bg-gray-800 text-gray-100 transition-colors duration-200 resize-none border-0"
              placeholder={
                selectedTemplate
                  ? `e.g., I need a ${selectedTemplate.name.toLowerCase()} prompt about...`
                  : "e.g., I want to create a hiking guide for San Francisco"
              }
              rows={5}
              value={userInput}
              onChange={(e) => setUserInput(e.target.value)}
              disabled={isLoading}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
            />
            {userInput && !isLoading && (
              <span className="absolute bottom-3 right-3 text-xs text-gray-400">
                {userInput.length} characters
              </span>
            )}
          </div>
        </div>

        {error && (
          <div className="flex items-center text-red-400 text-sm p-3 bg-red-900/20 rounded-lg border border-red-800 animate-fadeIn">
            <FiAlertCircle className="mr-2 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <button
          type="submit"
          className="w-full py-3.5 px-4 bg-purple-600 hover:bg-purple-700 active:bg-purple-800 text-white font-medium rounded-lg transition-all duration-300 transform hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0 flex items-center justify-center shadow-md hover:shadow-lg"
          disabled={isLoading || !userInput.trim()}
        >
          {isLoading ? (
            <div className="flex items-center">
              <svg
                className="animate-spin mr-3 h-5 w-5 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              <span className="animate-pulse">Generating your prompt...</span>
            </div>
          ) : (
            <>
              <FiZap className="mr-2" /> Generate Perfect Prompt
            </>
          )}
        </button>

        {selectedTemplate && (
          <div className="text-sm text-purple-400 text-center p-3 bg-purple-900/20 rounded-lg border border-purple-800/30 transition-all duration-200 animate-fadeIn flex items-center justify-center">
            <FiZap className="mr-2" />
            Using{" "}
            <span className="font-semibold mx-1">
              {selectedTemplate.name}
            </span>{" "}
            template
          </div>
        )}
      </form>
    </div>
  );
}
