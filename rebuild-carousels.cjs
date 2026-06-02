const fs = require('fs');
const path = require('path');

const distDir = path.join(__dirname, 'dist');
const filesToFix = ['index.html', 'distribuidores.html'];

filesToFix.forEach(file => {
  const filePath = path.join(distDir, file);
  if (!fs.existsSync(filePath)) return;
  
  let html = fs.readFileSync(filePath, 'utf8');

  // Remove the old injected script
  html = html.replace(/<style>\s*\/\* Custom Carousel Styles \*\/[\s\S]*?<\/script>/i, '');

  const swiperSetup = `
<style>
/* Premium Carousel Styles */
.elementor-image-carousel-wrapper {
    position: relative;
    padding: 0 40px; /* Space for arrows */
}
.swiper-container, .swiper {
    width: 100%;
    height: 100%;
    overflow: hidden;
    position: relative;
    padding-bottom: 20px;
}
.swiper-wrapper {
    display: flex;
    transition-property: transform;
    box-sizing: content-box;
}
.swiper-slide {
    flex-shrink: 0;
    width: 100%;
    position: relative;
    transition: property-transform;
}
.swiper-slide figure {
    margin: 0;
    overflow: hidden;
    border-radius: 16px;
    position: relative;
    box-shadow: 0 10px 20px rgba(0,0,0,0.08);
    transition: transform 0.4s cubic-bezier(0.165, 0.84, 0.44, 1), box-shadow 0.4s ease;
    background: #fff;
    height: 100%;
    display: flex;
    flex-direction: column;
}
.swiper-slide figure:hover {
    transform: translateY(-8px);
    box-shadow: 0 15px 30px rgba(0,20,125,0.15);
}
.swiper-slide img {
    width: 100%;
    height: 250px;
    object-fit: cover;
    transition: transform 0.7s ease;
}
/* For distributor logos, keep them contained */
.page-distribuidores .swiper-slide img {
    object-fit: contain;
    height: 150px;
    padding: 20px;
}
.swiper-slide figure:hover img {
    transform: scale(1.08);
}

/* Elegant Captions for Soluciones */
.elementor-image-carousel-caption {
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    background: linear-gradient(to top, rgba(0, 20, 125, 0.95) 0%, rgba(0, 20, 125, 0.7) 60%, transparent 100%);
    color: white;
    padding: 30px 15px 15px;
    text-align: center;
    font-weight: 600;
    font-size: 1.1rem;
    font-family: 'LemonMilk', 'Montserrat', sans-serif;
    margin: 0;
    letter-spacing: 1px;
    text-transform: uppercase;
    transition: padding 0.3s ease;
}
.swiper-slide figure:hover .elementor-image-carousel-caption {
    padding-bottom: 20px;
}

/* Modern Navigation Arrows */
.swiper-button-next, .swiper-button-prev {
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    width: 44px;
    height: 44px;
    background: white;
    color: #00147d;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 50%;
    cursor: pointer;
    z-index: 10;
    box-shadow: 0 4px 12px rgba(0,0,0,0.15);
    transition: all 0.3s ease;
    border: 1px solid #f0f0f0;
}
.swiper-button-next:hover, .swiper-button-prev:hover {
    background: #00147d;
    color: white;
    box-shadow: 0 6px 16px rgba(0,20,125,0.3);
}
.swiper-button-prev { left: -5px; }
.swiper-button-next { right: -5px; }
.swiper-button-next::after, .swiper-button-prev::after {
    font-size: 18px !important;
    font-weight: bold;
}
.swiper-pagination {
    bottom: 0px !important;
}
.swiper-pagination-bullet-active {
    background: #1a5c3a !important;
}
@media (max-width: 768px) {
    .elementor-image-carousel-wrapper { padding: 0 20px; }
    .swiper-button-prev { left: -10px; }
    .swiper-button-next { right: -10px; }
    .swiper-slide img { height: 200px; }
}
</style>
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/swiper@11/swiper-bundle.min.css" />
<script src="https://cdn.jsdelivr.net/npm/swiper@11/swiper-bundle.min.js"></script>
<script id="custom-carousel-init">
document.addEventListener('DOMContentLoaded', function() {
    // Flag body with page name for specific styling
    if(window.location.pathname.includes('distribuidores')) {
        document.body.classList.add('page-distribuidores');
    }

    const carousels = document.querySelectorAll('.elementor-image-carousel-wrapper .swiper-container, .elementor-image-carousel-wrapper .swiper');
    
    carousels.forEach(container => {
        const wrapper = container.closest('.elementor-image-carousel-wrapper');
        
        // Remove old buttons if any exist
        const oldBtns = wrapper.querySelectorAll('.swiper-button-next, .swiper-button-prev, .swiper-pagination');
        oldBtns.forEach(btn => btn.remove());

        // Create new navigation and pagination elements
        const next = document.createElement('div');
        next.className = 'swiper-button-next';
        const prev = document.createElement('div');
        prev.className = 'swiper-button-prev';
        const pagination = document.createElement('div');
        pagination.className = 'swiper-pagination';
        
        // Add them outside the overflow hidden container but inside the relative wrapper
        wrapper.appendChild(prev);
        wrapper.appendChild(next);
        container.appendChild(pagination);

        new Swiper(container, {
            slidesPerView: 1,
            spaceBetween: 20,
            loop: true,
            grabCursor: true,
            autoplay: {
                delay: 3500,
                disableOnInteraction: false,
                pauseOnMouseEnter: true
            },
            navigation: {
                nextEl: next,
                prevEl: prev,
            },
            pagination: {
                el: pagination,
                clickable: true,
            },
            breakpoints: {
                500: { slidesPerView: 2, spaceBetween: 20 },
                768: { slidesPerView: 3, spaceBetween: 25 },
                1024: { slidesPerView: 4, spaceBetween: 30 },
            }
        });
    });
});
</script>
`;
    
    html = html.replace('</body>', swiperSetup + '\n</body>');
    fs.writeFileSync(filePath, html);
    console.log(`Updated premium Swiper in ${file}`);
});
