# Deafine Frontend

> Note: This repo is for the frontend interface of a web app Deafine and only contains the frontend parts.

A real-time audio transcription web application designed to make conversations accessible for deaf and hard-of-hearing users. Deafine provides live speech-to-text transcription with speaker identification and intelligent haptic feedback notifications.

## Features

- **Real-Time Transcription**: Live audio capture and instant speech-to-text conversion via WebSocket connection
- **Speaker Diarization**: Automatic identification and separation of different speakers in the conversation
- **Smart Notifications**: Haptic feedback alerts when your name is mentioned in the conversation
- **Conversation Summary**: Automatic generation of conversation summaries at the end of each session
- **User-Friendly Interface**: Clean, responsive design built with React and TailwindCSS
- **Configurable Speakers**: Adjust the number of expected speakers for optimal transcription accuracy
- **Mobile Responsive**: Works seamlessly across desktop and mobile devices

## Tech Stack

- **React 18** - Modern React with hooks for UI development
- **Vite** - Fast build tool and development server
- **TailwindCSS** - Utility-first CSS framework for styling
- **Axios** - HTTP client for API communication
- **WebSocket** - Real-time bidirectional communication for live transcription
- **Web Audio API** - Browser audio capture and processing

## Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (version 16 or higher)
- **npm** or **yarn** package manager
- A modern web browser with microphone access permissions
- Internet connection for backend API communication

## Installation

1. **Clone the repository**

```bash
git clone https://github.com/yourusername/deafine-frontend.git
cd deafine-frontend
```

2. **Install dependencies**

```bash
npm install
```

3. **Configure environment variables** (optional)

Create a `.env` file in the root directory to customize the backend API endpoint:

```env
VITE_API_BASE=https://your-backend-url.com
```

If not specified, the app defaults to: `https://deafine-backend.onrender.com`

4. **Start the development server**

```bash
npm run dev
```

The application will be available at `http://localhost:5173`

## Usage

### Getting Started

1. **Enter Your Name**: Input your name in the text field to enable personalized haptic notifications when you're mentioned
2. **Configure Speakers**: Select the expected number of speakers in the conversation (2-10)
3. **Start Recording**: Click the "Start Recording" button to begin capturing audio
4. **View Transcription**: Watch the live transcription appear in real-time as people speak
5. **Stop Recording**: Click "Stop Recording" when the conversation ends to receive a summary

### Features in Detail

#### Real-Time Transcription

- Audio is captured from your device's microphone
- Speech is processed and transcribed in real-time via WebSocket
- Transcripts appear instantly with speaker identification

#### Haptic Notifications

- Enter your name to receive vibration alerts when mentioned
- Notifications display which speaker mentioned you
- Includes the context of the mention

#### Speaker Identification

- Speakers are automatically detected and labeled (Speaker 0, Speaker 1, etc.)
- Color-coded speech bubbles for easy visual distinction
- Adjustable speaker count for optimal accuracy

## Project Structure

```
deafine-frontend/
├── src/
│   ├── components/
│   │   ├── ControlPanel.jsx       # Recording controls and configuration
│   │   ├── Layout.jsx              # Main layout wrapper
│   │   ├── NotificationPopup.jsx   # Visual notification display
│   │   ├── TranscriptBubble.jsx    # Individual transcript message
│   │   └── UserNameInput.jsx       # Name input component
│   ├── hooks/
│   │   ├── use-mobile.js           # Mobile detection hook
│   │   └── use-notification.js     # Notification management hook
│   ├── lib/
│   │   └── utils.js                # Utility functions
│   ├── api.js                      # API and WebSocket connections
│   ├── App.jsx                     # Main application component
│   ├── index.css                   # Global styles
│   └── main.jsx                    # Application entry point
├── index.html                      # HTML template
├── package.json                    # Dependencies and scripts
├── postcss.config.js               # PostCSS configuration
├── tailwind.config.js              # TailwindCSS configuration
├── vite.config.js                  # Vite build configuration
└── README.md                       # This file
```

## Configuration

### API Endpoint

The frontend connects to a backend API for transcription processing. Configure the endpoint using the `VITE_API_BASE` environment variable:

```env
VITE_API_BASE=https://your-backend-url.com
```

## Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build locally

### Development Tips

- The app uses Vite's hot module replacement (HMR) for instant updates during development
- Browser console logs provide detailed WebSocket connection and transcription events
- Microphone permissions must be granted for the app to function

## Browser Support

Deafine Frontend requires a modern browser with support for:

- WebSocket API
- Web Audio API
- MediaStream Recording API
- Vibration API (for haptic feedback on mobile devices)

**Recommended browsers:**

- Chrome/Edge 90+
- Firefox 88+
- Safari 14+

## Contributing

Contributions are welcome! Here's how you can help:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## Troubleshooting

### Microphone Not Working

- Ensure browser permissions are granted for microphone access
- Check that no other application is using the microphone
- Try using HTTPS (required for microphone access in most browsers)

### WebSocket Connection Issues

- Verify the backend API is running and accessible
- Check the `VITE_API_BASE` environment variable is correctly set
- Ensure no firewall is blocking WebSocket connections

### No Transcription Appearing

- Verify audio is being captured (check browser console for errors)
- Ensure speakers are talking clearly and at a reasonable volume
- Check backend API health endpoint

## Support

For questions, issues, or feature requests, please open an issue on the GitHub repository.
