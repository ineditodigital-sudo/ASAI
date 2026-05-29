const fs = require('fs');
const path = require('path');

const distDir = path.join(__dirname, 'dist');
const uploadsDistDir = path.join(distDir, 'wp-content', 'uploads');
const uploadsSrcDir = path.join(__dirname, 'wp-content', 'uploads');

const referencedUrls = new Set();

function scanDirForReferences(dir) {
    if (!fs.existsSync(dir)) return;
    const items = fs.readdirSync(dir);
    for (const item of items) {
        const fullPath = path.join(dir, item);
        if (fs.statSync(fullPath).isDirectory()) {
            scanDirForReferences(fullPath);
        } else if (['.html', '.css', '.js', '.json'].includes(path.extname(fullPath))) {
            const content = fs.readFileSync(fullPath, 'utf8');
            // Regex to match URLs like /wp-content/uploads/...
            const regex = /\/wp-content\/uploads\/[^"'\s\)]+/g;
            let match;
            while ((match = regex.exec(content)) !== null) {
                // Decode URI component in case of encoded characters
                try {
                    referencedUrls.add(decodeURIComponent(match[0]));
                } catch(e) {
                    referencedUrls.add(match[0]);
                }
            }
        }
    }
}

// 1. Collect all references from dist
scanDirForReferences(distDir);
console.log(`Found ${referencedUrls.size} unique references to /wp-content/uploads/`);

let deletedCount = 0;
let deletedBytes = 0;

function cleanupUnreferencedFiles(dir, baseDir) {
    if (!fs.existsSync(dir)) return;
    const items = fs.readdirSync(dir);
    for (const item of items) {
        const fullPath = path.join(dir, item);
        if (fs.statSync(fullPath).isDirectory()) {
            cleanupUnreferencedFiles(fullPath, baseDir);
        } else {
            // Convert file path to a URL path format to check against our Set
            const relPath = fullPath.replace(baseDir, '').replace(/\\/g, '/');
            const urlPath = `/wp-content/uploads${relPath}`;
            
            let isReferenced = false;
            for (const ref of referencedUrls) {
                // Some references might have query params like ?ver=1.0 or end with different cases
                if (ref.includes(urlPath)) {
                    isReferenced = true;
                    break;
                }
            }

            if (!isReferenced) {
                const stat = fs.statSync(fullPath);
                deletedBytes += stat.size;
                fs.unlinkSync(fullPath);
                deletedCount++;
                
                // Also delete from src if it exists
                const srcPath = path.join(uploadsSrcDir, relPath);
                if (fs.existsSync(srcPath)) {
                    fs.unlinkSync(srcPath);
                }
            }
        }
    }
}

// 2. Cleanup unreferenced files from dist/wp-content/uploads (and sync to src)
cleanupUnreferencedFiles(uploadsDistDir, uploadsDistDir);

console.log(`Deleted ${deletedCount} unreferenced files.`);
console.log(`Freed ${(deletedBytes / 1024 / 1024).toFixed(2)} MB of space.`);
