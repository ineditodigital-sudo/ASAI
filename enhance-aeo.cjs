const fs = require('fs');
const path = require('path');

const cssPath = path.join(__dirname, 'dist', 'css', 'main.css');

const premiumCss = `
/* Premium AEO Block */
.aeo-quick-answer {
    max-width: 850px !important;
    margin: 40px auto 50px auto !important;
    background: linear-gradient(145deg, #ffffff, #f8fafc) !important;
    border: 1px solid rgba(0, 20, 125, 0.1) !important;
    border-left: 6px solid #00147d !important;
    border-radius: 12px !important;
    padding: 30px 40px !important;
    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.04), 0 1px 3px rgba(0, 0, 0, 0.02) !important;
    font-family: 'Montserrat', sans-serif !important;
    position: relative !important;
    overflow: hidden !important;
    transition: transform 0.3s ease, box-shadow 0.3s ease !important;
}

.aeo-quick-answer:hover {
    transform: translateY(-2px) !important;
    box-shadow: 0 25px 50px rgba(0, 0, 0, 0.06), 0 2px 5px rgba(0, 0, 0, 0.03) !important;
}

.aeo-quick-answer::before {
    content: '' !important;
    position: absolute !important;
    top: 0 !important;
    right: 0 !important;
    width: 250px !important;
    height: 100% !important;
    background: linear-gradient(90deg, rgba(255,255,255,0) 0%, rgba(0,20,125,0.03) 100%) !important;
    pointer-events: none !important;
}

.aeo-quick-answer-title {
    font-weight: 800 !important;
    font-size: 1.15rem !important;
    color: #00147d !important;
    margin-bottom: 15px !important;
    display: flex !important;
    align-items: center !important;
    gap: 12px !important;
    text-transform: uppercase !important;
    letter-spacing: 0.5px !important;
}
.aeo-quick-answer-title svg {
    width: 24px !important;
    height: 24px !important;
    fill: #00147d !important;
    filter: drop-shadow(0 2px 4px rgba(0,20,125,0.2)) !important;
}
.aeo-quick-answer p {
    margin: 0 !important;
    font-size: 1.1rem !important;
    line-height: 1.7 !important;
    color: #475569 !important;
}
.aeo-quick-answer strong {
    color: #00147d !important;
    font-weight: 700 !important;
}
.aeo-quick-answer em {
    color: #64748b !important;
    font-style: italic !important;
}
@media (max-width: 768px) {
    .aeo-quick-answer {
        margin: 30px 20px !important;
        padding: 20px 25px !important;
    }
}
/* End Premium AEO Block */
`;

if (fs.existsSync(cssPath)) {
    let css = fs.readFileSync(cssPath, 'utf8');
    // Remove the old block
    const startIdx = css.indexOf('/* AEO & GEO Visual Enhancements */');
    if (startIdx !== -1) {
        css = css.substring(0, startIdx);
    }
    const premiumStartIdx = css.indexOf('/* Premium AEO Block */');
    if (premiumStartIdx !== -1) {
        css = css.substring(0, premiumStartIdx);
    }
    
    css += '\\n' + premiumCss;
    fs.writeFileSync(cssPath, css);
    console.log('Premium CSS updated.');
} else {
    console.log('main.css not found.');
}
