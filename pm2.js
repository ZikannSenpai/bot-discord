const pm2 = require("pm2");

function formatBytes(bytes) {
    return (bytes / 1024 / 1024).toFixed(2) + " MB";
}

function formatUptime(ms) {
    const s = Math.floor(ms / 1000);
    const h = Math.floor(s / 3600);
    const m = Math.floor((s % 3600) / 60);
    const sec = s % 60;

    return `${h}h ${m}m ${sec}s`;
}

function loadStats() {
    pm2.list((err, list) => {
        if (err) return console.error(err);

        console.clear();

        console.log("============== PM2 ==============\n");

        for (const app of list) {
            console.log(`📦 Name    : ${app.name}`);
            console.log(`🆔 ID      : ${app.pm_id}`);
            console.log(`⚙ Status  : ${app.pm2_env.status}`);
            console.log(`🖥 PID     : ${app.pid}`);
            console.log(`🔥 CPU     : ${app.monit.cpu}%`);
            console.log(`💾 RAM     : ${formatBytes(app.monit.memory)}`);
            console.log(
                `⏳ Uptime  : ${formatUptime(Date.now() - app.pm2_env.pm_uptime)}`
            );
            console.log(`🔄 Restart : ${app.pm2_env.restart_time}`);
            console.log("---------------------------------\n");
        }
    });
}

pm2.connect(err => {
    if (err) throw err;

    loadStats();
    setInterval(loadStats, 1000);

    process.on("SIGINT", () => {
        pm2.disconnect();
        process.exit(0);
    });
});
