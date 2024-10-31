import { useState, useEffect } from "react";
import { ARCHIVE_FOLDER } from "../../config";

export function useFiles() {
  // Get initial folder from URL
  const params = new URLSearchParams(window.location.search);
  const initialFolder = params.get("folder");
  const decodedFolder = initialFolder
    ? decodeURIComponent(initialFolder)
    : null;

  // File system state
  const [currentFolder, setCurrentFolder] = useState<string | null>(
    decodedFolder
  );
  const [activeFiles, setActiveFiles] = useState<string[]>([]);
  const [archivedFiles, setArchivedFiles] = useState<string[]>([]);

  // Current file state
  const [currentFile, setCurrentFile] = useState<string | null>(null);
  const [fileContent, setFileContent] = useState<string | null>(null);

  // Load files when folder changes
  useEffect(() => {
    refreshFileLists();
  }, [currentFolder]);

  const refreshFileLists = async () => {
    if (!currentFolder) return;
    const { activeFiles, archivedFiles } = await window.electronAPI.getFiles(
      currentFolder
    );
    setActiveFiles(activeFiles);
    setArchivedFiles(archivedFiles);
  };

  // Handle new file creation
  useEffect(() => {
    const cleanup = window.electronAPI.onMenuNewFile(async () => {
      if (!currentFolder) return;
      const filename = await window.electronAPI.createNewFile(currentFolder);
      if (filename) {
        openFile(currentFolder, filename);
        refreshFileLists();
      }
    });
    return cleanup;
  }, [currentFolder]);

  // Handle folder opening
  useEffect(() => {
    const cleanup = window.electronAPI.onMenuOpenFolder(async () => {
      const path = await window.electronAPI.openFolder();
      if (path) {
        setCurrentFolder(path);
        closeFile();
      }
    });

    return cleanup;
  }, []);

  const openFile = async (folderPath: string, filename: string) => {
    const content = await window.electronAPI.readFile(folderPath, filename);
    setCurrentFile(filename);
    setFileContent(content);
  };

  const closeFile = () => {
    setCurrentFile(null);
    setFileContent(null);
  };

  // Handle file deletion
  useEffect(() => {
    const cleanup = window.electronAPI.onMenuDeleteFile(async () => {
      if (!currentFolder || !currentFile) return;
      const success = await window.electronAPI.deleteFile(
        currentFolder,
        currentFile
      );
      if (success) {
        closeFile();
        refreshFileLists();
      }
    });
    return cleanup;
  }, [currentFolder, currentFile]);

  // Handle file archiving
  useEffect(() => {
    const cleanup = window.electronAPI.onMenuArchiveFile(async () => {
      if (!currentFolder || !currentFile) return;
      const success = await window.electronAPI.archiveFile(
        currentFolder,
        currentFile,
        false
      );
      if (success) {
        closeFile();
        refreshFileLists();
      }
    });
    return cleanup;
  }, [currentFolder, currentFile]);

  // Handle file restoration
  useEffect(() => {
    const cleanup = window.electronAPI.onMenuRestoreFile(async () => {
      if (!currentFolder || !currentFile) return;
      const filename = currentFile.replace(
        new RegExp(`^${ARCHIVE_FOLDER}/`),
        ""
      );
      const success = await window.electronAPI.archiveFile(
        currentFolder,
        filename,
        true
      );
      if (success) {
        refreshFileLists();
      }
    });
    return cleanup;
  }, [currentFolder, currentFile]);

  // Handle menu updates
  useEffect(() => {
    if (currentFile) {
      const isArchived = currentFile.startsWith(`${ARCHIVE_FOLDER}/`);
      window.electronAPI.updateMenuEnabled("Archive File", !isArchived);
      window.electronAPI.updateMenuEnabled("Restore File", isArchived);
      window.electronAPI.updateMenuEnabled("Close File", true);
      window.electronAPI.updateMenuEnabled("Delete File", true);
    } else {
      window.electronAPI.updateMenuEnabled("Archive File", false);
      window.electronAPI.updateMenuEnabled("Restore File", false);
      window.electronAPI.updateMenuEnabled("Close File", false);
      window.electronAPI.updateMenuEnabled("Delete File", false);
    }
  }, [currentFile]);

  // Handle file closing
  useEffect(() => {
    const cleanup = window.electronAPI.onMenuCloseFile(() => {
      closeFile();
    });
    return cleanup;
  }, []);

  return {
    // File system
    currentFolder,
    activeFiles,
    archivedFiles,
    // Current file
    currentFile,
    fileContent,
    // Actions
    openFile,
    closeFile,
  };
}
