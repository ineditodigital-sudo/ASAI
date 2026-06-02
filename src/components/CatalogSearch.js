export function initCatalogSearch() {
  const searchTrigger = document.getElementById('search-trigger');
  const searchOverlay = document.getElementById('search-overlay');
  const searchClose = document.getElementById('search-close');
  const searchInput = document.getElementById('search-input');
  const searchResults = document.getElementById('search-results');
  const searchResultsInfo = document.getElementById('search-results-info');
  
  let catalogData = [];
  
  if (!searchOverlay) return;
  
  // 1. Fetch the local JSON catalog database
  fetch('/catalog-data.json')
    .then(response => response.json())
    .then(data => {
      catalogData = data;
      console.log("Catalog search database loaded, items:", data.length);
    })
    .catch(error => {
      console.error("Error loading catalog database:", error);
    });
    
  // 2. Open Search Overlay
  if (searchTrigger) {
    searchTrigger.addEventListener('click', () => {
      searchOverlay.classList.add('search-active');
      document.body.style.overflow = 'hidden'; // Stop page scroll
      setTimeout(() => {
        if (searchInput) searchInput.focus();
      }, 100);
    });
  }
  
  // 3. Close Search Overlay function
  const closeSearch = () => {
    searchOverlay.classList.remove('search-active');
    document.body.style.overflow = ''; // Restore page scroll
    if (searchInput) searchInput.value = '';
    resetSearchResults();
  };
  
  if (searchClose) {
    searchClose.addEventListener('click', closeSearch);
  }
  
  // Close on clicking outside the modal
  searchOverlay.addEventListener('click', (e) => {
    if (e.target === searchOverlay) {
      closeSearch();
    }
  });
  
  // Close on pressing Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && searchOverlay.classList.contains('search-active')) {
      closeSearch();
    }
  });
  
  // 4. Reset Results
  const resetSearchResults = () => {
    if (searchResults) {
      searchResults.innerHTML = `
        <div class="search-empty-state">
          <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" fill="none" stroke="currentColor" stroke-width="1" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
          <p>Busca en nuestro almacén de más de 1,500 componentes industriales e hidráulicos</p>
        </div>
      `;
    }
    if (searchResultsInfo) {
      searchResultsInfo.style.display = 'none';
    }
  };
  
  // 5. Search Logic
  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      const query = e.target.value.toLowerCase().trim();
      
      if (query.length < 2) {
        resetSearchResults();
        return;
      }
      
      // Filter catalogData
      const filtered = catalogData.filter(item => {
        const nameMatch = item.name.toLowerCase().includes(query);
        const catMatch = item.category.toLowerCase().includes(query);
        const descMatch = item.description.toLowerCase().includes(query);
        const keywordMatch = item.keywords.some(kw => kw.toLowerCase().includes(query));
        
        return nameMatch || catMatch || descMatch || keywordMatch;
      });
      
      renderResults(filtered, query);
    });
  }
  
  // 6. Render Results
  const renderResults = (results, query) => {
    if (!searchResults) return;
    
    if (results.length === 0) {
      searchResultsInfo.style.display = 'block';
      searchResultsInfo.innerHTML = `No se encontraron resultados para "<strong>${query}</strong>"`;
      searchResults.innerHTML = `
        <div class="search-no-results">
          <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" fill="none" stroke="currentColor" stroke-width="1" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><line x1="4" y1="4" x2="20" y2="20"/></svg>
          <p>Lo sentimos, no encontramos productos que coincidan con tu búsqueda.</p>
          <a href="/contacto.html" class="btn btn-primary btn-sm" style="margin-top: 1rem;">Preguntar a un Asesor</a>
        </div>
      `;
      return;
    }
    
    // Display result info count
    searchResultsInfo.style.display = 'block';
    searchResultsInfo.innerHTML = `Se encontraron <strong>${results.length}</strong> ${results.length === 1 ? 'resultado' : 'resultados'} para "<strong>${query}</strong>"`;
    
    // Build results HTML
    searchResults.innerHTML = results.map(item => {
      // Create custom WhatsApp text
      const waText = encodeURIComponent(`Hola ASAI Internacional, vi su catálogo y me gustaría solicitar una cotización del producto: ${item.name}`);
      const waLink = `https://wa.me/524498134627?text=${waText}`;
      
      return `
        <div class="search-result-item animate-fade-in">
          <div class="search-item-img">
            <img src="${item.image}" alt="${item.name}" loading="lazy">
          </div>
          <div class="search-item-content">
            <span class="search-item-cat">${item.category}</span>
            <h4 class="search-item-name">${item.name}</h4>
            <p class="search-item-desc">${item.description}</p>
            <div class="search-item-actions">
              <a href="${item.url}" class="search-item-link">Ver catálogo →</a>
              <a href="${waLink}" target="_blank" class="search-item-btn flex-center">
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="currentColor" viewBox="0 0 16 16" style="margin-right: 4px;"><path d="M13.601 2.326A7.85 7.85 0 0 0 8 .258c-4.3 0-7.8 3.5-7.8 7.8 0 1.37.356 2.717 1.036 3.9L.1 16l4.223-1.109a7.8 7.8 0 0 0 3.677.927c4.3 0 7.8-3.5 7.8-7.8a7.8 7.8 0 0 0-2.203-5.503L13.6 2.326zM7.994 14.521a6.6 6.6 0 0 1-3.356-.92l-.24-.144-2.494.654.666-2.433-.156-.251a6.56 6.56 0 0 1-1.007-3.505c0-3.626 2.957-6.584 6.591-6.584a6.56 6.56 0 0 1 4.66 1.931 6.56 6.56 0 0 1 1.928 4.66c-.004 3.639-2.961 6.592-6.592 6.592m3.69-4.936c-.202-.102-1.202-.593-1.39-.658-.182-.065-.315-.099-.445.099-.133.197-.513.646-.627.775-.114.133-.232.148-.43.05-.197-.1-.836-.308-1.592-.985-.59-.525-.985-1.175-1.103-1.372-.114-.198-.011-.304.088-.403.09-.088.197-.232.296-.346.1-.114.133-.198.198-.33.065-.134.034-.248-.015-.347-.05-.099-.445-1.076-.612-1.47-.16-.389-.323-.335-.445-.34-.114-.007-.247-.007-.38-.007a.73.73 0 0 0-.529.247c-.182.198-.691.677-.691 1.654s.71 1.916.81 2.048c.098.133 1.394 2.132 3.383 2.992.47.205.84.326 1.129.418.475.152.904.129 1.246.08.38-.058 1.202-.493 1.373-1.026.171-.534.171-.992.121-1.087-.05-.099-.18-.159-.38-.26"/></svg>
                Cotizar
              </a>
            </div>
          </div>
        </div>
      `;
    }).join('');
  };
}
