# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.

# Jamming - Spotify Playlist Creator

## Project Overview

Jamming is a React web application that allows users to search the Spotify library, create custom playlists, and save them to their Spotify accounts. This project is part of the Codecademy Front-End Engineer career path, designed to practice React components, state management, and API integration.

## Features

- Connect to your Spotify account via OAuth authentication
- Search for songs by title, artist, or album
- View search results from the Spotify API
- Create custom playlists with a name of your choice
- Add and remove tracks from your custom playlist
- Save your playlist directly to your Spotify account

## Technologies Used

- React.js
- Spotify Web API
- HTML/CSS
- JavaScript (ES6)
- Vite (for build tooling)

## Project Structure

- `App.jsx`: Main application component that manages authentication state
- `ConnectToSpotify.jsx`: Handles Spotify OAuth authentication
- `LoggedIn.jsx`: Main interface after successful authentication
- `SearchBar.jsx`: Component for searching tracks
- `SearchResults.jsx`: Displays search results from Spotify
- `Playlist.jsx`: Manages the user's custom playlist
- `Track.jsx`: Individual track component
- `Tracklist.jsx`: Reusable component for displaying lists of tracks

## Setup Instructions

1. Clone the repository
2. Run `npm install` to install dependencies
3. Create a Spotify Developer account and register your application to get a Client ID
4. Update the `client_id` and `redirect_uri` in `ConnectToSpotify.jsx` with your credentials
5. Run `npm run dev` to start the development server

## Using the Application

1. Click "Connect" to authenticate with your Spotify account
2. Search for songs using the search bar
3. Click the "+" button to add songs to your playlist
4. Click the "-" button to remove songs from your playlist
5. Name your playlist
6. Click "Save to Spotify" to save your playlist to your Spotify account

## Project Goals

This project demonstrates the ability to:

- Create modular, reusable React components
- Implement proper state management
- Make API requests to third-party services
- Handle authentication flows
- Create an intuitive user interface

## Future Enhancements

- Add preview functionality for tracks
- Implement drag-and-drop for playlist management
- Add more robust error handling
- Improve mobile responsiveness
- Add additional filtering options for search results

## Acknowledgements

This project was created as part of the Codecademy Front-End Engineer career path curriculum.

