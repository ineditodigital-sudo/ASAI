const ftp = require("basic-ftp");
const path = require("path");
const fs = require("fs");

// Copy .htaccess to dist manually because Vite ignores it
if (fs.existsSync('public/.htaccess')) {
    fs.copyFileSync('public/.htaccess', 'dist/.htaccess');
    console.log('Copied .htaccess to dist');
}

async function uploadDirSmart(client, localDir, remoteDir) {
    // Ensure the remote directory exists
    try {
        await client.ensureDir(remoteDir);
    } catch(e) {
        console.log("Error creating dir " + remoteDir, e.message);
    }
    
    // We must return to the root after ensureDir because ensureDir changes CWD
    await client.cd("/");
    
    const files = fs.readdirSync(localDir);
    
    // Get remote file list
    let remoteFiles = [];
    try {
        remoteFiles = await client.list(remoteDir);
    } catch(e) {}
    
    for (const file of files) {
        const localPath = path.join(localDir, file);
        const remotePath = remoteDir + "/" + file;
        const stat = fs.statSync(localPath);
        
        if (stat.isDirectory()) {
            if (remotePath.includes('wp-content/cache')) continue;
            await uploadDirSmart(client, localPath, remotePath);
        } else {
            const remoteFile = remoteFiles.find(f => f.name === file);
            if (remoteFile && remoteFile.size === stat.size) {
                // Skip if same size
                continue;
            }
            console.log(`Uploading: ${remotePath}`);
            try {
                // We are at root, so we upload to absolute-like path
                await client.uploadFrom(localPath, remotePath);
            } catch(e) {
                console.log(`Failed to upload ${remotePath}: ${e.message}`);
            }
        }
    }
}

async function run() {
    const client = new ftp.Client();
    try {
        await client.access({
            host: "184.168.20.11",
            user: "asaiint",
            password: 'YOUR_FTP_PASSWORD',
            secure: false
        });
        
        console.log("Connected to FTP. Uploading dist directory smartly...");
        // Start from root directory. ensureDir will navigate.
        await client.cd("/");
        await uploadDirSmart(client, path.join(__dirname, 'dist'), 'public_html');
        console.log("Upload completed!");
    }
    catch(err) {
        console.log(err);
    }
    client.close();
}

run();
