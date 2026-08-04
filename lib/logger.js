const chalk = require("chalk");
const symbols = require("log-symbols");

const color = {
    info: chalk.cyan,
    success: chalk.green,
    warning: chalk.yellow,
    error: chalk.red
};

function time() {
    return chalk.gray(
        `[${new Date().toLocaleTimeString("id-ID", {
            hour12: false
        })}]`
    );
}

function print(type, text) {
    console.log(
        `${time()} ${symbols[type] || ""} ${color[type]?.(text) || text}`
    );
}

module.exports = {
    info: text => print("info", text),
    success: text => print("success", text),
    warning: text => print("warning", text),
    error: text => print("error", text),

    custom(type, title, text) {
        console.log(
            `${time()} ${chalk.bold(`[${type}]`)} ${chalk.white(title)} ${chalk.gray("→")} ${text}`
        );
    }
};
