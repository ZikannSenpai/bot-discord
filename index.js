const fs = require("fs");
const path = require("path");
const log = require("./lib/logger.js");

const folders = ["start", "setting", "slash"];
const timers = new Map();

function loadFile(file) {
    try {
        delete require.cache[require.resolve(file)];
        require(file);
        log.logger.success(`Loaded: ${file}`);
    } catch (err) {
        log.logger.error(`Failed: ${file}\n${err.stack}`);
    }
}

function loadFolder(dir) {
    const files = fs.readdirSync(dir);

    for (const file of files) {
        const full = path.join(dir, file);
        const stat = fs.statSync(full);

        if (stat.isDirectory()) {
            if (["node_modules", ".git"].includes(file)) continue;
            loadFolder(full);
        } else if (file.endsWith(".js")) {
            loadFile(full);
        }
    }
}

function watchFolder(dir) {
    fs.watch(dir, { recursive: true }, (_, filename) => {
        if (!filename || !filename.endsWith(".js")) return;

        const full = path.join(dir, filename);

        // file yang ga boleh di hot reload
        if (
            full.endsWith(path.join("start", "client.js")) ||
            full.endsWith("index.js")
        )
            return;

        if (!fs.existsSync(full)) return;

        clearTimeout(timers.get(full));

        timers.set(
            full,
            setTimeout(() => {
                try {
                    delete require.cache[require.resolve(full)];
                    require(full);
                    log.logger.warn(`Reloaded: ${filename}`);
                } catch (err) {
                    log.logger.error(
                        `Failed Reload: ${filename}\n${err.stack}`
                    );
                }
            }, 300)
        );
    });
}

for (const folder of folders) {
    const dir = path.join(__dirname, folder);

    if (!fs.existsSync(dir)) {
        log.logger.error(`Folder tidak ditemukan: ${folder}`);
        continue;
    }

    log.logger.info(`Loading folder: ${folder}`);
    loadFolder(dir);
    watchFolder(dir);
}

log.logger.success("Hot Reload Aktif");
