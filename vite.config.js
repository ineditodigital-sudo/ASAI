import { defineConfig } from 'vite';
import { resolve, extname } from 'path';
import { readdirSync, statSync } from 'fs';

// Helper function to recursively find all HTML files in a directory
function getHtmlFiles(dir, files_ = []) {
  const files = readdirSync(dir);
  for (const i in files) {
    const name = dir + '/' + files[i];
    if (statSync(name).isDirectory()) {
      if (files[i] !== 'node_modules' && files[i] !== 'dist' && files[i] !== 'public') {
        getHtmlFiles(name, files_);
      }
    } else {
      if (extname(name) === '.html') {
        files_.push(name);
      }
    }
  }
  return files_;
}

// Get all HTML files in the project
const htmlFiles = getHtmlFiles(resolve(__dirname));

// Create rollup inputs map
const input = {};
htmlFiles.forEach((file) => {
  // Get relative path from __dirname
  const relativePath = file.replace(resolve(__dirname) + '/', '').replace(resolve(__dirname), '');
  if (!relativePath) return;
  
  // Create a key for rollup
  // e.g. 'index' for 'index.html', 'pages/about' for 'pages/about.html'
  const key = relativePath.replace('.html', '').replace(/\\/g, '/');
  input[key] = resolve(__dirname, relativePath);
});

console.log("Vite multi-page inputs automatically detected:", input);

export default defineConfig({
  root: resolve(__dirname),
  build: {
    outDir: resolve(__dirname, 'dist'),
    emptyOutDir: true,
    rollupOptions: {
      input: input
    }
  },
  server: {
    port: 3000
  }
});
