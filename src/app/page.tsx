import Link from "next/link";
import { FiArrowRight, FiEdit2, FiLock, FiShuffle } from "react-icons/fi";

export default function Home() {
  return (
    <main className="min-h-screen bg-[#14142B] pb-12">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-b from-[#14142B] to-purple-900/20 py-20 px-4 text-center sm:px-6 lg:px-8">
        <h1 className="text-4xl lg:text-5xl font-bold text-white mb-4">
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-400">
            PromptCraft
          </span>
        </h1>
        <p className="max-w-2xl mx-auto text-xl text-gray-300 mb-8">
          Transform simple descriptions into powerful AI prompts
        </p>
        <div className="flex justify-center space-x-4">
          <Link
            href="/prompts"
            className="inline-flex items-center bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg font-medium transition-all duration-200 hover:-translate-y-0.5"
          >
            Create Prompts <FiArrowRight className="ml-2" />
          </Link>
          <Link
            href="/secret"
            className="inline-flex items-center bg-gray-800 hover:bg-gray-700 text-gray-200 border border-gray-700 px-6 py-3 rounded-lg font-medium transition-all duration-200 hover:-translate-y-0.5"
          >
            Reveal the Secret <FiLock className="ml-2" />
          </Link>
        </div>
      </div>

      {/* Features Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h2 className="text-3xl font-bold text-center text-purple-400 mb-12">
          Unlock the Power of AI
        </h2>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* Feature Card 1 */}
          <div className="bg-[#1E1E3F] border border-gray-700 rounded-xl p-6 shadow-lg hover:shadow-purple-900/10 transition-all duration-300">
            <div className="bg-purple-900/30 p-3 rounded-full w-14 h-14 flex items-center justify-center mb-5">
              <FiEdit2 className="text-purple-400 text-2xl" />
            </div>
            <h3 className="text-xl font-bold text-white mb-3">
              Simple to Powerful
            </h3>
            <p className="text-gray-300">
              Transform your basic ideas into sophisticated, detailed prompts
              that get better results from AI models.
            </p>
          </div>

          {/* Feature Card 2 */}
          <div className="bg-[#1E1E3F] border border-gray-700 rounded-xl p-6 shadow-lg hover:shadow-purple-900/10 transition-all duration-300">
            <div className="bg-purple-900/30 p-3 rounded-full w-14 h-14 flex items-center justify-center mb-5">
              <FiShuffle className="text-purple-400 text-2xl" />
            </div>
            <h3 className="text-xl font-bold text-white mb-3">
              Industry Templates
            </h3>
            <p className="text-gray-300">
              Access specialized templates for different industries, ensuring
              your prompts are tailored to your specific needs.
            </p>
          </div>

          {/* Feature Card 3 */}
          <div className="bg-[#1E1E3F] border border-gray-700 rounded-xl p-6 shadow-lg hover:shadow-purple-900/10 transition-all duration-300">
            <div className="bg-purple-900/30 p-3 rounded-full w-14 h-14 flex items-center justify-center mb-5">
              <FiLock className="text-purple-400 text-2xl" />
            </div>
            <h3 className="text-xl font-bold text-white mb-3">
              Secret Formula
            </h3>
            <p className="text-gray-300">
              Learn the hidden structure that top AI experts use to craft
              prompts that consistently outperform others.
            </p>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-gradient-to-r from-purple-900/30 to-blue-900/30 rounded-xl p-8 border border-purple-900/50 shadow-xl">
          <h2 className="text-2xl font-bold text-white mb-6 text-center">
            Start Creating Better AI Prompts Today
          </h2>
          <p className="text-gray-300 text-center mb-8">
            Join the community of prompt engineers who are getting better
            results from AI with our proven techniques.
          </p>
          <div className="flex justify-center">
            <Link
              href="/prompts"
              className="inline-flex items-center bg-purple-600 hover:bg-purple-700 text-white px-8 py-3 rounded-lg font-medium text-lg transition-all duration-200 hover:-translate-y-0.5"
            >
              Get Started <FiArrowRight className="ml-2" />
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
