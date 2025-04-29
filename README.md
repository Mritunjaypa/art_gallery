# ArtShare - Frontend Only Version

This is a simplified frontend-only version of an AI art generator application. The app allows users to:

1. Generate mock AI images from text prompts
2. Share these images with the community
3. Browse and search through images created by the community

## Features

- Generate simulated AI images from textual prompts
- Save creations to local storage (persists between sessions)
- Browse community images 
- Search for images by creator name or prompt
- Responsive design for various screen sizes

## Technical Implementation

This version of the app is built with:
- React for the UI
- React Router for navigation
- TailwindCSS for styling
- LocalStorage for data persistence

## How It Works

The application simulates AI image generation with a mock function that creates placeholder images. All data is stored locally in the browser's localStorage, eliminating the need for a server or database.

## Getting Started

1. Navigate to the client directory: `cd AI-Art-Gallery/client`
2. Install dependencies: `npm install`
3. Start the development server: `npm run dev`
4. Open the application in your browser at `http://localhost:5173`

## Notes

- This is a frontend-only version. No actual AI image generation is performed.
- No internet connection is required after initial setup.
- All data is stored locally in your browser.
