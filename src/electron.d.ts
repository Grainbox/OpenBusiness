interface ElectronAPI {
  // To be enriched in future phases (filesystem, IPC, etc.)
}

declare global {
  interface Window {
    electronAPI: ElectronAPI
  }
}
