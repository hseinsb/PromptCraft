# PromptCraft

PromptCraft is an AI-Powered Prompt Creator & Organizer that helps you create, optimize, and manage your AI prompts.

## Features

- **AI-Powered Prompt Generation**: Transform simple descriptions into perfectly structured, AI-optimized prompts
- **Prompt Organization**: Save and organize your best prompts for future use
- **Educational Content**: Learn the secret formula for creating powerful prompts
- **User Authentication**: Secure access to your prompts with Firebase authentication
- **Modern UI**: Clean, responsive design that works on all devices

## Tech Stack

- **Frontend**: Next.js 15, React 19, TypeScript
- **Authentication & Storage**: Firebase (Auth, Firestore)
- **AI Integration**: OpenAI GPT-4 API
- **Styling**: Tailwind CSS
- **Icons**: React Icons

## Getting Started

### Prerequisites

- Node.js 18+ installed
- Firebase project created
- OpenAI API key

### Setup

1. Clone the repository:

```bash
git clone https://github.com/yourusername/promptcraft.git
cd promptcraft
```

2. Install dependencies:

```bash
npm install
```

3. Create a `.env.local` file in the root directory and add your environment variables (see `.env.example` for required variables):

```
OPENAI_API_KEY=your_openai_api_key
NEXT_PUBLIC_FIREBASE_API_KEY=your_firebase_api_key
# ... other Firebase config variables
```

4. Set up a Firebase project:
   - Create a new project at [firebase.google.com](https://firebase.google.com)
   - Enable Authentication (Email/Password)
   - Create a Firestore database
   - Add a web app to your Firebase project and copy the config values to your `.env.local` file

### Running the Application

Development mode:

```bash
npm run dev
```

Build for production:

```bash
npm run build
```

Start production server:

```bash
npm start
```

## Usage

1. Sign in to the application using email/password authentication
2. Create a new prompt by entering a simple description
3. The AI will transform your description into a structured prompt following the 6-part formula
4. Save and manage your prompts in the prompt vault
5. Learn about the perfect prompt formula in the "Secret" section

## Project Structure

```
src/
├── app/                  # Next.js app router files
├── components/           # React components
├── contexts/             # Context providers (auth, etc.)
├── firebase/             # Firebase configuration
├── services/             # Service functions for data operations
public/                   # Static assets
```

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- OpenAI for providing the API that powers prompt generation
- The Next.js team for the excellent framework
- Firebase for authentication and data storage
