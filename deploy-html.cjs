const ftp = require("basic-ftp");
const fs = require("fs");
const path = require("path");

const FTP_CONFIG = {
  host: "184.168.20.11",
  user: "asaiint",
  password: 'Inedito%1314',
  secure: false,
  timeout: 60000 // 60 seconds
};

const distDir = path.join(__dirname, "dist");
const htmlFiles = fs.readdirSync(distDir).filter(f => f.endsWith('.html'));

async function deployHTML() {
  const client = new ftp.Client();
  client.ftp.verbose = true;
  
  let connected = false;
  let retries = 5;
  
  while (!connected && retries > 0) {
    try {
      console.log("Connecting to FTP... Retries left:", retries);
      await client.access(FTP_CONFIG);
      connected = true;
    } catch (e) {
      retries--;
      console.error("Connection failed:", e.message);
      await new Promise(r => setTimeout(r, 5000)); // wait 5s before reconnect
    }
  }

  if (!connected) {
    console.error("Could not connect to FTP server.");
    return;
  }
  
  try {
    let successCount = 0;
    for (const f of htmlFiles) {
      const localPath = path.join(distDir, f);
      const remotePath = "public_html/" + f;
      
      console.log(`Uploading: ${f}`);
      try {
        await client.uploadFrom(localPath, remotePath);
        successCount++;
      } catch (err) {
        console.error(`Failed to upload ${f}:`, err.message);
      }
    }
    
    console.log(`Successfully uploaded ${successCount} HTML files.`);
  } catch (err) {
    console.error("Deploy failed:", err);
  }
  client.close();
}

deployHTML();
