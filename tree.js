const fs = require("fs");
const path = require("path");

const ignore = new Set([
    ".git",
    "node_modules",
    ".next",
    ".vercel",
    ".turbo",
    ".cache",
    "dist",
    "build",
    "coverage",
    ".idea",
    ".vscode"
]);

function tree(dir, prefix = "") {
    const files = fs
        .readdirSync(dir)
        .filter(file => !ignore.has(file))
        .sort((a, b) => {
            const aDir = fs.statSync(path.join(dir, a)).isDirectory();
            const bDir = fs.statSync(path.join(dir, b)).isDirectory();

            if (aDir !== bDir) return bDir - aDir;
            return a.localeCompare(b);
        });

    files.forEach((file, index) => {
        const full = path.join(dir, file);
        const last = index === files.length - 1;
        const stat = fs.statSync(full);

        console.log(`${prefix}${last ? "└── " : "├── "}${file}`);

        if (stat.isDirectory()) {
            tree(full, prefix + (last ? "    " : "│   "));
        }
    });
}

console.log(path.basename(process.cwd()));
tree(process.cwd());
