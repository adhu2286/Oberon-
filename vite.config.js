import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import authHandler from './api/auth.js'
import projectsHandler from './api/projects.js'
import uploadHandler from './api/upload.js'

function apiDevServerPlugin() {
  return {
    name: 'api-dev-server',
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        if (!req.url.startsWith('/api')) {
          return next();
        }

        try {
          if (req.url.startsWith('/api/auth')) {
            await authHandler(req, res);
          } else if (req.url.startsWith('/api/projects')) {
            await projectsHandler(req, res);
          } else if (req.url.startsWith('/api/upload')) {
            await uploadHandler(req, res);
          } else {
            res.statusCode = 404;
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({ error: 'Endpoint not found' }));
          }
        } catch (err) {
          console.error('Dev API Server error:', err);
          if (!res.headersSent) {
            res.statusCode = 500;
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({ error: err.message }));
          }
        }
      });
    },
  };
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), apiDevServerPlugin()],
})
