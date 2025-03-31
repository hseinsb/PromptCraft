"use client";

import { useState } from "react";
import { FiChevronDown, FiChevronUp, FiDownload } from "react-icons/fi";

export default function Secret() {
  const [expandedSection, setExpandedSection] = useState<string | null>(null);

  const toggleSection = (section: string) => {
    if (expandedSection === section) {
      setExpandedSection(null);
    } else {
      setExpandedSection(section);
    }
  };

  const handleDownloadPDF = () => {
    // In a real app, this would generate or download a PDF
    alert("In a real app, this would download a PDF of the prompt formula.");
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-[#1E1E3F] rounded-xl shadow-lg border border-gray-700">
      <h1 className="text-3xl font-bold text-center mb-6 text-purple-400">
        The Secret of the Perfect Prompt
      </h1>

      <div className="mb-8 text-center">
        <p className="text-lg text-gray-300">
          Master this formula to consistently outperform 99% of AI users
        </p>

        <div className="mt-4 p-4 bg-gradient-to-r from-purple-900/20 to-purple-900/10 rounded-lg inline-block border border-purple-900/30">
          <h2 className="text-xl font-bold text-purple-300">
            The Universal Prompt Formula
          </h2>
          <div className="mt-2 text-lg font-mono text-gray-200">
            ROLE + GOAL + FORMAT + CONTEXT + CONSTRAINTS + STYLE
          </div>
        </div>
      </div>

      <div className="space-y-4">
        {/* Role Section */}
        <div className="border border-gray-700 rounded-lg overflow-hidden">
          <button
            className="w-full p-4 text-left flex justify-between items-center focus:outline-none bg-gray-800"
            onClick={() => toggleSection("role")}
          >
            <h3 className="text-xl font-semibold text-gray-200">[ROLE]</h3>
            {expandedSection === "role" ? (
              <FiChevronUp className="text-purple-400" />
            ) : (
              <FiChevronDown className="text-purple-400" />
            )}
          </button>

          {expandedSection === "role" && (
            <div className="p-4 bg-[#1E1E3F]">
              <p className="mb-3 text-gray-300">
                Defines who or what the AI should behave as.
              </p>
              <div className="space-y-2">
                <div className="p-2 bg-gray-800 rounded border border-gray-700">
                  "Act as a senior backend developer."
                </div>
                <div className="p-2 bg-gray-800 rounded border border-gray-700">
                  "Act as a cinematic film director."
                </div>
                <div className="p-2 bg-gray-800 rounded border border-gray-700">
                  "Act as my personal argument coach."
                </div>
              </div>
              <p className="mt-3 text-gray-400 italic">
                This makes the LLM narrow its data pool to the kind of
                information that fits that role.
              </p>
            </div>
          )}
        </div>

        {/* Goal Section */}
        <div className="border border-gray-700 rounded-lg overflow-hidden">
          <button
            className="w-full p-4 text-left flex justify-between items-center focus:outline-none bg-gray-800"
            onClick={() => toggleSection("goal")}
          >
            <h3 className="text-xl font-semibold text-gray-200">[GOAL]</h3>
            {expandedSection === "goal" ? (
              <FiChevronUp className="text-purple-400" />
            ) : (
              <FiChevronDown className="text-purple-400" />
            )}
          </button>

          {expandedSection === "goal" && (
            <div className="p-4 bg-[#1E1E3F]">
              <p className="mb-3 text-gray-300">Describes the task clearly.</p>
              <div className="space-y-2">
                <div className="p-2 bg-gray-800 rounded border border-gray-700">
                  "Find the top 5 scenic medium-length hikes near San
                  Francisco."
                </div>
                <div className="p-2 bg-gray-800 rounded border border-gray-700">
                  "Debug the following Python code."
                </div>
                <div className="p-2 bg-gray-800 rounded border border-gray-700">
                  "Analyze the logical structure of my philosophical argument."
                </div>
              </div>
              <p className="mt-3 text-gray-400 italic">
                The goal tells the model: "What am I supposed to actually give
                you?"
              </p>
            </div>
          )}
        </div>

        {/* Format Section */}
        <div className="border border-gray-700 rounded-lg overflow-hidden">
          <button
            className="w-full p-4 text-left flex justify-between items-center focus:outline-none bg-gray-800"
            onClick={() => toggleSection("format")}
          >
            <h3 className="text-xl font-semibold text-gray-200">[FORMAT]</h3>
            {expandedSection === "format" ? (
              <FiChevronUp className="text-purple-400" />
            ) : (
              <FiChevronDown className="text-purple-400" />
            )}
          </button>

          {expandedSection === "format" && (
            <div className="p-4 bg-[#1E1E3F]">
              <p className="mb-3 text-gray-300">
                Structures the output exactly how you want.
              </p>
              <div className="space-y-2">
                <div className="p-2 bg-gray-800 rounded border border-gray-700">
                  "Return a list with bullet points: Name, Location, Distance,
                  Difficulty, Unique Feature."
                </div>
                <div className="p-2 bg-gray-800 rounded border border-gray-700">
                  "Write a 3-paragraph analysis."
                </div>
                <div className="p-2 bg-gray-800 rounded border border-gray-700">
                  "Return a JSON object with the required data."
                </div>
              </div>
              <p className="mt-3 text-gray-400 italic">
                LLMs are very good at filling out templates when you give them.
              </p>
            </div>
          )}
        </div>

        {/* Context Section */}
        <div className="border border-gray-700 rounded-lg overflow-hidden">
          <button
            className="w-full p-4 text-left flex justify-between items-center focus:outline-none bg-gray-800"
            onClick={() => toggleSection("context")}
          >
            <h3 className="text-xl font-semibold text-gray-200">[CONTEXT]</h3>
            {expandedSection === "context" ? (
              <FiChevronUp className="text-purple-400" />
            ) : (
              <FiChevronDown className="text-purple-400" />
            )}
          </button>

          {expandedSection === "context" && (
            <div className="p-4 bg-[#1E1E3F]">
              <p className="mb-3 text-gray-300">
                Injects personal background or specific scenario.
              </p>
              <div className="space-y-2">
                <div className="p-2 bg-gray-800 rounded border border-gray-700">
                  "We already did Mount Tam, Presidio, and Golden Gate Park."
                </div>
                <div className="p-2 bg-gray-800 rounded border border-gray-700">
                  "This code was written for Python 3.11 and is part of a Django
                  project."
                </div>
                <div className="p-2 bg-gray-800 rounded border border-gray-700">
                  "I am debating this topic with a libertarian friend who
                  believes all morals are subjective."
                </div>
              </div>
              <p className="mt-3 text-gray-400 italic">
                Context lets the model avoid giving obvious, irrelevant, or
                repeated information and tailor the response to your actual
                situation.
              </p>
            </div>
          )}
        </div>

        {/* Constraints Section */}
        <div className="border border-gray-700 rounded-lg overflow-hidden">
          <button
            className="w-full p-4 text-left flex justify-between items-center focus:outline-none bg-gray-800"
            onClick={() => toggleSection("constraints")}
          >
            <h3 className="text-xl font-semibold text-gray-200">
              [CONSTRAINTS]
            </h3>
            {expandedSection === "constraints" ? (
              <FiChevronUp className="text-purple-400" />
            ) : (
              <FiChevronDown className="text-purple-400" />
            )}
          </button>

          {expandedSection === "constraints" && (
            <div className="p-4 bg-[#1E1E3F]">
              <p className="mb-3 text-gray-300">
                Lists rules, limits, or filters.
              </p>
              <div className="space-y-2">
                <div className="p-2 bg-gray-800 rounded border border-gray-700">
                  "Do not recommend hikes we've done already."
                </div>
                <div className="p-2 bg-gray-800 rounded border border-gray-700">
                  "Do not exceed 100 lines of code."
                </div>
                <div className="p-2 bg-gray-800 rounded border border-gray-700">
                  "Do not accept my assumptions without challenge."
                </div>
              </div>
              <p className="mt-3 text-gray-400 italic">
                Warnings are like invisible rules that you give the LLM to
                filter its response.
              </p>
            </div>
          )}
        </div>

        {/* Style Section */}
        <div className="border border-gray-700 rounded-lg overflow-hidden">
          <button
            className="w-full p-4 text-left flex justify-between items-center focus:outline-none bg-gray-800"
            onClick={() => toggleSection("style")}
          >
            <h3 className="text-xl font-semibold text-gray-200">[STYLE]</h3>
            {expandedSection === "style" ? (
              <FiChevronUp className="text-purple-400" />
            ) : (
              <FiChevronDown className="text-purple-400" />
            )}
          </button>

          {expandedSection === "style" && (
            <div className="p-4 bg-[#1E1E3F]">
              <p className="mb-3 text-gray-300">
                Provides tone, delivery preferences, and formatting guidance.
              </p>
              <div className="space-y-2">
                <div className="p-2 bg-gray-800 rounded border border-gray-700">
                  "Be brief and direct."
                </div>
                <div className="p-2 bg-gray-800 rounded border border-gray-700">
                  "Explain like you're talking to a 10-year-old."
                </div>
                <div className="p-2 bg-gray-800 rounded border border-gray-700">
                  "Use bullet points and bold key items."
                </div>
              </div>
              <p className="mt-3 text-gray-400 italic">
                The style gives a consistent voice or presentation to the LLM's
                responses.
              </p>
            </div>
          )}
        </div>
      </div>

      <div className="mt-8 flex justify-center">
        <button
          onClick={handleDownloadPDF}
          className="flex items-center bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg font-medium transition-all duration-200 hover:-translate-y-0.5"
        >
          <FiDownload className="mr-2" />
          Download Prompt Formula Guide
        </button>
      </div>
    </div>
  );
}
