import './css/main.css';
import { renderHeader } from './components/Header.js';
import { renderFooter } from './components/Footer.js';
import { initCatalogSearch } from './components/CatalogSearch.js';

// Re-render or run immediately depending on script loading stage
function initializeApp() {
  // Render layout components
  renderHeader();
  renderFooter();
  
  // Initialize the catalog interactive search
  initCatalogSearch();
  
  console.log("ASAI Internacional - Premium Clean Static Layout Initialized.");
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initializeApp);
} else {
  initializeApp();
}
