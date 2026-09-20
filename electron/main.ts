
import { app, BrowserWindow, dialog, ipcMain } from "electron";
import { spawn, ChildProcess } from "child_process";
import path from "path";
import http from "http";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

let nextProcess: ChildProcess | null = null;

function startNextServer() {
    const serverPath = app.isPackaged
        ? path.join(process.resourcesPath, "app.asar.unpacked", ".next", "standalone", "server.js")
        : path.join(process.cwd(), ".next", "standalone", "server.js");

    // مسار جذر المشروع بعد التعبئة (حيث يوجد مجلد db مع schema.sql)
    const appRoot = app.isPackaged
        ? path.join(process.resourcesPath, "app.asar.unpacked")
        : process.cwd();

    const schemaPath = path.join(appRoot, "db", "schema.sql");

    const databasePath = path.join(app.getPath("userData"), "database.db");
    const backupDirectory = path.join(app.getPath("userData"), "backups");

    console.log("SERVER PATH:", serverPath);
    console.log("SCHEMA PATH:", schemaPath);
    console.log("DATABASE PATH:", databasePath);

    nextProcess = spawn(process.execPath, [serverPath], {
        env: {
            ...process.env,
            ELECTRON_RUN_AS_NODE: "1",
            DENTAL_CLINIC_DB_PATH: databasePath,
            DENTAL_CLINIC_SCHEMA_PATH: schemaPath,   // جديد
            PORT: "3000",
            HOSTNAME: "127.0.0.1",
            DENTAL_CLINIC_BACKUP_DIR: backupDirectory,
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
        autoHideMenuBar: true,

        webPreferences: {
            preload: path.join(__dirname, "preload.cjs"),
            contextIsolation: true,
            nodeIntegration: false,
        },
    });
    win.setMenuBarVisibility(false);

    win.loadURL("http://127.0.0.1:3000/entry");
}

ipcMain.handle("export-backup", async (_event, sourcePath: string) => {
    const result = await dialog.showSaveDialog({
        title: "Exporter la sauvegarde",
        defaultPath: "sauvegarde-cabinet.db",
        filters: [
            {
                name: "Base de données SQLite",
                extensions: ["db"],
            },
        ],
    });

    if (result.canceled || !result.filePath) {
        return { canceled: true };
    }

    const fs = await import("fs/promises");

    await fs.copyFile(sourcePath, result.filePath);

    return {
        canceled: false,
        filePath: result.filePath,
    };
});

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

