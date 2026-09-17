
import { app, BrowserWindow } from "electron";
import { spawn, ChildProcess } from "child_process";
import path from "path";
import http from "http";

let nextProcess: ChildProcess | null = null;

function startNextServer() {
    const serverPath = app.isPackaged
        ? path.join(
            process.resourcesPath,
            "app.asar.unpacked",
            ".next",
            "standalone",
            "server.js"
        )
        : path.join(process.cwd(), ".next", "standalone", "server.js");

    const databasePath = path.join(
        app.getPath("userData"),
        "database.db"
    );

    console.log("SERVER PATH:", serverPath);
    console.log("DATABASE PATH:", databasePath);

    nextProcess = spawn(process.execPath, [serverPath], {
        env: {
            ...process.env,
            ELECTRON_RUN_AS_NODE: "1",
            DENTAL_CLINIC_DB_PATH: databasePath,
            PORT: "3000",
            HOSTNAME: "127.0.0.1",
        },
        stdio: "inherit",
    });
}

function waitForServer(
    url: string,
    callback: () => void
) {
    const request = http.get(url, (response) => {
        response.resume();
        callback();
    });

    request.on("error", () => {
        setTimeout(() => {
            waitForServer(url, callback);
        }, 500);
    });
}

function createWindow() {
    const win = new BrowserWindow({
        width: 1400,
        height: 900,
        minWidth: 1100,
        minHeight: 700,
    });

    win.loadURL("http://127.0.0.1:3000/entry");
    win.webContents.openDevTools();
}

app.whenReady().then(() => {
    startNextServer();

    waitForServer("http://localhost:3000", () => {
        createWindow();
    });

    app.on("activate", () => {
        if (BrowserWindow.getAllWindows().length === 0) {
            createWindow();
        }
    });
});

app.on("window-all-closed", () => {
    if (nextProcess) {
        nextProcess.kill();
    }

    if (process.platform !== "darwin") {
        app.quit();
    }
});