const ftp = require("basic-ftp");

async function listDir() {
  const client = new ftp.Client();
  client.ftp.verbose = false;
  try {
    await client.access({
      host: "184.168.20.11",
      user: "asaiint",
      password: "Inedito%1314",
      secure: false
    });
    console.log("Connected.");
    const list = await client.list("public_html");
    for (const item of list) {
      if (item.name.includes("index")) {
        console.log(item.name, item.size, item.type);
      }
    }
    console.log("Done.");
  } catch (err) {
    console.error(err);
  }
  client.close();
}

listDir();
