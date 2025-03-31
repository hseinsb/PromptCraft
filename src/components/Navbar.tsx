"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useAuth } from "../contexts/AuthContext";
import {
  FiMenu,
  FiX,
  FiLogOut,
  FiHome,
  FiBook,
  FiInfo,
  FiZap,
} from "react-icons/fi";

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { isAuthenticated, logout } = useAuth();

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleSignOut = async () => {
    try {
      logout();
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  return (
    <nav
      className={`bg-[#1E1E3F] ${
        scrolled ? "shadow-md border-b border-gray-700" : "border-transparent"
      } sticky top-0 z-50 transition-all duration-300`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link
              href="/"
              className="flex items-center space-x-2 transition-transform duration-300 hover:scale-105"
            >
              <div className="p-1.5 bg-purple-900/30 rounded-full">
                <FiZap className="text-purple-400" size={20} />
              </div>
              <span className="text-xl font-bold gradient-text hover:opacity-90 transition-opacity">
                PromptCraft
              </span>
            </Link>
          </div>

          {isAuthenticated && (
            <div className="hidden sm:flex sm:items-center sm:ml-6 space-x-2">
              <Link
                href="/"
                className="text-gray-300 hover:text-purple-400 px-3 py-2 rounded-lg text-sm font-medium flex items-center hover:bg-purple-900/30 transition-all duration-200 transform hover:-translate-y-0.5 border border-transparent hover:border-purple-900/30"
              >
                <FiHome className="mr-2 text-purple-400" />
                Home
              </Link>
              <Link
                href="/prompts"
                className="text-gray-300 hover:text-purple-400 px-3 py-2 rounded-lg text-sm font-medium flex items-center hover:bg-purple-900/30 transition-all duration-200 transform hover:-translate-y-0.5 border border-transparent hover:border-purple-900/30"
              >
                <FiBook className="mr-2 text-purple-400" />
                My Prompts
              </Link>
              <Link
                href="/secret"
                className="text-gray-300 hover:text-purple-400 px-3 py-2 rounded-lg text-sm font-medium flex items-center hover:bg-purple-900/30 transition-all duration-200 transform hover:-translate-y-0.5 border border-transparent hover:border-purple-900/30"
              >
                <FiInfo className="mr-2 text-purple-400" />
                The Secret
              </Link>
              <button
                onClick={handleSignOut}
                className="text-gray-300 hover:text-red-400 px-3 py-2 rounded-lg text-sm font-medium flex items-center hover:bg-red-900/30 transition-all duration-200 transform hover:-translate-y-0.5 ml-2 border border-transparent hover:border-red-900/30"
              >
                <FiLogOut className="mr-2 text-red-400" />
                Sign Out
              </button>
            </div>
          )}

          {/* Mobile menu button */}
          {isAuthenticated && (
            <div className="flex items-center sm:hidden">
              <button
                onClick={toggleMenu}
                className="inline-flex items-center justify-center p-2 rounded-lg text-gray-300 hover:text-purple-400 hover:bg-purple-900/30 focus:outline-none transition-all duration-200"
                aria-expanded="false"
              >
                <span className="sr-only">Open main menu</span>
                {isMenuOpen ? (
                  <FiX size={24} className="animate-fadeIn" />
                ) : (
                  <FiMenu size={24} className="animate-fadeIn" />
                )}
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Mobile menu */}
      {isAuthenticated && (
        <div
          className={`sm:hidden transition-all duration-300 ease-in-out overflow-hidden ${
            isMenuOpen
              ? "max-h-72 opacity-100 border-t border-gray-700"
              : "max-h-0 opacity-0"
          }`}
        >
          <div className="px-2 pt-2 pb-3 space-y-1">
            <Link
              href="/"
              className="text-gray-300 hover:text-purple-400 block px-3 py-2 rounded-lg text-base font-medium flex items-center hover:bg-purple-900/30 transition-all duration-200"
              onClick={() => setIsMenuOpen(false)}
            >
              <FiHome className="mr-2 text-purple-400" />
              Home
            </Link>
            <Link
              href="/prompts"
              className="text-gray-300 hover:text-purple-400 block px-3 py-2 rounded-lg text-base font-medium flex items-center hover:bg-purple-900/30 transition-all duration-200"
              onClick={() => setIsMenuOpen(false)}
            >
              <FiBook className="mr-2 text-purple-400" />
              My Prompts
            </Link>
            <Link
              href="/secret"
              className="text-gray-300 hover:text-purple-400 block px-3 py-2 rounded-lg text-base font-medium flex items-center hover:bg-purple-900/30 transition-all duration-200"
              onClick={() => setIsMenuOpen(false)}
            >
              <FiInfo className="mr-2 text-purple-400" />
              The Secret
            </Link>
            <button
              onClick={() => {
                handleSignOut();
                setIsMenuOpen(false);
              }}
              className="text-gray-300 hover:text-red-400 block px-3 py-2 rounded-lg text-base font-medium flex items-center w-full text-left hover:bg-red-900/30 transition-all duration-200 border border-transparent hover:border-red-900/30"
            >
              <FiLogOut className="mr-2 text-red-400" />
              Sign Out
            </button>
          </div>
        </div>
      )}
    </nav>
  );
}
