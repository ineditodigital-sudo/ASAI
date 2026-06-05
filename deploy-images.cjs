const ftp = require("basic-ftp");
const path = require("path");

const FTP_CONFIG = {
  host: "184.168.20.11",
  user: "asaiint",
  password: 'Inedito%1314',
  secure: false
};

const distDir = path.join(__dirname, "dist");
const imagesToUpload = [
    'wp-content/uploads/2026/03/adaptadores-acero-724x1024.webp',
    'wp-content/uploads/2026/03/hidraulica-724x1024.webp',
    'wp-content/uploads/2026/03/neumatica-724x1024.webp',
    'wp-content/uploads/2026/03/cam-lock-724x1024.webp',
    'wp-content/uploads/2026/03/accesorios-724x1024.webp',
    'wp-content/uploads/2026/03/coples-rapidos-724x1024.webp',
    'wp-content/uploads/2026/03/industrial-1-724x1024.webp',
    'wp-content/uploads/2026/03/equipo-724x1024.webp',
    'wp-content/uploads/2025/10/LOGOTIPO-ASAI-COLORES-768x237.webp',
    'wp-content/uploads/2026/04/LOGO-ATREVETE-FULL-1-1-768x109.webp',
    'wp-content/uploads/2026/02/Banner-patrocinadores-Rieleros.webp'
];

async function run() {
  const client = new ftp.Client();
  try {
    console.log("Connecting to FTP...");
    await client.access(FTP_CONFIG);
    
    for (const relPath of imagesToUpload) {
      const localPath = path.join(distDir, relPath);
      const remotePath = ("public_html/" + relPath).replace(/\\/g, "/");
      const remoteDir = path.dirname(remotePath).replace(/\\/g, "/");
      const fileName = path.basename(remotePath);
      
      // Go back to root before ensureDir
      await client.cd("/");
      await client.ensureDir(remoteDir);
      
      console.log(`Uploading: ${fileName} to ${remoteDir}`);
      await client.uploadFrom(localPath, fileName);
    }
    
    console.log("Images deploy complete!");
  } catch (err) {
    console.error("Deploy failed:", err);
  }
  client.close();
}

run();
