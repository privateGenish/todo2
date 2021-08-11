const path = require("path");

async function helloWorld(req, res) {
  return res.sendFile(process.cwd() + "/assets/helloWorld.html");
}

module.exports = { helloWorld };
