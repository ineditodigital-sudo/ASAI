const ftp = require("basic-ftp");
const path = require("path");
const fs = require("fs");
const https = require("https");

const FTP_CONFIG = {
  host: "184.168.20.11",
  user: "asaiint",
  password: 'YOUR_FTP_PASSWORD',
  secure: false
};

const WP_UPLOADS_LOCAL = "e:/ASAI/NUEVO SITIO ASAI/wp-content/uploads";
const DIST_DIR = path.join(__dirname, "dist");

function checkStatus(urlPath) {
  return new Promise((resolve) => {
    const req = https.get("https://asaiint.com" + urlPath, (res) => {
      // Consume response to free socket
      res.resume();
      resolve(res.statusCode);
    });
    req.on("error", () => resolve(0));
    req.setTimeout(8000, () => { req.destroy(); resolve(0); });
  });
}

async function run() {
  // Collect all wp-content/uploads image references from all HTML files
  const htmlFiles = fs.readdirSync(DIST_DIR).filter(f => f.endsWith(".html"));
  const imageRefs = new Set();

  for (const file of htmlFiles) {
    const content = fs.readFileSync(path.join(DIST_DIR, file), "utf8");
    const matches = content.match(/\/wp-content\/uploads\/[^\s"'<>)]+/g) || [];
    matches.forEach(m => {
      const clean = m.split("?")[0].split('"')[0].split("'")[0];
      if (clean.match(/\.(jpg|jpeg|png|webp|gif|svg|ico|pdf)$/i)) {
        imageRefs.add(clean);
      }
    });
  }

  console.log(`Found ${imageRefs.size} unique image references in HTML`);

  // Check which ones are NOT 200 on the server
  const refs = [...imageRefs];
  const missing = [];
  
  console.log("Checking which images are missing (not 200) on server...");
  for (let i = 0; i < refs.length; i += 5) {
    const batch = refs.slice(i, i + 5);
    const results = await Promise.all(batch.map(async (ref) => {
      const status = await checkStatus(ref);
      return { ref, status };
    }));
    results.forEach(({ ref, status }) => {
      if (status !== 200) {
        missing.push(ref);
        process.stdout.write(`\n  MISSING(${status}): ${ref}`);
      }
    });
    process.stdout.write(`\rChecked ${Math.min(i + 5, refs.length)}/${refs.length}...`);
  }
  
  console.log(`\n\n${missing.length} images missing from server`);

  if (missing.length === 0) {
    console.log("All images are already on the server!");
    return;
  }

  // Upload missing images
  const client = new ftp.Client();
  client.ftp.verbose = false;

  try {
    await client.access(FTP_CONFIG);
    await client.cd("/");
    const createdDirs = new Set();

    let uploaded = 0, notFound = 0;
    for (const ref of missing) {
      const localPath = path.join(
        WP_UPLOADS_LOCAL,
        ref.replace("/wp-content/uploads/", "").replace(/\//g, path.sep)
      );
      const remotePath = "public_html" + ref;
      const remoteDir = path.dirname(remotePath).replace(/\\/g, "/");

      if (!fs.existsSync(localPath)) {
        console.log("NOT IN BACKUP:", ref);
        notFound++;
        continue;
      }

      if (!createdDirs.has(remoteDir)) {
        try { await client.ensureDir(remoteDir); await client.cd("/"); } catch (e) {}
        createdDirs.add(remoteDir);
      }

      try {
        await client.uploadFrom(localPath, remotePath);
        console.log("Uploaded:", ref);
        uploaded++;
      } catch (e) {
        console.log("Failed:", ref, e.message);
      }
    }

    console.log(`\nDone! Uploaded: ${uploaded}, Not in backup: ${notFound}`);
  } catch (err) {
    console.error("FTP Error:", err.message);
  }
  client.close();
}

run();
