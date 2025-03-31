"use client";

import { useState, useEffect } from "react";
import { useAuth } from "../../contexts/AuthContext";
import PromptForm from "../../components/PromptForm";
import PromptCard from "../../components/PromptCard";
import Login from "../../components/Login";
import {
  Prompt as FirebasePrompt,
  savePrompt,
  getUserPrompts,
  deletePrompt,
  updatePrompt,
} from "../../services/promptService";
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
interface CustomTimestamp {
  seconds: number;
  nanoseconds: number;
  toDate: () => Date;
  toMillis: () => number;
  isEqual: (other: CustomTimestamp) => boolean;
}

// Extend the firebase Prompt type to allow for Date objects in createdAt
type Prompt = Omit<FirebasePrompt, "createdAt" | "id"> & {
  id?: string;
  createdAt?: Date | Timestamp;
  favorite?: boolean;
};

export default function PromptsPage() {
  const { isAuthenticated } = useAuth();
  const [prompts, setPrompts] = useState<Prompt[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [generatedPrompt, setGeneratedPrompt] = useState<Prompt | null>(null);
  const [firebaseInitialized, setFirebaseInitialized] = useState(false);

  // New state for filters
  const [industryFilter, setIndustryFilter] = useState<string | null>(null);
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [isLoadingPrompts, setIsLoadingPrompts] = useState(false);

  // Get all available industries/templates
  const allTemplates = getAllTemplates();

  // Check Firebase initialization
  useEffect(() => {
    console.log("Checking Firebase initialization...");
    try {
      // Check if Firebase is properly configured by logging the config
      import("../../firebase/config")
        .then((module) => {
          const { db } = module;
          console.log("Firebase Firestore initialized:", !!db);
          console.log(
            "Firebase project ID:",
            process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID
          );
          setFirebaseInitialized(!!db);

          // Once Firebase is initialized, load prompts immediately
          if (!!db && isAuthenticated) {
            loadPrompts();
          }
        })
        .catch((error) => {
          console.error("Firebase initialization error:", error);
          setFirebaseInitialized(false);
        });
    } catch (error) {
      console.error("Firebase import error:", error);
      setFirebaseInitialized(false);
    }
  }, [isAuthenticated]);

  const loadPrompts = async () => {
    if (!isAuthenticated) return;
    setIsLoadingPrompts(true);
    console.log("Starting to load prompts...");

    try {
      // Check if Firebase is initialized before attempting to load
      if (!firebaseInitialized) {
        console.log(
          "Firebase not initialized yet, falling back to localStorage"
        );
        throw new Error("Firebase not initialized");
      }

      // Load from Firebase
      console.log("Attempting to load prompts from Firebase...");
      const loadedPrompts = await getUserPrompts("shared");
      console.log(
        "Prompts loaded from Firebase:",
        loadedPrompts.length ? loadedPrompts.length : "none",
        loadedPrompts
      );

      if (loadedPrompts && loadedPrompts.length > 0) {
        // Ensure the loaded prompts have the correct structure
        const formattedPrompts = loadedPrompts.map((prompt) => {
          // Ensure we're working with a clean object
          const cleanPrompt = {
            id: prompt.id || nanoid(),
            title: prompt.title || "",
            role: prompt.role || "",
            goal: prompt.goal || "",
            format: prompt.format || "",
            context: prompt.context || "",
            constraints: prompt.constraints || "",
            style: prompt.style || "",
            full_prompt: prompt.full_prompt || "",
            raw_input: prompt.raw_input || "",
            template_used: prompt.template_used || null,
            userId: prompt.userId || "shared",
            favorite:
              typeof prompt.favorite === "boolean" ? prompt.favorite : false,
            // Handle createdAt specially
            createdAt: prompt.createdAt || new Date(),
          };
          return cleanPrompt;
        });

        console.log("Formatted prompts:", formattedPrompts);
        setPrompts(formattedPrompts);
      } else {
        console.log("No prompts loaded from Firebase");
        setPrompts([]);
      }
    } catch (error) {
      console.error("Error loading prompts from Firebase:", error);
      // Fallback to localStorage if Firebase fails
      console.log("Falling back to localStorage...");
      const savedPrompts = localStorage.getItem("savedPrompts");
      if (savedPrompts) {
        console.log("Found prompts in localStorage");
        setPrompts(JSON.parse(savedPrompts));
      } else {
        console.log("No prompts found in localStorage either");
        setPrompts([]);
      }
    } finally {
      setIsLoadingPrompts(false);
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
      console.log("Creating new prompt and saving to Firebase...");

      // Only try to save to Firebase if it's initialized
      if (firebaseInitialized) {
        // Save to Firebase first
        console.log("Saving to Firebase with savePrompt function...");
        try {
          // Create a prompt object without ID for Firebase
          const promptToSave = {
            title: promptData.raw_input,
            role: promptData.role || "",
            goal: promptData.goal || "",
            format: promptData.format || "",
            context: promptData.context || "",
            constraints: promptData.constraints || "",
            style: promptData.style || "",
            full_prompt: promptData.full_prompt,
            raw_input: promptData.raw_input,
            template_used: promptData.template_used || null,
            userId: "shared",
            favorite: false,
          };

          // Save to Firestore and get the ID
          const savedId = await savePrompt(promptToSave);
          console.log("Successfully saved to Firebase with ID:", savedId);

          if (!savedId) {
            throw new Error("Failed to get ID from Firebase");
          }

          // Create new prompt with the Firebase ID
          const newPrompt: Prompt = {
            ...promptToSave,
            id: savedId,
            createdAt: new Date(), // Add local timestamp for immediate display
          };

          // Set as the current generated prompt
          setGeneratedPrompt(newPrompt);

          // Add to the prompts list directly
          setPrompts((prev) => [newPrompt, ...prev]);

          // No need to reload all prompts - we already have all the data
          console.log("Prompt saved and added to state:", newPrompt);
        } catch (firebaseError) {
          console.error("Firebase save error:", firebaseError);
          throw firebaseError;
        }
      } else {
        console.log("Firebase not initialized, falling back to localStorage");
        throw new Error("Firebase not initialized");
      }
    } catch (error) {
      console.error("Error saving prompt:", error);

      // Fallback to local storage if Firebase fails
      const newPrompt: Prompt = {
        id: nanoid(),
        title: promptData.raw_input,
        role: promptData.role || "",
        goal: promptData.goal || "",
        format: promptData.format || "",
        context: promptData.context || "",
        constraints: promptData.constraints || "",
        style: promptData.style || "",
        full_prompt: promptData.full_prompt,
        raw_input: promptData.raw_input,
        template_used: promptData.template_used || null,
        userId: "shared",
        createdAt: new Date(),
        favorite: false,
      };

      // Set as the currently generated prompt
      setGeneratedPrompt(newPrompt);

      // Add to prompts list
      const updatedPrompts = [newPrompt, ...prompts];
      setPrompts(updatedPrompts);

      // Save to localStorage as fallback
      localStorage.setItem("savedPrompts", JSON.stringify(updatedPrompts));
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeletePrompt = async (promptId: string) => {
    try {
      console.log("Deleting prompt with ID:", promptId);

      // Check if Firebase is initialized before attempting to delete
      if (!firebaseInitialized) {
        console.log(
          "Firebase not initialized yet, falling back to localStorage"
        );
        throw new Error("Firebase not initialized");
      }

      // Delete from Firebase
      console.log("Deleting prompt from Firebase:", promptId);
      await deletePrompt(promptId);
      console.log("Successfully deleted from Firebase");

      // Update local state
      const updatedPrompts = prompts.filter((prompt) => prompt.id !== promptId);
      setPrompts(updatedPrompts);

      // If the deleted prompt is the currently displayed one, clear it
      if (generatedPrompt && generatedPrompt.id === promptId) {
        setGeneratedPrompt(null);
      }

      // Force reload prompts from Firebase
      await loadPrompts();
    } catch (error) {
      console.error("Error deleting prompt from Firebase:", error);

      // Fallback to local update if Firebase fails
      const updatedPrompts = prompts.filter((prompt) => prompt.id !== promptId);
      setPrompts(updatedPrompts);
      localStorage.setItem("savedPrompts", JSON.stringify(updatedPrompts));

      if (generatedPrompt && generatedPrompt.id === promptId) {
        setGeneratedPrompt(null);
      }
    }
  };

  // Function to handle toggling favorites
  const handleToggleFavorite = async (
    promptId: string,
    isFavorite: boolean
  ) => {
    try {
      // Check if Firebase is initialized before attempting to update
      if (!firebaseInitialized) {
        console.log(
          "Firebase not initialized yet, falling back to localStorage"
        );
        throw new Error("Firebase not initialized");
      }

      // Update in Firebase
      console.log(
        "Updating favorite status in Firebase:",
        promptId,
        isFavorite
      );
      await updatePrompt(promptId, { favorite: isFavorite });
      console.log("Successfully updated favorite status in Firebase");

      // Update local state immediately for a responsive UI
      const updatedPrompts = prompts.map((prompt) =>
        prompt.id === promptId ? { ...prompt, favorite: isFavorite } : prompt
      );
      setPrompts(updatedPrompts);

      // Update the generated prompt if it's the same one
      if (generatedPrompt && generatedPrompt.id === promptId) {
        setGeneratedPrompt({ ...generatedPrompt, favorite: isFavorite });
      }

      // Reload prompts from Firebase to ensure consistent state
      await loadPrompts();
    } catch (error) {
      console.error("Error updating favorite status in Firebase:", error);

      // Fallback to local update if Firebase fails
      const updatedPrompts = prompts.map((prompt) =>
        prompt.id === promptId ? { ...prompt, favorite: isFavorite } : prompt
      );
      setPrompts(updatedPrompts);
      localStorage.setItem("savedPrompts", JSON.stringify(updatedPrompts));

      if (generatedPrompt && generatedPrompt.id === promptId) {
        setGeneratedPrompt({ ...generatedPrompt, favorite: isFavorite });
      }
    }
  };

  // Apply filters to get filtered prompts
  const filteredPrompts = prompts
    .filter((prompt) => !!prompt.id) // Only include prompts with valid IDs
    .filter((prompt) => {
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
                prompt={generatedPrompt as FirebasePrompt}
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

          {isLoadingPrompts ? (
            <div className="bg-[#1E1E3F] p-6 rounded-lg shadow-md text-center border border-gray-700">
              <svg
                className="animate-spin h-8 w-8 text-purple-400 mx-auto mb-3"
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
              <p className="text-gray-300">Loading your prompts...</p>
            </div>
          ) : filteredPrompts.length === 0 ? (
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
                  prompt={prompt as FirebasePrompt}
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
