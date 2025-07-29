Catholic Daily Companion - Frontend
A mobile application built with React Native (Expo) to help users stay spiritually connected through daily saints, Mass readings, and personal journaling.

Features
- Saint of the Day -- View feast day information and saint biographies
- Daily Readings -- Mass readings of the day, including Psalm, Gospel and more
- Journal Entries -- Create, update, and delete personal spiritual reflections
- User Authentication -- Secure login and logout (JWT-based)
- Themed UI -- Elegant gradients and color schemes based on liturgical context

Techonologies Used
- React Native
- Expo
- Typescript
- React Navigation
- Axios
- Expo Linear Gradient

Getting Started
1. Clone the repository from https://github.com/Alekaz94/catholic-daily-companion-frontend.git
2. Install dependencies -- npm install or yarn install
3. Start the development server -- npm start or expo start (Make sure you have the Expo Go app installed on your device to preview)

Enviromental Variables
Create a .env file in the root of the directory with the following: API_BASE_URL=http://<your-backend-ip>:8080
(Important! Make sure your mobile app and backend server are running on the same network, especially on physical devices)

Project Structure
.
├── assets/                  # Images and static assets
├── components/              # Shared UI components (modals, buttons, etc.)
├── navigation/              # Navigation stack and routing
├── screens/                 # Main app screens (Journal, Home, Reading, etc.)
├── services/                # API service calls (Axios)
├── styles/                  # Layout, Typography, Colors
├── models/                  # TypeScript interfaces/models
|-- context/                 # Authentication and global state context
└── App.tsx                  # Root component

Future Enhancements
- Profile updates
- Journal search and filtering
- Daily Prayers / Prayers section
- Offline mode

Troubleshooting
Images not loading?
- If your images don't load, verify image URLs or fallback to a default image
Backend unreachable?
- Ensure your backend is reachable (same Wi-Fi if testing on device)
UI testing?
- Use Android emulator or iOS simulator for UI testing

Licence
This project is licensed under MIT. See LICENSE for full terms.