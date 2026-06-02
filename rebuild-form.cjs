const fs = require('fs');
const path = require('path');

const contactHtmlPath = path.join(__dirname, 'dist', 'contacto.html');
let html = fs.readFileSync(contactHtmlPath, 'utf8');

const newFormHtml = `
<div class="custom-contact-form-wrapper">
    <style>
        .custom-contact-form-wrapper {
            background: #ffffff;
            padding: 40px;
            border-radius: 12px;
            box-shadow: 0 10px 30px rgba(0, 0, 0, 0.05);
            max-width: 800px;
            margin: 0 auto;
            font-family: 'Roboto', sans-serif;
        }
        .custom-form-grid {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 20px;
        }
        .custom-form-group.full-width {
            grid-column: 1 / -1;
        }
        .custom-form-label {
            display: block;
            margin-bottom: 8px;
            font-weight: 600;
            color: #00147d;
            font-size: 14px;
        }
        .custom-form-input {
            width: 100%;
            padding: 12px 15px;
            border: 1px solid #d1d1d1;
            border-radius: 8px;
            font-size: 16px;
            transition: all 0.3s ease;
            box-sizing: border-box;
            background: #f8fafc;
        }
        .custom-form-input:focus {
            border-color: #1a5c3a;
            outline: none;
            box-shadow: 0 0 0 3px rgba(26, 92, 58, 0.1);
            background: #ffffff;
        }
        textarea.custom-form-input {
            resize: vertical;
            min-height: 120px;
        }
        .custom-form-btn {
            background: #1a5c3a;
            color: white;
            padding: 15px 30px;
            border: none;
            border-radius: 8px;
            font-size: 16px;
            font-weight: bold;
            cursor: pointer;
            transition: background 0.3s ease, transform 0.2s ease;
            width: 100%;
            text-transform: uppercase;
            letter-spacing: 1px;
        }
        .custom-form-btn:hover {
            background: #0f3460;
            transform: translateY(-2px);
        }
        .custom-form-btn:disabled {
            background: #a0aec0;
            cursor: not-allowed;
            transform: none;
        }
        .honeypot-field {
            display: none !important;
        }
        @media (max-width: 600px) {
            .custom-form-grid {
                grid-template-columns: 1fr;
            }
        }
    </style>

    <form id="asai-contact-form" action="/contact.php" method="POST">
        <!-- Anti-spam honeypot -->
        <input type="text" name="website_url" class="honeypot-field" tabindex="-1" autocomplete="off">
        
        <div class="custom-form-grid">
            <div class="custom-form-group">
                <label class="custom-form-label" for="form_name">Nombre Completo *</label>
                <input type="text" id="form_name" name="name" class="custom-form-input" required placeholder="Ej. Juan Pérez">
            </div>
            
            <div class="custom-form-group">
                <label class="custom-form-label" for="form_company">Empresa (Opcional)</label>
                <input type="text" id="form_company" name="company" class="custom-form-input" placeholder="Nombre de tu empresa">
            </div>
            
            <div class="custom-form-group">
                <label class="custom-form-label" for="form_phone">Teléfono / WhatsApp *</label>
                <input type="tel" id="form_phone" name="phone" class="custom-form-input" required placeholder="Ej. 55 1234 5678">
            </div>
            
            <div class="custom-form-group">
                <label class="custom-form-label" for="form_email">Correo Electrónico *</label>
                <input type="email" id="form_email" name="email" class="custom-form-input" required placeholder="tu@correo.com">
            </div>
            
            <div class="custom-form-group full-width">
                <label class="custom-form-label" for="form_location">Ciudad y Estado *</label>
                <input type="text" id="form_location" name="location" class="custom-form-input" required placeholder="Ej. Monterrey, N.L.">
            </div>
            
            <div class="custom-form-group full-width">
                <label class="custom-form-label" for="form_message">Mensaje / Especificaciones Técnicas *</label>
                <textarea id="form_message" name="message" class="custom-form-input" required placeholder="¿En qué podemos ayudarte? Describe los productos que necesitas cotizar."></textarea>
            </div>
            
            <div class="custom-form-group full-width">
                <button type="submit" class="custom-form-btn">Enviar Cotización</button>
            </div>
        </div>
    </form>
</div>
`;

// Replace the old form logic (which might be the old script I injected, and the <form> container)
// Let's just find the <form id="asai-contact-form"> ... </form> and replace it.
// Also remove the old script I injected.

html = html.replace(/<form[^>]*id="asai-contact-form"[^>]*>[\s\S]*?<\/form>/i, newFormHtml);
html = html.replace(/<script id="asai-contact-form-handler">[\s\S]*?<\/script>/i, ''); // Remove the old inline script to replace it with a cleaner one.

// Add the new script
const newScript = `
<script id="asai-contact-form-handler">
document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('asai-contact-form');
    if(form) {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            const btn = form.querySelector('button[type="submit"]');
            const originalText = btn.innerHTML;
            btn.innerHTML = 'Enviando...';
            btn.disabled = true;

            const formData = new FormData(form);
            const data = new URLSearchParams(formData);

            fetch('/contact.php', {
                method: 'POST',
                body: data,
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
            })
            .then(res => res.json())
            .then(data => {
                alert(data.message);
                if(data.status === 'success') form.reset();
            })
            .catch(err => {
                console.error(err);
                alert('Hubo un error al enviar el formulario. Por favor, comunícate vía telefónica.');
            })
            .finally(() => {
                btn.innerHTML = originalText;
                btn.disabled = false;
            });
        });
    }
});
</script>
`;
html = html.replace('</body>', newScript + '\n</body>');

fs.writeFileSync(contactHtmlPath, html);
console.log('contact.html updated with new form.');
