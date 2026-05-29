const ftp = require("basic-ftp");
const path = require("path");
const fs = require("fs");
const crypto = require("crypto");

const MANIFEST_FILE = path.join(__dirname, ".deploy-manifest.json");
const FTP_CONFIG = {
  host: "184.168.20.11",
  user: "asaiint",
  password: 'YOUR_FTP_PASSWORD',
  secure: false
};

function md5(filePath) {
  const buf = fs.readFileSync(filePath);
  return crypto.createHash("md5").update(buf).digest("hex");
}

function loadManifest() {
  if (fs.existsSync(MANIFEST_FILE)) {
    return JSON.parse(fs.readFileSync(MANIFEST_FILE, "utf8"));
  }
  return {};
}

function saveManifest(manifest) {
  fs.writeFileSync(MANIFEST_FILE, JSON.stringify(manifest, null, 2));
}

function collectFiles(dir, baseDir = dir, result = []) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const fullPath = path.join(dir, entry.name);
    const relPath = path.relative(baseDir, fullPath).replace(/\\/g, "/");

    // Skip these heavy/unchanged folders
    if (entry.isDirectory()) {
      if (
        relPath.startsWith("wp-content/uploads") ||
        relPath.startsWith("wp-content/plugins") ||
        relPath.startsWith("wp-content/themes") ||
        relPath.startsWith("wp-content/cache") ||
        relPath === "assets" // skip Vite hashed assets if already deployed
      ) {
        continue;
      }
      collectFiles(fullPath, baseDir, result);
    } else {
      result.push({ fullPath, relPath });
    }
  }
  return result;
}

async function run() {
  // Copy .htaccess
  if (fs.existsSync("public/.htaccess")) {
    fs.copyFileSync("public/.htaccess", "dist/.htaccess");
  }

  const manifest = loadManifest();
  const distDir = path.join(__dirname, "dist");
  const files = collectFiles(distDir);

  // Find changed files
  const toUpload = [];
  for (const { fullPath, relPath } of files) {
    const hash = md5(fullPath);
    if (manifest[relPath] !== hash) {
      toUpload.push({ fullPath, relPath, hash });
    }
  }

  // Also always include css/ folder since that's critical
  const cssDir = path.join(distDir, "css");
  if (fs.existsSync(cssDir)) {
    for (const f of fs.readdirSync(cssDir)) {
      const fullPath = path.join(cssDir, f);
      const relPath = "css/" + f;
      const hash = md5(fullPath);
      if (manifest[relPath] !== hash) {
        if (!toUpload.find(x => x.relPath === relPath)) {
          toUpload.push({ fullPath, relPath, hash });
        }
      }
    }
  }

  // Also include assets/ folder
  const assetsDir = path.join(distDir, "assets");
  if (fs.existsSync(assetsDir)) {
    for (const f of fs.readdirSync(assetsDir)) {
      const fullPath = path.join(assetsDir, f);
      const relPath = "assets/" + f;
      const hash = md5(fullPath);
      if (manifest[relPath] !== hash) {
        if (!toUpload.find(x => x.relPath === relPath)) {
          toUpload.push({ fullPath, relPath, hash });
        }
      }
    }
  }

  if (toUpload.length === 0) {
    console.log("Nothing to upload, all files are up to date!");
    return;
  }

  console.log(`Uploading ${toUpload.length} changed/new files...`);

  const client = new ftp.Client();
  client.ftp.verbose = false;

  try {
    await client.access(FTP_CONFIG);
    await client.cd("/");

    const createdDirs = new Set();

    for (const { fullPath, relPath, hash } of toUpload) {
      const remotePath = "public_html/" + relPath;
      const remoteDir = path.dirname(remotePath).replace(/\\/g, "/");

      if (!createdDirs.has(remoteDir)) {
        try {
          await client.ensureDir(remoteDir);
          await client.cd("/");
        } catch (e) {}
        createdDirs.add(remoteDir);
      }

      console.log("Uploading:", remotePath);
      try {
        await client.uploadFrom(fullPath, remotePath);
        manifest[relPath] = hash;
      } catch (e) {
        console.log("Failed:", remotePath, "-", e.message);
      }
    }

    saveManifest(manifest);
    console.log("Deploy complete!");
  } catch (err) {
    console.error("FTP Error:", err);
  }

  client.close();
}

run();
