const ftp = require("basic-ftp");

async function run() {
    const client = new ftp.Client();
    client.ftp.verbose = true;
    try {
        await client.access({
            host: "184.168.20.11",
            user: "asaiint",
            password: 'YOUR_FTP_PASSWORD',
            secure: false
        });
        
        console.log("Connected to FTP");
        
        // Go to public_html
        await client.cd("public_html");
        
        // List directories
        const list = await client.list();
        console.log("Contents of public_html:");
        for (const item of list) {
            console.log(item.name, item.isDirectory ? '(DIR)' : '(FILE)');
        }
        
        // Let's delete old WordPress folders that might conflict with our HTML files
        const foldersToDelete = [
            'nosotros',
            'contacto',
            'wp-admin',
            'wp-includes',
            'hidraulica',
            'neumatica',
            'adaptadores',
            'industrial',
            'coples-rapidos',
            'cam-lock',
            'accesorios',
            'equipos'
        ];
        
        for (const folder of foldersToDelete) {
            try {
                // Check if exists
                const items = await client.list();
                if (items.some(i => i.name === folder && i.isDirectory)) {
                    console.log(`Removing directory ${folder}...`);
                    await client.removeDir(folder); // basic-ftp removeDir doesn't recurse easily, but we can try clearWorkingDir
                }
            } catch (e) {
                console.log(`Failed to remove ${folder}: ${e.message}`);
            }
        }

        // Check if there's an .htaccess blocking uploads
        try {
            await client.cd("wp-content/uploads");
            const uploadItems = await client.list();
            if (uploadItems.some(i => i.name === '.htaccess')) {
                console.log('Removing .htaccess from wp-content/uploads');
                await client.remove('.htaccess');
            }
            await client.cd("../../");
        } catch(e) {
            console.log('Error checking uploads .htaccess:', e.message);
        }

    }
    catch(err) {
        console.log(err);
    }
    client.close();
}

run();
