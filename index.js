const fs = require("fs");
const path = require("path");
const log = require("./lib/logger.js");
// daftar folder yang mau di-load
const folders = ["start", "setting"];

function loadFolder(targetPath) {
    const items = fs.readdirSync(targetPath);

    for (const item of items) {
        const full = path.join(targetPath, item);
        const stat = fs.statSync(full);

        if (stat.isDirectory()) {
            loadFolder(full); // recursive
        } else if (item.endsWith(".js")) {
            require(full);
            log.success(`Loaded: ${full}`);
        }
    }
}

for (const folder of folders) {
    const absolutePath = path.join(__dirname, folder);
    if (fs.existsSync(absolutePath)) {
        log.info(`\n📁 Loading folder: ${folder}`);
        loadFolder(absolutePath);
    } else {
        log.error(`⚠️ Folder nggak ditemukan: ${folder}`);
    }
}
