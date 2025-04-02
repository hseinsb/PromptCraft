"use client";

import { useState } from "react";
import { IndustryTemplate, getAllTemplates } from "../data/industryTemplates";

interface IndustrySelectorProps {
  onSelectTemplate: (template: IndustryTemplate | null) => void;
  selectedTemplateId: string | null;
}

export default function IndustrySelector({
  onSelectTemplate,
  selectedTemplateId,
}: IndustrySelectorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const templates = getAllTemplates();

  const selectedTemplate = selectedTemplateId
    ? templates.find((t) => t.id === selectedTemplateId)
    : null;

  const handleSelect = (template: IndustryTemplate) => {
    onSelectTemplate(template);
    setIsOpen(false);
  };

  const handleClear = () => {
    onSelectTemplate(null);
    setIsOpen(false);
  };

  // Add a style block to enforce consistent styling
  const dropdownStyles = `
    /* Force dropdown styling to be consistent */
    .industry-dropdown {
      background-color: #1e293b !important;
      color: white !important;
    }
    
    .dropdown-item {
      background-color: #1e293b !important;
      color: white !important;
    }
    
    .dropdown-item:hover {
      background-color: #2d3748 !important;
    }
    
    .dropdown-container {
      background-color: #1e293b !important;
      border-color: #4b5563 !important;
      box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.5), 0 4px 6px -2px rgba(0, 0, 0, 0.25) !important;
      opacity: 1 !important;
      backdrop-filter: none !important; 
    }
    
    .dropdown-description {
      color: #9ca3af !important;
    }
  `;

  return (
    <div className="mb-4 relative">
      {/* Add global style */}
      <style jsx global>
        {dropdownStyles}
      </style>

      <label className="block text-sm font-medium mb-2 text-white">
        Industry Template (Optional)
      </label>

      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="industry-dropdown w-full flex items-center justify-between p-2 border rounded-md text-left border-gray-600"
      >
        <span>
          {selectedTemplate
            ? selectedTemplate.name
            : "Select an industry template"}
        </span>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className={`h-5 w-5 transform transition-transform ${
            isOpen ? "rotate-180" : ""
          }`}
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path
            fillRule="evenodd"
            d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
            clipRule="evenodd"
          />
        </svg>
      </button>

      {isOpen && (
        <div className="dropdown-container absolute z-50 w-full mt-1 border rounded-md shadow-lg max-h-60 overflow-auto">
          <div className="p-2 border-b border-gray-700">
            <button
              onClick={handleClear}
              className="dropdown-item w-full text-left p-2 rounded"
            >
              No template (custom prompt)
            </button>
          </div>

          <ul>
            {templates.map((template) => (
              <li key={template.id}>
                <button
                  onClick={() => handleSelect(template)}
                  className={`dropdown-item w-full text-left p-2 rounded ${
                    selectedTemplateId === template.id
                      ? "bg-purple-900 text-purple-200"
                      : ""
                  }`}
                >
                  <div className="font-medium">{template.name}</div>
                  <div className="dropdown-description text-sm">
                    {template.description}
                  </div>
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}

      {selectedTemplate && (
        <div className="mt-2 p-3 bg-gray-800 rounded text-sm text-white">
          <p>
            <span className="font-semibold">Role:</span> {selectedTemplate.role}
          </p>
          <p className="mt-1">
            <span className="font-semibold">Goal:</span> {selectedTemplate.goal}
          </p>
          <p className="mt-2 text-gray-400">
            Template will pre-fill the prompt structure based on{" "}
            {selectedTemplate.name} best practices.
          </p>
        </div>
      )}
    </div>
  );
}
