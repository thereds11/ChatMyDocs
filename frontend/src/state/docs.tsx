import React, { createContext, useContext, useMemo, useReducer } from "react";

type State = {
  selected: File[];
  hasDocs: boolean;
  docCount: number;
  busy: boolean;
};

type Action =
  | { type: "PICK_APPEND"; files: File[] }
  | { type: "REMOVE"; index: number }
  | { type: "CONFIRM" }
  | { type: "RESET" }
  | { type: "BUSY"; on: boolean };

const initial: State = { selected: [], hasDocs: false, docCount: 0, busy: false };

function dedupe(files: File[]) {
  const map = new Map<string, File>();
  for (const f of files) {
    const key = `${f.name}:${f.size}:${(f as any).lastModified ?? 0}`;
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
    case "CONFIRM":
      return {
        ...state,
        hasDocs: state.selected.length > 0,
        docCount: state.selected.length,
        selected: [],
      };
    case "RESET":
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

  const api = useMemo(() => ({
    state,
    pickFiles: (files: File[]) => dispatch({ type: "PICK_APPEND", files }),
    removeSelected: (index: number) => dispatch({ type: "REMOVE", index }),
    confirm: async () => {
      dispatch({ type: "BUSY", on: true });
      setTimeout(() => { dispatch({ type: "CONFIRM" }); dispatch({ type: "BUSY", on: false }); }, 600);
    },
    reset: async () => {
      dispatch({ type: "BUSY", on: true });
      setTimeout(() => { dispatch({ type: "RESET" }); dispatch({ type: "BUSY", on: false }); }, 300);
    },
  }), [state]);

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
