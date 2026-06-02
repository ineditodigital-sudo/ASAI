const ftp = require("basic-ftp");

async function fixIndex() {
  const client = new ftp.Client();
  try {
    await client.access({
      host: "184.168.20.11",
      user: "asaiint",
      password: "Inedito%1314",
      secure: false
    });
    console.log("Connected.");
    await client.cd("public_html");
    await client.rename("index.php", "index.php.bak");
    console.log("Renamed index.php to index.php.bak");
  } catch (err) {
    console.error(err);
  }
  client.close();
}

fixIndex();
