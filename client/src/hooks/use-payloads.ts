import { useState, useEffect } from "react";
import { type SavedPayload, type PayloadConfig } from "@shared/schema";
import { useLocalStorage } from "usehooks-ts";

export function usePayloadHistory() {
  const [history, setHistory] = useLocalStorage<SavedPayload[]>("vf-history", []);

  const addToHistory = (payload: SavedPayload) => {
    setHistory((prev) => [payload, ...prev].slice(0, 50)); // Keep last 50
  };

  const removeFromHistory = (id: string) => {
    setHistory((prev) => prev.filter((item) => item.id !== id));
  };

  const toggleFavorite = (id: string) => {
    setHistory((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, isFavorite: !item.isFavorite } : item
      )
    );
  };

  const clearHistory = () => {
    setHistory([]);
  };

  return {
    history,
    addToHistory,
    removeFromHistory,
    toggleFavorite,
    clearHistory,
  };
}

export function useTemplates() {
  // Static templates for now, could come from an API later
  const templates: Partial<SavedPayload>[] = [
    {
      name: "Standard Netcat Reverse",
      type: "nc_mkfifo",
      shell: "/bin/bash",
      obfuscation: "none",
    },
    {
      name: "Python 3 Stabilized",
      type: "python3",
      shell: "/bin/bash",
      obfuscation: "none",
    },
    {
      name: "PowerShell Evasion",
      type: "powershell",
      shell: "cmd.exe",
      obfuscation: "base64",
    },
    {
      name: "PHP Web Shell Connector",
      type: "php",
      shell: "/bin/sh",
      obfuscation: "none",
    },
  ];

  return { templates };
}
