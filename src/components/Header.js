export function renderHeader() {
  const headerHTML = `
    <div class="container header-container">
      <a href="/" class="header-logo-link">
        <img src="/wp-content/uploads/2025/10/cropped-LOGO-ASAI-HORIZONTAL.png" alt="ASAI Internacional - Mangueras y Conexiones en México" class="header-logo">
      </a>
      
      <div class="header-actions">
        <button class="search-trigger" id="search-trigger" title="Buscar piezas...">
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
        </button>
      </div>

      <nav class="nav-menu" id="nav-menu">
        <a href="/" class="nav-link" data-path="/">INICIO</a>
        <a href="/nosotros.html" class="nav-link" data-path="/nosotros.html">NOSOTROS</a>
        <a href="/catalogo.html" class="nav-link" data-path="/catalogo.html">CATÁLOGO</a>
        <a href="/distribuidores.html" class="nav-link" data-path="/distribuidores.html">DISTRIBUIDORES</a>
        <a href="/ubicaciones.html" class="nav-link" data-path="/ubicaciones.html">UBICACIONES</a>
        <a href="/contacto.html" class="nav-link" data-path="/contacto.html">CONTACTO</a>
      </nav>
      
      <button class="menu-toggle" id="menu-toggle" aria-label="Toggle menu">
        <svg class="hamburger" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <line x1="4" x2="20" y1="12" y2="12" class="line-mid"/>
          <line x1="4" x2="20" y1="6" y2="6" class="line-top"/>
          <line x1="4" x2="20" y1="18" y2="18" class="line-bot"/>
        </svg>
      </button>
    </div>
    
    <!-- Premium Search Modal Overlay -->
    <div class="search-overlay" id="search-overlay">
      <div class="search-modal">
        <div class="search-modal-header">
          <h3>Buscador de Piezas y Catálogo</h3>
          <button class="search-close" id="search-close">&times;</button>
        </div>
        <div class="search-modal-body">
          <div class="search-input-wrapper">
            <input type="text" id="search-input" placeholder="Escribe palabra clave o número de parte (ej. NPT, JIC, Sinopulse, Cople)..." autocomplete="off">
            <svg class="search-input-icon" xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
          </div>
          <div class="search-results-info" id="search-results-info" style="display: none;"></div>
          <div class="search-results" id="search-results">
            <div class="search-empty-state">
              <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" fill="none" stroke="currentColor" stroke-width="1" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
              <p>Busca en nuestro almacén de más de 1,500 componentes industriales e hidráulicos</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  `;
  
  const headerElement = document.getElementById('site-header');
  if (headerElement) {
    headerElement.className = 'site-header';
    headerElement.innerHTML = headerHTML;
    
    // Set Active Menu Link dynamically
    const currentPath = window.location.pathname;
    const navLinks = headerElement.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
      const linkPath = link.getAttribute('data-path');
      // Handle home and subpages match
      if (currentPath === linkPath || 
          (linkPath !== '/' && currentPath.includes(linkPath)) || 
          (linkPath === '/' && (currentPath === '' || currentPath === '/index.html'))) {
        link.classList.add('active');
      }
    });
    
    // Toggle Mobile Navigation
    const menuToggle = document.getElementById('menu-toggle');
    const navMenu = document.getElementById('nav-menu');
    if (menuToggle && navMenu) {
      menuToggle.addEventListener('click', () => {
        navMenu.classList.toggle('nav-active');
        menuToggle.classList.toggle('toggle-active');
        
        const hamburger = menuToggle.querySelector('.hamburger');
        if (hamburger) {
          hamburger.classList.toggle('open');
        }
      });
    }
  }
}
