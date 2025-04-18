# Weather Alert System Frontend

A modern, responsive React application for monitoring weather conditions and managing customized weather alerts.

![Weather Alert System](https://via.placeholder.com/800x400?text=Weather+Alert+System)

## 🚀 Features

- Real-time weather monitoring with interactive maps
- Custom weather alert creation and management
- Location search with Mapbox integration
- Responsive design for desktop and mobile devices
- Environment-aware configuration for development and production
- Error handling with user-friendly notifications
- State management with Zustand

## 🛠️ Tech Stack

- **Framework**: React 19
- **Build Tool**: Vite 6
- **Language**: TypeScript
- **Styling**: SASS/SCSS
- **Routing**: React Router 7
- **State Management**: Zustand
- **HTTP Client**: Axios
- **Map Integration**: Mapbox
- **Icons**: React Icons

## 📂 Project Structure

```
src/
├── assets/         # Static assets like images and icons
├── components/     # Reusable UI components
├── config/         # Configuration files and environment settings
├── hooks/          # Custom React hooks
├── layout/         # Layout components and structure
├── pages/          # Page components for each route
├── services/       # API services and data fetching
├── stores/         # Zustand state stores
├── styles/         # Global styles and variables
├── types/          # TypeScript type definitions
├── utils/          # Utility functions
├── App.tsx         # Main application component
└── main.tsx        # Application entry point
```

## 🏃‍♂️ Getting Started

### Prerequisites

- **Node.js**: Version 16.x or higher (recommended: 18.x)
  - Download from: https://nodejs.org/
  - Verify with: `node --version`
- **npm**: Version 7.x or higher (comes with Node.js)
  - Verify with: `npm --version`
- **Git**: For cloning the repository
  - Download from: https://git-scm.com/
  - Verify with: `git --version`
- **Backend server**: The Weather Alert System backend needs to be running
  - See the backend README for specific setup instructions
- **Web browser**: Chrome, Firefox, Safari, or Edge (latest versions)
- **Mapbox API key**: Required for location services 
  - Register at: https://www.mapbox.com/ (free tier available)

### Local Development Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/weather-alert-system.git
   cd weather-alert-system/frontend
   ```

2. **Set up environment variables**
   
   Create a `.env.development` file in the frontend directory with your API keys:
   ```
   VITE_MAPBOX_ACCESS_TOKEN=pk.eyJ1IjoiYWRhbW9saXZlcjEiLCJhIjoiY205ZTNkY3l5MDhteTJqc2N0NGl3MnFpOSJ9.H-Ac2InbL3OuQNwqbmba1A
   VITE_MAPBOX_API_URL=https://api.mapbox.com/geocoding/v5/mapbox.places
   VITE_API_URL=http://localhost:3000/api
   ```
   
   > Note: You can obtain a Mapbox access token by signing up at mapbox.com

3. **Install dependencies**
   ```bash
   npm install
   # or if you prefer yarn
   yarn install
   ```

4. **Start the development server**
   ```bash
   npm run dev
   # or
   yarn dev
   ```

5. **Open the application**
   
   Navigate to http://localhost:5173 in your web browser

### Running the Complete Application Locally

To run the entire Weather Alert System application (frontend + backend) locally:

1. **Set up the backend first**:
   ```bash
   cd ../backend
   npm install
   npm run dev
   ```
   
   This will start the backend on http://localhost:3000.
   
   See the backend README for detailed instructions including:
   - Setting up MongoDB (required)
   - Configuring environment variables
   - API keys for weather services

2. **In a separate terminal, start the frontend**:
   ```bash
   cd ../frontend
   npm run dev
   ```

3. **Verify both services are running**:
   - Backend: http://localhost:3000/health should return a status of "ok"
   - Frontend: http://localhost:5173 should load the application UI

## 🔧 Environment Configuration

The application uses different environment configurations for development and production:

### Development Environment

Create a `.env.development` file based on the `.env.development.example` template:

```
# Mapbox configuration (replace with your own public token)
VITE_MAPBOX_ACCESS_TOKEN=your_mapbox_public_token_here
VITE_MAPBOX_API_URL=https://api.mapbox.com/geocoding/v5/mapbox.places

# API URL - development
VITE_API_URL=http://localhost:3000/api
```

### Production Environment

Create a `.env.production` file based on the `.env.production.example` template:

```
# Mapbox configuration (replace with your own public token)
VITE_MAPBOX_ACCESS_TOKEN=your_mapbox_public_token_here
VITE_MAPBOX_API_URL=https://api.mapbox.com/geocoding/v5/mapbox.places

# API URL - production
VITE_API_URL=https://your-backend.onrender.com/api
```

### 🔒 Security Best Practices

This project follows these security best practices for environment variables:

1. **All `.env` files are git-ignored** to prevent committing sensitive data to the repository
2. **Example templates** (`.env.*.example`) are provided as references
3. **Public tokens only** - Only public API tokens (like Mapbox public tokens) should be used in frontend code
4. **Domain restrictions** - Restrict your Mapbox token to your domains in the Mapbox dashboard:
   - Go to [Mapbox Account](https://account.mapbox.com/)
   - Navigate to Access Tokens
   - Click on your token
   - Add URL restrictions for your development and production URLs

5. **For sensitive API keys**:
   - Never store sensitive API keys or private tokens in frontend code
   - Use backend proxy endpoints instead
   - Example: If you need to call an API requiring a private key, create a backend endpoint that makes the call server-side

## 📜 Available Scripts

- `npm run dev` - Start the development server using `.env.development`
- `npm run build` - Build for production using `.env.production`
- `npm run build:dev` - Build using development settings
- `npm run preview` - Preview the production build locally
- `npm run lint` - Lint the code with ESLint

## 🚢 Deployment

### Deploying to Vercel (Recommended)

1. Push your code to GitHub
2. Sign up/login to [Vercel](https://vercel.com)
3. Import your GitHub repository
4. Vercel will automatically detect the Vite configuration
5. Configure environment variables:
   - Add the same variables from your `.env.production` file
6. Click "Deploy"

### Deploying to Render

1. Sign up/login to [Render](https://render.com)
2. Create a new "Static Site"
3. Connect your GitHub repository
4. Set the build command to `npm run build`
5. Set the publish directory to `dist`
6. Configure environment variables
7. Click "Create Static Site"

## 🌐 CORS Configuration

The frontend is configured to communicate with the backend API. Make sure your backend has CORS enabled and accepts requests from your frontend domain.

## 📋 Backend Connection

The application connects to the backend API specified in the `VITE_API_URL` environment variable. Make sure your backend is running and accessible from your frontend.

## 🔍 Troubleshooting

- **API Connection Issues**: If the application cannot connect to the backend, verify:
  - Backend server is running
  - `VITE_API_URL` is correctly set in your `.env.development` file
  - CORS is properly configured on the backend
  
- **Mapbox Not Loading**: If the map component doesn't load, check:
  - Your Mapbox token is valid
  - `VITE_MAPBOX_ACCESS_TOKEN` is correctly set in your environment file
  - Console for any JavaScript errors

- **Build Errors**: If you encounter build errors:
  - Make sure all dependencies are installed (`npm install`)
  - Verify Node.js is updated to a compatible version
  - Check for TypeScript errors in your code

## 📚 Learn More

- [React Documentation](https://react.dev)
- [Vite Documentation](https://vitejs.dev/guide/)
- [TypeScript Documentation](https://www.typescriptlang.org/docs/)
- [Zustand Documentation](https://github.com/pmndrs/zustand)
- [Mapbox Documentation](https://docs.mapbox.com/)

## 📄 License

This project is licensed under the ISC License. 