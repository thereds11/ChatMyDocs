import React, { createContext, useContext, useMemo, useReducer, useCallback } from "react";
import type { Message, Source } from "../types";
import { queryDocs } from "../api/rag";

type State = { messages: Message[]; sources: Source[]; busy: boolean; };
type Action =
  | { type: "ADD_MSG"; message: Message }
  | { type: "SET_SOURCES"; sources: Source[] }
  | { type: "CLEAR" }
  | { type: "BUSY"; on: boolean };

const initial: State = { messages: [], sources: [], busy: false };
function reducer(state: State, action: Action): State {
  switch (action.type) {
    case "ADD_MSG":     return { ...state, messages: [...state.messages, action.message] };
    case "SET_SOURCES": return { ...state, sources: action.sources };
    case "CLEAR":       return { ...initial };
    case "BUSY":        return { ...state, busy: action.on };
    default:            return state;
  }
}

const Ctx = createContext<ReturnType<typeof useChatStore> | null>(null);

function useChatStore() {
  const [state, dispatch] = useReducer(reducer, initial);

  const pushAssistant = useCallback((content: string) => {
    const msg: Message = { id: crypto.randomUUID(), role: "assistant", content, createdAt: Date.now() };
    dispatch({ type: "ADD_MSG", message: msg });
  }, []);

  const send = useCallback(async (text: string) => {
    const user: Message = { id: crypto.randomUUID(), role: "user", content: text, createdAt: Date.now() };
    dispatch({ type: "ADD_MSG", message: user });
    dispatch({ type: "BUSY", on: true });
    try {
      const { answer, sources } = await queryDocs(text);
      const assistant: Message = { id: crypto.randomUUID(), role: "assistant", content: answer, createdAt: Date.now() };
      dispatch({ type: "ADD_MSG", message: assistant });
      dispatch({ type: "SET_SOURCES", sources });
    } catch {
      dispatch({ type: "ADD_MSG", message: {
        id: crypto.randomUUID(), role: "assistant",
        content: "Sorry — I had trouble answering that. Please try again.",
        createdAt: Date.now(),
      }});
      dispatch({ type: "SET_SOURCES", sources: [] });
    } finally {
      dispatch({ type: "BUSY", on: false });
    }
  }, []);

  const clear = useCallback(() => dispatch({ type: "CLEAR" }), []);

  const api = useMemo(() => ({ state, pushAssistant, send, clear }), [state, pushAssistant, send, clear]);
  return api;
}

export function ChatProvider({ children }: { children: React.ReactNode }) {
  const store = useChatStore();
  return <Ctx.Provider value={store}>{children}</Ctx.Provider>;
}

export function useChat() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useChat must be used within ChatProvider");
  return ctx;
}
