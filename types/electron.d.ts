
export {};

declare global {
  interface Window {
    electronAPI: {
      exportBackup: (
        sourcePath: string
      ) => Promise<{
        canceled: boolean;
        filePath?: string;
      }>;
    };
  }
}