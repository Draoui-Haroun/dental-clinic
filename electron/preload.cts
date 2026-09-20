
import { contextBridge, ipcRenderer } from "electron";

contextBridge.exposeInMainWorld("electronAPI", {
  exportBackup: (sourcePath: string) =>
    ipcRenderer.invoke("export-backup", sourcePath),
});