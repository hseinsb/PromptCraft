"use client";

import { useState } from "react";
import { Prompt } from "../services/promptService";
import { Timestamp } from "firebase/firestore";
import {
  FiCopy,
  FiTrash,
  FiChevronDown,
  FiChevronUp,
  FiTag,
  FiZap,
  FiCheck,
  FiStar,
} from "react-icons/fi";

interface PromptCardProps {
  prompt: Prompt;
  onDelete: (id: string) => void;
  onToggleFavorite?: (id: string, favorite: boolean) => void;
}

export default function PromptCard({
  prompt,
  onDelete,
  onToggleFavorite,
}: PromptCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [copied, setCopied] = useState(false);
  const [isDeleteConfirming, setIsDeleteConfirming] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(prompt.full_prompt);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDeleteClick = () => {
    if (isDeleteConfirming) {
      if (prompt.id) {
        onDelete(prompt.id);
      } else {
        console.error("Cannot delete prompt: Missing ID");
      }
      setIsDeleteConfirming(false);
    } else {
      setIsDeleteConfirming(true);
      // Auto reset after 3 seconds
      setTimeout(() => setIsDeleteConfirming(false), 3000);
    }
  };

  const handleFavoriteClick = () => {
    if (onToggleFavorite && prompt.id) {
      onToggleFavorite(prompt.id, !prompt.favorite);
    } else if (!prompt.id) {
      console.error("Cannot toggle favorite: Missing ID");
    }
  };

  const formatDate = (
    timestamp:
      | Date
      | Timestamp
      | { toDate: () => Date }
      | string
      | number
      | null
      | undefined
  ) => {
    if (!timestamp) return "";

    try {
      let date: Date;

      if (timestamp instanceof Date) {
        date = timestamp;
      } else if (
        timestamp instanceof Timestamp ||
        (typeof timestamp === "object" && "toDate" in timestamp)
      ) {
        date = timestamp.toDate();
      } else if (
        typeof timestamp === "string" ||
        typeof timestamp === "number"
      ) {
        date = new Date(timestamp);
      } else {
        // Default fallback
        console.log("Unknown timestamp format:", timestamp);
        return "";
      }

      return date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      });
    } catch (err) {
      console.error("Error formatting date:", err, "for timestamp:", timestamp);
      return "";
    }
  };

  // Helper function to check if a field is empty or just whitespace
  const isEmpty = (str: string | undefined | null): boolean => {
    return !str || str.trim() === "";
  };

  // Safely access properties to prevent errors
  const safePrompt = {
    id: prompt.id || "",
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
    createdAt: prompt.createdAt,
    userId: prompt.userId || "",
    favorite: typeof prompt.favorite === "boolean" ? prompt.favorite : false,
  };

  // Only show fields with actual content
  const hasDetails =
    !isEmpty(safePrompt.format) ||
    !isEmpty(safePrompt.context) ||
    !isEmpty(safePrompt.constraints) ||
    !isEmpty(safePrompt.style);

  const hasRoleGoal = !isEmpty(safePrompt.role) || !isEmpty(safePrompt.goal);

  return (
    <div className="bg-[#1E1E3F] rounded-xl shadow-md overflow-hidden transition-all duration-300 hover:shadow-lg border border-gray-700">
      <div className="p-6">
        {/* Header */}
        <div className="flex justify-between items-start mb-4">
          <div className="max-w-[80%]">
            <h3 className="text-xl font-bold text-white break-words text-wrap group-hover:text-purple-400 transition-colors duration-200 overflow-hidden">
              {!isEmpty(safePrompt.title)
                ? safePrompt.title
                : "Untitled Prompt"}
            </h3>
            <div className="flex flex-wrap items-center mt-1 gap-2">
              {safePrompt.template_used && (
                <div className="flex items-center text-xs text-purple-400 bg-purple-900/20 px-2 py-0.5 rounded-full">
                  <FiTag className="mr-1" size={10} />
                  <span>{safePrompt.template_used}</span>
                </div>
              )}
              {formatDate(safePrompt.createdAt) && (
                <span className="text-xs text-gray-400">
                  {formatDate(safePrompt.createdAt)}
                </span>
              )}
            </div>
          </div>
          <div className="flex items-center space-x-2 flex-shrink-0">
            {onToggleFavorite && (
              <button
                onClick={handleFavoriteClick}
                className={`text-gray-400 hover:text-yellow-400 transition-colors p-2 rounded-full hover:bg-yellow-900/20 ${
                  safePrompt.favorite ? "text-yellow-400 bg-yellow-900/20" : ""
                }`}
                aria-label={
                  safePrompt.favorite
                    ? "Remove from favorites"
                    : "Add to favorites"
                }
              >
                <FiStar size={18} />
              </button>
            )}
            <button
              onClick={handleCopy}
              className="text-gray-400 hover:text-blue-400 transition-colors p-2 rounded-full hover:bg-blue-900/20 relative"
              aria-label="Copy prompt"
            >
              {copied ? (
                <FiCheck size={18} className="text-green-400" />
              ) : (
                <FiCopy size={18} />
              )}
              {copied && (
                <span className="absolute top-full left-1/2 transform -translate-x-1/2 mt-1 text-xs bg-black text-white px-2 py-1 rounded animate-fadeIn z-10">
                  Copied!
                </span>
              )}
            </button>
            <button
              onClick={handleDeleteClick}
              className={`text-gray-400 hover:text-red-400 transition-colors p-2 rounded-full hover:bg-red-900/20 relative ${
                isDeleteConfirming ? "bg-red-900/20 text-red-400" : ""
              }`}
              aria-label="Delete prompt"
            >
              <FiTrash size={18} />
              {isDeleteConfirming && (
                <span className="absolute top-full right-0 mt-1 text-xs bg-red-500 text-white px-2 py-1 rounded animate-fadeIn z-10 whitespace-nowrap">
                  Click again to confirm
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Main content - Roles and Goals if available */}
        {hasRoleGoal && (
          <div className="mt-3 grid grid-cols-1 md:grid-cols-2 gap-4">
            {!isEmpty(safePrompt.role) && (
              <div className="bg-gradient-to-br from-gray-800 to-purple-900/30 p-4 rounded-lg shadow-sm border border-purple-900/30">
                <h4 className="text-sm uppercase font-semibold text-purple-400 flex items-center mb-2">
                  <FiZap className="mr-1" size={14} /> Role
                </h4>
                <div className="text-gray-200 text-sm">{safePrompt.role}</div>
              </div>
            )}

            {!isEmpty(safePrompt.goal) && (
              <div className="bg-gradient-to-br from-gray-800 to-purple-900/30 p-4 rounded-lg shadow-sm border border-purple-900/30">
                <h4 className="text-sm uppercase font-semibold text-purple-400 flex items-center mb-2">
                  <FiZap className="mr-1" size={14} /> Goal
                </h4>
                <div className="text-gray-200 text-sm">{safePrompt.goal}</div>
              </div>
            )}
          </div>
        )}

        {/* Full prompt preview - always visible */}
        <div className="mt-4 p-4 bg-gradient-to-r from-gray-800 to-purple-900/20 rounded-lg border border-purple-900/30">
          <div
            className={`text-gray-200 text-sm ${
              !isExpanded ? "line-clamp-3" : ""
            }`}
          >
            {!isExpanded ? safePrompt.full_prompt : null}
          </div>
          {!isExpanded && safePrompt.full_prompt.length > 300 && (
            <div className="mt-2 text-xs text-purple-400">
              Expand to see full prompt...
            </div>
          )}
        </div>

        {/* Expanded section */}
        {isExpanded && (
          <div className="mt-4 space-y-4 animate-fadeIn">
            {/* Remaining fields - only if they have content */}
            {hasDetails && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {!isEmpty(safePrompt.format) && (
                  <div className="bg-gray-800 p-4 rounded-lg border border-gray-700">
                    <h4 className="text-sm uppercase font-semibold text-gray-300 mb-2">
                      Format
                    </h4>
                    <div className="text-gray-200 text-sm">
                      {safePrompt.format}
                    </div>
                  </div>
                )}

                {!isEmpty(safePrompt.context) && (
                  <div className="bg-gray-800 p-4 rounded-lg border border-gray-700">
                    <h4 className="text-sm uppercase font-semibold text-gray-300 mb-2">
                      Context
                    </h4>
                    <div className="text-gray-200 text-sm">
                      {safePrompt.context}
                    </div>
                  </div>
                )}

                {!isEmpty(safePrompt.constraints) && (
                  <div className="bg-gray-800 p-4 rounded-lg border border-gray-700">
                    <h4 className="text-sm uppercase font-semibold text-gray-300 mb-2">
                      Constraints
                    </h4>
                    <div className="text-gray-200 text-sm">
                      {safePrompt.constraints}
                    </div>
                  </div>
                )}

                {!isEmpty(safePrompt.style) && (
                  <div className="bg-gray-800 p-4 rounded-lg border border-gray-700">
                    <h4 className="text-sm uppercase font-semibold text-gray-300 mb-2">
                      Style
                    </h4>
                    <div className="text-gray-200 text-sm">
                      {safePrompt.style}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Full prompt */}
            <div className="p-4 bg-gray-800 rounded-lg border border-gray-700">
              <h4 className="text-sm uppercase font-semibold text-gray-300 mb-2">
                Full Prompt
              </h4>
              <div className="text-gray-200 whitespace-pre-wrap text-sm border-l-2 border-purple-700 pl-3">
                {safePrompt.full_prompt}
              </div>
            </div>

            {/* Original input */}
            <div className="p-4 bg-gray-800 rounded-lg border border-gray-700">
              <h4 className="text-sm uppercase font-semibold text-gray-300 mb-2">
                Original Input
              </h4>
              <div className="text-gray-200 text-sm italic">
                &quot;{safePrompt.raw_input}&quot;
              </div>
            </div>
          </div>
        )}

        {/* Expand/collapse button */}
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="mt-4 w-full flex items-center justify-center text-purple-400 hover:text-purple-300 transition-all duration-200 p-2 rounded-lg hover:bg-purple-900/20 border border-transparent hover:border-purple-900/30"
        >
          {isExpanded ? (
            <>
              <FiChevronUp className="mr-2 transition-transform duration-200" />
              Show Less
            </>
          ) : (
            <>
              <FiChevronDown className="mr-2 transition-transform duration-200" />
              Show Details
            </>
          )}
        </button>
      </div>
    </div>
  );
}
