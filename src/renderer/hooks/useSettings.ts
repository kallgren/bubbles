import { useState, useEffect } from "react";
import { DEFAULT_SETTINGS } from "../../config";
import { Settings } from "../../types/electron";

export function useSettings() {
  const [settings, setSettings] = useState<Settings>(DEFAULT_SETTINGS);

  useEffect(() => {
    const loadSettings = async () => {
      const savedSettings = await window.electronAPI.getSettings();
      setSettings({ ...DEFAULT_SETTINGS, ...savedSettings });
    };
    loadSettings();
  }, []);

  const updateSettings = async (newSettings: Partial<Settings>) => {
    const updated = { ...settings, ...newSettings };
    const success = await window.electronAPI.saveSettings(updated);
    if (success) {
      setSettings(updated);
    }
  };

  return { settings, updateSettings };
}
