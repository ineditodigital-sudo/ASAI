export function renderCategoryProducts() {
  const container = document.getElementById('category-products-container');
  if (!container) return;
  
  const targetCategory = container.getAttribute('data-category');
  if (!targetCategory) return;
  
  container.innerHTML = `
    <div class="flex-center" style="grid-column: 1 / -1; padding: 4rem 0;">
      <div class="spinner" style="border: 4px solid var(--color-border); border-top-color: var(--color-primary); border-radius: 50%; width: 40px; height: 40px; animation: spin 1s linear infinite;"></div>
    </div>
    <style>
      @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
      .product-grid-list { display: grid; grid-template-columns: repeat(3, 1fr); gap: 2rem; width: 100%; }
      .product-item-card { background: var(--color-bg-white); border: 1px solid var(--color-border); border-radius: var(--border-radius-md); padding: 2rem; display: flex; flex-direction: column; transition: all var(--transition-normal); box-shadow: var(--shadow-sm); }
      .product-item-card:hover { transform: translateY(-5px); box-shadow: var(--shadow-lg); border-color: var(--color-accent); }
      .product-item-img { width: 100%; height: 180px; border-radius: var(--border-radius-sm); overflow: hidden; margin-bottom: 1.5rem; background-color: var(--color-bg-light); border: 1px solid var(--color-border); }
      .product-item-img img { width: 100%; height: 100%; object-fit: cover; }
      .product-item-title { font-size: 1.25rem; margin-bottom: 0.8rem; color: var(--color-primary-dark); }
      .product-item-desc { font-size: 0.9rem; color: var(--color-text-muted); line-height: 1.5; margin-bottom: 1.5rem; flex-grow: 1; }
      .product-item-actions { display: flex; gap: 1rem; flex-wrap: wrap; margin-top: auto; border-top: 1px solid var(--color-border); padding-top: 1rem; }
      .product-btn-wa { background-color: #25d366; color: white !important; font-family: var(--font-heading); font-size: 0.8rem; font-weight: 500; padding: 0.6rem 1.2rem; border-radius: var(--border-radius-sm); display: inline-flex; align-items: center; justify-content: center; flex-grow: 1; }
      .product-btn-wa:hover { background-color: #20ba56; transform: translateY(-2px); box-shadow: 0 4px 12px rgba(37, 211, 102, 0.3); }
      @media (max-width: 992px) { .product-grid-list { grid-template-columns: repeat(2, 1fr); } }
      @media (max-width: 576px) { .product-grid-list { grid-template-columns: 1fr; } }
    </style>
  `;
  
  fetch('/catalog-data.json')
    .then(response => response.json())
    .then(data => {
      // Filter products by category (case-insensitive or exact match)
      // Allow secondary category matching for specialized categories
      const filtered = data.filter(item => {
        const cat = item.category.toLowerCase();
        const target = targetCategory.toLowerCase();
        return cat.includes(target) || target.includes(cat);
      });
      
      if (filtered.length === 0) {
        container.innerHTML = `
          <div class="text-center" style="grid-column: 1 / -1; padding: 4rem 1.5rem; color: var(--color-text-muted);">
            <p style="font-size: 1.1rem; margin-bottom: 1.5rem;">Próximamente agregaremos componentes de alta presión detallados para esta sección.</p>
            <a href="https://wa.me/524498134627?text=Hola%20ASAI,%20necesito%20cotizar%20productos%20de%20la%20categoria:%20${encodeURIComponent(targetCategory)}" target="_blank" class="btn btn-accent">Cotizar Productos por WhatsApp</a>
          </div>
        `;
        return;
      }
      
      // Render product grid
      container.innerHTML = `
        <div class="product-grid-list">
          ${filtered.map(item => {
            const waText = encodeURIComponent(`Hola ASAI Internacional, me interesa solicitar una cotización formal y ficha técnica del producto: ${item.name}`);
            const waLink = `https://wa.me/524498134627?text=${waText}`;
            
            return `
              <div class="product-item-card animate-fade-in">
                <div class="product-item-img">
                  <img src="${item.image}" alt="${item.name}" loading="lazy">
                </div>
                <h3 class="product-item-title">${item.name}</h3>
                <p class="product-item-desc">${item.description}</p>
                <div class="product-item-actions">
                  <a href="${waLink}" target="_blank" class="product-btn-wa">
                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="currentColor" viewBox="0 0 16 16" style="margin-right: 6px;"><path d="M13.601 2.326A7.85 7.85 0 0 0 8 .258c-4.3 0-7.8 3.5-7.8 7.8 0 1.37.356 2.717 1.036 3.9L.1 16l4.223-1.109a7.8 7.8 0 0 0 3.677.927c4.3 0 7.8-3.5 7.8-7.8a7.8 7.8 0 0 0-2.203-5.503L13.6 2.326zM7.994 14.521a6.6 6.6 0 0 1-3.356-.92l-.24-.144-2.494.654.666-2.433-.156-.251a6.56 6.56 0 0 1-1.007-3.505c0-3.626 2.957-6.584 6.591-6.584a6.56 6.56 0 0 1 4.66 1.931 6.56 6.56 0 0 1 1.928 4.66c-.004 3.639-2.961 6.592-6.592 6.592m3.69-4.936c-.202-.102-1.202-.593-1.39-.658-.182-.065-.315-.099-.445.099-.133.197-.513.646-.627.775-.114.133-.232.148-.43.05-.197-.1-.836-.308-1.592-.985-.59-.525-.985-1.175-1.103-1.372-.114-.198-.011-.304.088-.403.09-.088.197-.232.296-.346.1-.114.133-.198.198-.33.065-.134.034-.248-.015-.347-.05-.099-.445-1.076-.612-1.47-.16-.389-.323-.335-.445-.34-.114-.007-.247-.007-.38-.007a.73.73 0 0 0-.529.247c-.182.198-.691.677-.691 1.654s.71 1.916.81 2.048c.098.133 1.394 2.132 3.383 2.992.47.205.84.326 1.129.418.475.152.904.129 1.246.08.38-.058 1.202-.493 1.373-1.026.171-.534.171-.992.121-1.087-.05-.099-.18-.159-.38-.26"/></svg>
                    Cotizar por WhatsApp
                  </a>
                </div>
              </div>
            `;
          }).join('')}
        </div>
      `;
    })
    .catch(error => {
      console.error("Error loading products for category:", error);
      container.innerHTML = `
        <div class="text-center" style="grid-column: 1 / -1; padding: 4rem 1.5rem; color: var(--color-accent-secondary);">
          <p>Ocurrió un error al cargar los componentes. Por favor, intenta recargar la página.</p>
        </div>
      `;
    });
}

// Auto init if window contains the renderer script import
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', renderCategoryProducts);
} else {
  renderCategoryProducts();
}
