# Weather Alert System Frontend

React-based frontend for the Weather Alert System application.

## Environment Configuration

The frontend uses different environment configuration files for development and production:

### Development

- `.env.development` - Used when running `npm run dev` 
- Points to a local backend server: `http://localhost:3000/api`

### Production

- `.env.production` - Used when running `npm run build`
- Points to the deployed backend on Render: `https://alertrix-server.onrender.com/api`

## Available Scripts

- `npm run dev` - Start the development server using `.env.development`
- `npm run build` - Build for production using `.env.production`
- `npm run build:dev` - Build using development settings (useful for testing)
- `npm run preview` - Preview the production build locally

## Deployment

This project is designed to be deployed to Vercel or Render. The environment variables are managed through the respective platform's UI.

When deploying to production, the `.env.production` file values will be used by default. You can also set these values directly in the hosting platform's environment settings. 