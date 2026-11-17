import { useCallback, useEffect, useRef, useState } from "react";
import {
  commit,
  initialDocument,
  parseDocument,
  redo,
  storageKey,
  undo,
  type History,
  type StudioDocument,
} from "./model";

export function useDesignDocument() {
  const [history, setHistory] = useState<History<StudioDocument>>({
    past: [],
    present: initialDocument,
    future: [],
  });
  const blocked = useRef(false);
  const [ready, setReady] = useState(false);
  const [message, setMessage] = useState("Loading design…");
  useEffect(() => {
    try {
      const saved = localStorage.getItem(storageKey);
      if (saved) setHistory({ past: [], present: parseDocument(saved), future: [] });
      setMessage("Saved locally");
    } catch {
      blocked.current = true;
      setMessage("Saved design could not be loaded. Export a backup before leaving.");
    }
    setReady(true);
  }, []);
  useEffect(() => {
    if (!ready || blocked.current) return;
    try {
      localStorage.setItem(storageKey, JSON.stringify(history.present));
      setMessage("Saved locally");
    } catch {
      setMessage("Local storage unavailable — export to keep your changes.");
    }
  }, [history.present, ready]);
  const update = useCallback((change: (document: StudioDocument) => StudioDocument) => {
    blocked.current = false;
    setHistory((current) => commit(current, change(current.present)));
  }, []);
  return {
    document: history.present,
    ready,
    message,
    setMessage,
    update,
    canUndo: !!history.past.length,
    canRedo: !!history.future.length,
    undo: useCallback(() => setHistory(undo), []),
    redo: useCallback(() => setHistory(redo), []),
  };
}
