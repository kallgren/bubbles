import { useState, useEffect, useCallback } from "react";
import { useSettings } from "./useSettings";

export function useFiles() {
  const { settings } = useSettings();

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

  const openFile = async (folderPath: string, filename: string) => {
    const content = await window.electronAPI.readFile(folderPath, filename);
    setCurrentFile(filename);
    setFileContent(content);
  };

  const closeFile = () => {
    setCurrentFile(null);
    setFileContent(null);
  };

  // Handle folder opening
  const handleOpenFolder = useCallback(async () => {
    const path = await window.electronAPI.openFolder();
    if (path) {
      setCurrentFolder(path);
      closeFile();
    }
  }, []);

  // Handle new file creation
  const handleNewFile = useCallback(async () => {
    if (!currentFolder) return;
    const filename = await window.electronAPI.createNewFile(currentFolder);
    if (filename) {
      openFile(currentFolder, filename);
      refreshFileLists();
    }
  }, [currentFolder]);

  // Handle file deletion
  const handleDeleteFile = useCallback(async () => {
    if (!currentFolder || !currentFile) return;
    const success = await window.electronAPI.deleteFile(
      currentFolder,
      currentFile
    );
    if (success) {
      closeFile();
      refreshFileLists();
    }
  }, [currentFolder, currentFile]);

  const getNextFile = (files: string[], currentFile: string) => {
    const currentIndex = files.findIndex((f) => f === currentFile);
    return files[currentIndex - 1] || files[currentIndex + 1] || null;
  };

  // Handle file archiving
  const handleArchiveFile = useCallback(async () => {
    if (!currentFolder || !currentFile) return;
    const nextFile = settings.autoAdvance
      ? getNextFile(activeFiles, currentFile)
      : null;
    const success = await window.electronAPI.archiveFile(
      currentFolder,
      currentFile,
      false
    );
    if (success) {
      if (nextFile) {
        openFile(currentFolder, nextFile);
      } else {
        closeFile();
      }
      refreshFileLists();
    }
  }, [currentFolder, currentFile, activeFiles, settings.autoAdvance]);

  // Handle file restoration
  const handleRestoreFile = useCallback(async () => {
    if (!currentFolder || !currentFile) return;
    const filename = currentFile.replace(
      new RegExp(`^${settings.archiveFolderName}/`),
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
  }, [currentFolder, currentFile, settings.archiveFolderName]);

  // Handle file closing
  const handleCloseFile = useCallback(() => {
    closeFile();
  }, []);

  // Navigation functions
  const handleNavigateToFirst = useCallback(() => {
    if (!currentFolder || !activeFiles.length) return;
    openFile(currentFolder, activeFiles[0]);
  }, [currentFolder, activeFiles]);

  const handleNavigateToLast = useCallback(() => {
    if (!currentFolder || !activeFiles.length) return;
    openFile(currentFolder, activeFiles[activeFiles.length - 1]);
  }, [currentFolder, activeFiles]);

  const handleNavigateToOlder = useCallback(() => {
    if (!currentFolder || !currentFile) return;

    const isArchived = currentFile.startsWith(`${settings.archiveFolderName}/`);
    const files = isArchived ? archivedFiles : activeFiles;
    const currentIndex = files.indexOf(currentFile);

    if (currentIndex < files.length - 1) {
      openFile(currentFolder, files[currentIndex + 1]);
    }
  }, [
    currentFolder,
    currentFile,
    activeFiles,
    archivedFiles,
    settings.archiveFolderName,
  ]);

  const handleNavigateToNewer = useCallback(() => {
    if (!currentFolder || !currentFile) return;

    const isArchived = currentFile.startsWith(`${settings.archiveFolderName}/`);
    const files = isArchived ? archivedFiles : activeFiles;
    const currentIndex = files.indexOf(currentFile);

    if (currentIndex > 0) {
      openFile(currentFolder, files[currentIndex - 1]);
    }
  }, [
    currentFolder,
    currentFile,
    activeFiles,
    archivedFiles,
    settings.archiveFolderName,
  ]);

  // Register menu event handlers
  useEffect(() => {
    const cleanup = window.electronAPI.onMenuOpenFolder(handleOpenFolder);
    return cleanup;
  }, [handleOpenFolder]);

  useEffect(() => {
    const cleanup = window.electronAPI.onMenuNewFile(handleNewFile);
    return cleanup;
  }, [handleNewFile]);

  useEffect(() => {
    const cleanup = window.electronAPI.onMenuDeleteFile(handleDeleteFile);
    return cleanup;
  }, [handleDeleteFile]);

  useEffect(() => {
    const cleanup = window.electronAPI.onMenuArchiveFile(handleArchiveFile);
    return cleanup;
  }, [handleArchiveFile]);

  useEffect(() => {
    const cleanup = window.electronAPI.onMenuRestoreFile(handleRestoreFile);
    return cleanup;
  }, [handleRestoreFile]);

  useEffect(() => {
    const cleanup = window.electronAPI.onMenuCloseFile(handleCloseFile);
    return cleanup;
  }, [handleCloseFile]);

  useEffect(() => {
    const cleanup = window.electronAPI.onMenuFirstItem(handleNavigateToFirst);
    return cleanup;
  }, [handleNavigateToFirst]);

  useEffect(() => {
    const cleanup = window.electronAPI.onMenuLastItem(handleNavigateToLast);
    return cleanup;
  }, [handleNavigateToLast]);

  useEffect(() => {
    const cleanup = window.electronAPI.onMenuPreviousItem(
      handleNavigateToOlder
    );
    return cleanup;
  }, [handleNavigateToOlder]);

  useEffect(() => {
    const cleanup = window.electronAPI.onMenuNextItem(handleNavigateToNewer);
    return cleanup;
  }, [handleNavigateToNewer]);

  // Update menu enabled states
  useEffect(() => {
    const hasFiles = activeFiles.length > 0;
    const hasCurrentFile = currentFile !== null;
    const isArchived = currentFile?.startsWith(
      `${settings.archiveFolderName}/`
    );
    const files = isArchived ? archivedFiles : activeFiles;
    const currentIndex = hasCurrentFile ? files.indexOf(currentFile) : -1;

    window.electronAPI.updateMenuEnabled("Newest Bubble", hasFiles);
    window.electronAPI.updateMenuEnabled("Oldest Bubble", hasFiles);
    window.electronAPI.updateMenuEnabled("Newer Bubble", currentIndex > 0);
    window.electronAPI.updateMenuEnabled(
      "Older Bubble",
      hasCurrentFile && currentIndex < files.length - 1
    );
    window.electronAPI.updateMenuEnabled(
      "Archive File",
      hasCurrentFile && !isArchived
    );
    window.electronAPI.updateMenuEnabled(
      "Restore File",
      hasCurrentFile && !!isArchived
    );
    window.electronAPI.updateMenuEnabled("Close File", hasCurrentFile);
    window.electronAPI.updateMenuEnabled("Delete File", hasCurrentFile);
  }, [currentFile, activeFiles, archivedFiles, settings.archiveFolderName]);

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
