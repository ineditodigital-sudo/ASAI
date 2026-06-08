const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const distDir = path.join(__dirname, 'dist');
const htmlFiles = fs.readdirSync(distDir).filter(f => f.endsWith('.html'));

console.log(`Uploading ${htmlFiles.length} files using curl.exe...`);

let success = 0;
for (const f of htmlFiles) {
    const localPath = path.join(distDir, f);
    const remoteUrl = `ftp://184.168.20.11/public_html/${f}`;
    const cmd = `curl.exe -s -T "${localPath}" "${remoteUrl}" --user "asaiint:Inedito%1314"`;
    
    try {
        execSync(cmd);
        success++;
        console.log(`Uploaded: ${f}`);
    } catch (err) {
        console.error(`Failed to upload ${f}:`, err.message);
    }
}

console.log(`Successfully uploaded ${success} out of ${htmlFiles.length} files.`);
