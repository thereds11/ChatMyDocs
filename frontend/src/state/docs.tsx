import React, { createContext, useContext, useEffect, useMemo, useReducer } from "react";
import { getStats, ingestFiles, resetStore } from "../api/rag";

type State = {
  selected: File[];
  hasDocs: boolean;
  docCount: number;
  busy: boolean;
};

type Action =
  | { type: "PICK_APPEND"; files: File[] }
  | { type: "REMOVE"; index: number }
  | { type: "CLEAR_SELECTED" }
  | { type: "SET_STATS"; docCount: number; hasDocs: boolean }
  | { type: "RESET_LOCAL" }
  | { type: "BUSY"; on: boolean };

const initial: State = { selected: [], hasDocs: false, docCount: 0, busy: false };

function dedupe(files: File[]) {
  const map = new Map<string, File>();
  for (const f of files) {
    const key = `${f.name}:${f.size}:${(f as File).lastModified ?? 0}`;
    if (!map.has(key)) map.set(key, f);
  }
  return Array.from(map.values());
}

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case "PICK_APPEND":
      return { ...state, selected: dedupe([...state.selected, ...action.files]) };
    case "REMOVE": {
      const next = state.selected.slice();
      next.splice(action.index, 1);
      return { ...state, selected: next };
    }
    case "CLEAR_SELECTED":
      return { ...state, selected: [] };
    case "SET_STATS":
      return { ...state, docCount: action.docCount, hasDocs: action.hasDocs };
    case "RESET_LOCAL":
      return { ...initial };
    case "BUSY":
      return { ...state, busy: action.on };
    default:
      return state;
  }
}

const Ctx = createContext<ReturnType<typeof useDocsStore> | null>(null);

function useDocsStore() {
  const [state, dispatch] = useReducer(reducer, initial);

  async function refresh() {
    const s = await getStats();
    dispatch({ type: "SET_STATS", docCount: s.documents, hasDocs: s.documents > 0 });
  }

  const api = useMemo(() => ({
    state,
    refresh,
    pickFiles: (files: File[]) => dispatch({ type: "PICK_APPEND", files }),
    removeSelected: (index: number) => dispatch({ type: "REMOVE", index }),

    confirm: async () => {
      if (state.selected.length === 0) return;
      dispatch({ type: "BUSY", on: true });
      try {
        await ingestFiles(state.selected);
        const s = await getStats();
        dispatch({ type: "SET_STATS", docCount: s.documents, hasDocs: s.documents > 0 });
        dispatch({ type: "CLEAR_SELECTED" });
      } finally {
        dispatch({ type: "BUSY", on: false });
      }
    },

    reset: async () => {
      dispatch({ type: "BUSY", on: true });
      try {
        await resetStore();
        dispatch({ type: "RESET_LOCAL" });
      } finally {
        dispatch({ type: "BUSY", on: false });
      }
    },
  }), [state]); // state captured so sizes update

  // On mount: detect existing store (useful if backend already has docs)
  useEffect(() => { refresh(); }, []);

  return api;
}

export function DocsProvider({ children }: { children: React.ReactNode }) {
  const store = useDocsStore();
  return <Ctx.Provider value={store}>{children}</Ctx.Provider>;
}

export function useDocs() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useDocs must be used within DocsProvider");
  return ctx;
}
