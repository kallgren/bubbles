import { useState, useEffect, useCallback } from "react";
import { useSettings } from "./useSettings";

function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout;

  return function executedFunction(...args: Parameters<T>) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };

    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

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

  const getNextFile = (files: string[], currentFile: string) => {
    const currentIndex = files.findIndex((f) => f === currentFile);
    return files[currentIndex - 1] || files[currentIndex + 1] || null;
  };

  // Handle file archiving
  useEffect(() => {
    const cleanup = window.electronAPI.onMenuArchiveFile(async () => {
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
    });
    return cleanup;
  }, [currentFolder, currentFile, activeFiles, settings.autoAdvance]);

  // Handle file restoration
  useEffect(() => {
    const cleanup = window.electronAPI.onMenuRestoreFile(async () => {
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
    });
    return cleanup;
  }, [currentFolder, currentFile]);

  // Handle menu updates
  useEffect(() => {
    if (currentFile) {
      const isArchived = currentFile.startsWith(
        `${settings.archiveFolderName}/`
      );
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

  const [unsavedChanges, setUnsavedChanges] = useState(false);

  const saveCurrentFile = useCallback(
    async (content: string) => {
      if (!currentFolder || !currentFile) return;

      const success = await window.electronAPI.saveFile(
        currentFolder,
        currentFile,
        content
      );

      if (success) {
        setUnsavedChanges(false);
      }
    },
    [currentFolder, currentFile]
  );

  // Create debounced save function
  const debouncedSave = useCallback(
    debounce((content: string) => {
      saveCurrentFile(content);
    }, 1000),
    [saveCurrentFile]
  );

  const handleContentChange = (newContent: string) => {
    setFileContent(newContent);
    setUnsavedChanges(true);
    debouncedSave(newContent);
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
    handleContentChange,
    unsavedChanges,
  };
}
