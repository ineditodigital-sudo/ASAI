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
        
        await client.cd("public_html");
        
        console.log("Fixing permissions for wp-content...");
        try {
            await client.send('SITE CHMOD 755 wp-content');
        } catch(e) {
            console.log(e.message);
        }
        
        try {
            await client.send('SITE CHMOD 755 wp-content/uploads');
        } catch(e) {
            console.log(e.message);
        }

        try {
            // Check if there is an .htaccess blocking in wp-content
            const list = await client.list('wp-content');
            if (list.some(i => i.name === '.htaccess')) {
                console.log('Removing .htaccess from wp-content');
                await client.remove('wp-content/.htaccess');
            }
        } catch(e) {}
        
    }
    catch(err) {
        console.log(err);
    }
    client.close();
}

run();
