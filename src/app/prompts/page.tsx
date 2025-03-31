"use client";

import { useState, useEffect } from "react";
import { useAuth } from "../../contexts/AuthContext";
import PromptForm from "../../components/PromptForm";
import PromptCard from "../../components/PromptCard";
import Login from "../../components/Login";
import { Prompt as FirebasePrompt } from "../../services/promptService";
import { nanoid } from "nanoid";
import { FiFilter, FiStar, FiX } from "react-icons/fi";
import { getAllTemplates } from "../../data/industryTemplates";
import { Timestamp } from "firebase/firestore";

// Create a type for prompt data (keeping for reference)
// eslint-disable-next-line @typescript-eslint/no-unused-vars
interface PromptData {
  title: string;
  role: string;
  goal: string;
  format: string;
  context: string;
  constraints: string;
  style: string;
  full_prompt: string;
  raw_input: string;
  template_used?: string | null;
}

// Create a type for Timestamp
interface Timestamp {
  seconds: number;
  nanoseconds: number;
  toDate: () => Date;
  toMillis: () => number;
  isEqual: (other: Timestamp) => boolean;
}

// Extend the firebase Prompt type to allow for Date objects in createdAt
type Prompt = Omit<FirebasePrompt, "createdAt"> & {
  createdAt?: Date | Timestamp;
};

export default function PromptsPage() {
  const { isAuthenticated } = useAuth();
  const [prompts, setPrompts] = useState<Prompt[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [generatedPrompt, setGeneratedPrompt] = useState<Prompt | null>(null);

  // New state for filters
  const [industryFilter, setIndustryFilter] = useState<string | null>(null);
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);
  const [showFilters, setShowFilters] = useState(false);

  // Get all available industries/templates
  const allTemplates = getAllTemplates();

  useEffect(() => {
    if (isAuthenticated) {
      loadPrompts();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
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

  const handlePromptGenerated = async (promptData: {
    full_prompt: string;
    role?: string;
    goal?: string;
    format?: string;
    context?: string;
    constraints?: string;
    style?: string;
    raw_input: string;
    template_used?: string | null;
  }) => {
    setIsLoading(true);
    try {
      // Create a new prompt with a generated ID
      const newPrompt: Prompt = {
        id: nanoid(),
        title:
          promptData.raw_input.slice(0, 50) +
          (promptData.raw_input.length > 50 ? "..." : ""),
        role: promptData.role || "",
        goal: promptData.goal || "",
        format: promptData.format || "",
        context: promptData.context || "",
        constraints: promptData.constraints || "",
        style: promptData.style || "",
        full_prompt: promptData.full_prompt,
        raw_input: promptData.raw_input,
        template_used: promptData.template_used || null,
        userId: "shared", // We now have a single user
        createdAt: new Date(), // This will be stored as a Date object
        favorite: false, // New prompts are not favorites by default
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

  // New function to handle toggling favorites
  const handleToggleFavorite = async (
    promptId: string,
    isFavorite: boolean
  ) => {
    try {
      // Update the prompt in the list
      const updatedPrompts = prompts.map((prompt) =>
        prompt.id === promptId ? { ...prompt, favorite: isFavorite } : prompt
      );
      setPrompts(updatedPrompts);

      // Update the generated prompt if it's the same one
      if (generatedPrompt && generatedPrompt.id === promptId) {
        setGeneratedPrompt({ ...generatedPrompt, favorite: isFavorite });
      }

      // Save to localStorage
      localStorage.setItem("savedPrompts", JSON.stringify(updatedPrompts));
    } catch (error) {
      console.error("Error updating favorite status:", error);
    }
  };

  // Apply filters to get filtered prompts
  const filteredPrompts = prompts.filter((prompt) => {
    // Filter by industry if an industry filter is selected
    const matchesIndustry =
      !industryFilter ||
      prompt.template_used === industryFilter ||
      prompt.template_used ===
        allTemplates.find((t) => t.id === industryFilter)?.name;

    // Filter by favorites if the favorites filter is enabled
    const matchesFavorite = !showFavoritesOnly || prompt.favorite === true;

    return matchesIndustry && matchesFavorite;
  });

  // Toggle filters visibility
  const toggleFilters = () => {
    setShowFilters(!showFilters);
  };

  // Reset all filters
  const resetFilters = () => {
    setIndustryFilter(null);
    setShowFavoritesOnly(false);
  };

  if (!isAuthenticated) {
    return <Login />;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-center mb-8 text-white">
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
              <h2 className="text-xl font-bold mb-4 text-white">
                Most Recently Generated Prompt
              </h2>
              <PromptCard
                prompt={{
                  ...generatedPrompt,
                  createdAt: generatedPrompt.createdAt instanceof Timestamp ? generatedPrompt.createdAt.toDate().toJSON() : new Date().toJSON()
                }}
                onDelete={handleDeletePrompt}
                onToggleFavorite={handleToggleFavorite}
              />
            </div>
          )}
        </div>

        <div>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-white">Your Saved Prompts</h2>

            <button
              onClick={toggleFilters}
              className="flex items-center text-purple-400 hover:text-purple-300 transition-all p-2 rounded-lg hover:bg-purple-900/20"
            >
              <FiFilter className="mr-1" />
              Filters
            </button>
          </div>

          {/* Filters section */}
          {showFilters && (
            <div className="bg-[#1E1E3F] p-4 rounded-lg border border-gray-700 mb-6 animate-fadeIn">
              <div className="flex justify-between items-center mb-3">
                <h3 className="font-semibold text-white">Filter Prompts</h3>
                <button
                  onClick={resetFilters}
                  className="text-sm text-purple-400 hover:text-purple-300"
                >
                  Reset
                </button>
              </div>

              <div className="space-y-4">
                {/* Industry filter */}
                <div>
                  <label className="block text-sm text-gray-300 mb-2">
                    Industry
                  </label>
                  <select
                    value={industryFilter || ""}
                    onChange={(e) => setIndustryFilter(e.target.value || null)}
                    className="w-full p-2 rounded bg-gray-800 text-white border border-gray-700"
                  >
                    <option value="">All Industries</option>
                    {allTemplates.map((template) => (
                      <option key={template.id} value={template.id}>
                        {template.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Favorites filter */}
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="favorites-filter"
                    checked={showFavoritesOnly}
                    onChange={() => setShowFavoritesOnly(!showFavoritesOnly)}
                    className="mr-2 h-4 w-4"
                  />
                  <label
                    htmlFor="favorites-filter"
                    className="text-gray-300 flex items-center"
                  >
                    <FiStar className="mr-1 text-yellow-400" />
                    Favorites only
                  </label>
                </div>
              </div>

              {/* Active filters display */}
              {(industryFilter || showFavoritesOnly) && (
                <div className="mt-4 pt-3 border-t border-gray-700">
                  <div className="text-sm text-gray-400 mb-2">
                    Active filters:
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {industryFilter && (
                      <div className="flex items-center bg-purple-900/30 text-purple-300 px-2 py-1 rounded-full text-xs">
                        {
                          allTemplates.find((t) => t.id === industryFilter)
                            ?.name
                        }
                        <button
                          onClick={() => setIndustryFilter(null)}
                          className="ml-1 text-purple-300 hover:text-purple-200"
                        >
                          <FiX size={14} />
                        </button>
                      </div>
                    )}
                    {showFavoritesOnly && (
                      <div className="flex items-center bg-yellow-900/30 text-yellow-300 px-2 py-1 rounded-full text-xs">
                        Favorites
                        <button
                          onClick={() => setShowFavoritesOnly(false)}
                          className="ml-1 text-yellow-300 hover:text-yellow-200"
                        >
                          <FiX size={14} />
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}

          {filteredPrompts.length === 0 ? (
            <div className="bg-[#1E1E3F] p-6 rounded-lg shadow-md text-center border border-gray-700">
              <p className="text-gray-300">
                {prompts.length === 0
                  ? "You don't have any saved prompts yet. Create your first one!"
                  : "No prompts match your current filters."}
              </p>
            </div>
          ) : (
            <div className="space-y-6">
              {filteredPrompts.map((prompt) => (
                <PromptCard
                  key={prompt.id}
                  prompt={prompt}
                  onDelete={handleDeletePrompt}
                  onToggleFavorite={handleToggleFavorite}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
