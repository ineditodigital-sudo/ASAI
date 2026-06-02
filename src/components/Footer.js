export function renderFooter() {
  const footerHTML = `
    <!-- PRE-FOOTER CTA verde -->
    <div class="banner-cta">
      <div class="container">
        <h2 class="banner-cta-title">¿LISTO PARA TRABAJAR CON LOS MEJORES?</h2>
        <p style="color:rgba(255,255,255,0.88); font-family:'Roboto',sans-serif; font-size:16px; margin-bottom:24px;">
          Contáctanos hoy y descubre por qué somos el líder en mangueras y conexiones en México
        </p>
        <a href="/contacto.html" class="btn btn-outline-white">Contáctanos Ahora</a>
      </div>
    </div>

    <!-- FOOTER PRINCIPAL -->
    <div class="footer-grid container">

      <!-- Col 1: Logo + Descripción -->
      <div class="footer-brand">
        <img
          src="/wp-content/uploads/2025/10/cropped-LOGO-ASAI-HORIZONTAL.png"
          alt="ASAI Internacional"
          class="footer-logo"
        />
        <p class="footer-desc">
          Distribuidores exclusivos de mangueras y conexiones en México.<br>
          Respaldando a la Industria Mexicana con productos premium, stock inmediato y asesoría técnica de primer nivel desde el día 1.
        </p>
      </div>

      <!-- Col 2: Enlaces Rápidos -->
      <div>
        <h4 class="footer-col-title">Enlaces Rápidos</h4>
        <ul class="footer-links">
          <li><a href="/" class="footer-link">Inicio</a></li>
          <li><a href="/nosotros.html" class="footer-link">Nosotros</a></li>
          <li><a href="/catalogo.html" class="footer-link">Catálogo</a></li>
          <li><a href="/distribuidores.html" class="footer-link">Distribuidores</a></li>
          <li><a href="/ubicaciones.html" class="footer-link">Ubicaciones</a></li>
          <li><a href="/contacto.html" class="footer-link">Contacto</a></li>
          <li><a href="/blog" class="footer-link">Blog</a></li>
        </ul>
      </div>

      <!-- Col 3: Productos -->
      <div>
        <h4 class="footer-col-title">Productos</h4>
        <ul class="footer-links">
          <li><a href="/neumatica" class="footer-link">Neumática</a></li>
          <li><a href="/hidraulica" class="footer-link">Hidráulica</a></li>
          <li><a href="/industrial" class="footer-link">Industrial</a></li>
          <li><a href="/adaptadores" class="footer-link">Adaptadores</a></li>
          <li><a href="/coples-rapidos" class="footer-link">Coples Rápidos</a></li>
          <li><a href="/cam-lock" class="footer-link">Cam Lock</a></li>
          <li><a href="/accesorios" class="footer-link">Accesorios</a></li>
          <li><a href="/equipos" class="footer-link">Equipos</a></li>
        </ul>
      </div>

      <!-- Col 4: Contacto -->
      <div>
        <h4 class="footer-col-title">Contacto</h4>

        <div class="footer-contact-item">
          <span class="footer-contact-icon">🕐</span>
          <div class="footer-contact-text">
            L-V 09:00-18:00 hrs.<br>
            Sáb. 09:00-13:00 hrs.
          </div>
        </div>

        <div class="footer-contact-item">
          <span class="footer-contact-icon">📞</span>
          <div class="footer-contact-text">
            <a href="tel:4498134627">449 813 4627</a><br>
            <a href="tel:4493134027">449 313 4027</a>
          </div>
        </div>

        <div class="footer-contact-item">
          <span class="footer-contact-icon">✉️</span>
          <div class="footer-contact-text">
            <a href="mailto:[email protected]">atencionclientes@asaiint.com</a>
          </div>
        </div>

        <div class="footer-contact-item">
          <span class="footer-contact-icon">📍</span>
          <div class="footer-contact-text">
            Carolina Villanueva de García<br>
            #322-8,<br>
            C.P. 20396<br>
            Aguascalientes, Aguascalientes<br>
            México
          </div>
        </div>
      </div>
    </div>

    <!-- FOOTER BOTTOM -->
    <div class="footer-bottom">
      <div class="container" style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:10px;">
        <p class="footer-copy">© 2025 Asai Internacional. Todos los derechos reservados.</p>
        <div class="footer-legal-links">
          <a href="/aviso-de-privacidad">Aviso de Privacidad</a>
          <a href="/terminos-y-condiciones">Términos y Condiciones</a>
        </div>
      </div>
    </div>
  `;

  const footerElement = document.getElementById('site-footer');
  if (footerElement) {
    footerElement.className = 'site-footer';
    footerElement.innerHTML = footerHTML;
  }
}
