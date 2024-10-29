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
    if (currentFolder) {
      window.electronAPI
        .getFiles(currentFolder)
        .then(({ activeFiles, archivedFiles }) => {
          setActiveFiles(activeFiles);
          setArchivedFiles(archivedFiles);
        });
    }
  }, [currentFolder]);

  // Handle new file creation
  useEffect(() => {
    const cleanup = window.electronAPI.onMenuNewFile(() => {
      handleFileOperation(
        async () => !!(await window.electronAPI.createNewFile(currentFolder!))
      );
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
    const cleanup = window.electronAPI.onMenuDeleteFile(() => {
      if (currentFile) {
        handleFileOperation(
          () => window.electronAPI.deleteFile(currentFolder!, currentFile),
          closeFile
        );
      }
    });
    return cleanup;
  }, [currentFolder, currentFile]);

  // Handle file archiving
  useEffect(() => {
    const cleanup = window.electronAPI.onMenuArchiveFile(() => {
      if (currentFile) {
        handleFileOperation(
          () =>
            window.electronAPI.archiveFile(currentFolder!, currentFile, false),
          closeFile
        );
      }
    });
    return cleanup;
  }, [currentFolder, currentFile]);

  // Handle file restoration
  useEffect(() => {
    const cleanup = window.electronAPI.onMenuRestoreFile(() => {
      if (currentFile) {
        const filename = currentFile.replace(
          new RegExp(`^${ARCHIVE_FOLDER}/`),
          ""
        );
        handleFileOperation(() =>
          window.electronAPI.archiveFile(currentFolder!, filename, true)
        );
      }
    });
    return cleanup;
  }, [currentFolder, currentFile]);

  // Handle archive/restore menu updates
  useEffect(() => {
    if (currentFile) {
      const isArchived = currentFile.startsWith(`${ARCHIVE_FOLDER}/`);
      window.electronAPI.updateMenuEnabled("Archive File", !isArchived);
      window.electronAPI.updateMenuEnabled("Restore File", isArchived);
    } else {
      window.electronAPI.updateMenuEnabled("Archive File", false);
      window.electronAPI.updateMenuEnabled("Restore File", false);
    }
  }, [currentFile]);

  // Handle file closing
  useEffect(() => {
    const cleanup = window.electronAPI.onMenuCloseFile(() => {
      closeFile();
    });
    return cleanup;
  }, []);

  const handleFileOperation = async (
    operation: () => Promise<boolean>,
    onSuccess?: () => void
  ) => {
    if (!currentFolder) return;

    const success = await operation();
    if (success) {
      if (onSuccess) onSuccess();
      const { activeFiles, archivedFiles } = await window.electronAPI.getFiles(
        currentFolder
      );
      setActiveFiles(activeFiles);
      setArchivedFiles(archivedFiles);
    }
  };

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
