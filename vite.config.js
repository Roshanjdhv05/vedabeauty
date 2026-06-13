import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import fs from 'fs'
import path from 'path'

// Vite plugin to allow deleting files from the public folder locally
function localAdminApi() {
  return {
    name: 'local-admin-api',
    configureServer(server) {
      server.middlewares.use('/api/delete-image', (req, res) => {
        if (req.method === 'DELETE') {
          const urlParams = new URLSearchParams(req.url.split('?')[1]);
          const imagePath = urlParams.get('path');
          
          if (imagePath) {
            try {
              // Decode and construct absolute path safely inside public folder
              const decodedPath = decodeURIComponent(imagePath).replace(/^\/+/, '');
              const absolutePath = path.resolve(process.cwd(), 'public', decodedPath);
              
              if (absolutePath.startsWith(path.resolve(process.cwd(), 'public')) && fs.existsSync(absolutePath)) {
                fs.unlinkSync(absolutePath);
                res.statusCode = 200;
                res.end(JSON.stringify({ success: true, message: 'File deleted' }));
                return;
              }
            } catch (err) {
              console.error('Error deleting file:', err);
            }
          }
          res.statusCode = 400;
          res.end(JSON.stringify({ success: false, message: 'Invalid path or file not found' }));
        } else {
          res.statusCode = 405;
          res.end();
        }
      });
    }
  }
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), localAdminApi()],
  server: {
    port: 3000,
    host: '127.0.0.1',
  },
})
