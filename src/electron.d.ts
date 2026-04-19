interface ElectronAPI {
  // Placeholder: to be enriched in future phases (filesystem, IPC, etc.)
  readonly version?: string;
}

declare global {
  interface Window {
    electronAPI: ElectronAPI;
  }
}
