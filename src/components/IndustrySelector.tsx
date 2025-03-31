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

  return (
    <div className="mb-4 relative">
      <label className="block text-sm font-medium mb-2">
        Industry Template (Optional)
      </label>

      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-2 border rounded-md bg-white dark:bg-gray-700 text-left text-gray-800 dark:text-gray-200"
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
        <div className="absolute z-10 w-full mt-1 bg-white dark:bg-gray-800 border rounded-md shadow-lg max-h-60 overflow-auto">
          <div className="p-2 border-b dark:border-gray-700">
            <button
              onClick={handleClear}
              className="w-full text-left p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
            >
              No template (custom prompt)
            </button>
          </div>

          <ul>
            {templates.map((template) => (
              <li key={template.id}>
                <button
                  onClick={() => handleSelect(template)}
                  className={`w-full text-left p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded ${
                    selectedTemplateId === template.id
                      ? "bg-purple-100 dark:bg-purple-900"
                      : ""
                  }`}
                >
                  <div className="font-medium">{template.name}</div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">
                    {template.description}
                  </div>
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}

      {selectedTemplate && (
        <div className="mt-2 p-3 bg-purple-50 dark:bg-gray-700 rounded text-sm">
          <p>
            <span className="font-semibold">Role:</span> {selectedTemplate.role}
          </p>
          <p className="mt-1">
            <span className="font-semibold">Goal:</span> {selectedTemplate.goal}
          </p>
          <p className="mt-2 text-gray-500 dark:text-gray-400">
            Template will pre-fill the prompt structure based on{" "}
            {selectedTemplate.name} best practices.
          </p>
        </div>
      )}
    </div>
  );
}
