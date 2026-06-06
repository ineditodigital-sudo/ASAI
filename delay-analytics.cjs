const fs = require('fs');
const path = require('path');
const distDir = path.join(__dirname, 'dist');

const htmlFiles = fs.readdirSync(distDir).filter(f => f.endsWith('.html'));
let modified = 0;

const delayScript = `
<script>
  function asaiLoadAnalytics() {
    if(window.asaiAnalyticsLoaded) return;
    window.asaiAnalyticsLoaded = true;
    
    // GTM
    var gtm = document.createElement('script');
    gtm.src = "https://www.googletagmanager.com/gtag/js?id=GT-55B3HQN9";
    document.body.appendChild(gtm);
    
    window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}
    gtag("set","linker",{"domains":["asaiint.com"]});gtag("js",new Date());gtag("set","developer_id.dZTNiMT",true);gtag("config","GT-55B3HQN9");

    // FB Pixel
    !function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,document,'script','https://connect.facebook.net/en_US/fbevents.js');
    fbq('init','822861206703929');fbq('track','PageView');
  }
  ['mousemove','scroll','touchstart','click'].forEach(function(e) {
      window.addEventListener(e, asaiLoadAnalytics, {once:true});
  });
  setTimeout(asaiLoadAnalytics, 6000);
</script>
`;

htmlFiles.forEach(f => {
    let p = path.join(distDir, f);
    let html = fs.readFileSync(p, 'utf8');
    let originalHtml = html;

    // Remove old GTM script
    let gtmRegex1 = /<script src="https:\/\/www\.googletagmanager\.com\/gtag\/js\?id=GT-55B3HQN9" id="google_gtagjs-js"[^>]*><\/script>\s*/i;
    let gtmRegex2 = /<script id="google_gtagjs-js-after">[^<]+<\/script>\s*/i;
    
    html = html.replace(gtmRegex1, '');
    html = html.replace(gtmRegex2, '');

    // Remove FB Pixel script
    let fbRegex = /<script>[^<]*fbevents\.js[^<]*fbq\('track','PageView'\);<\/script>\s*/i;
    html = html.replace(fbRegex, '');

    // Inject delay script at the end of body
    if (html !== originalHtml) {
        if (!html.includes('asaiLoadAnalytics')) {
            html = html.replace('</body>', delayScript + '\n</body>');
        }
        
        fs.writeFileSync(p, html);
        let rootP = path.join(__dirname, f);
        if (fs.existsSync(rootP)) {
            fs.writeFileSync(rootP, html);
        }
        modified++;
    }
});

console.log('Analytics delayed in ' + modified + ' files.');
