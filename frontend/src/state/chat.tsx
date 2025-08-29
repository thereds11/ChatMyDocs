import React, { createContext, useContext, useMemo, useReducer } from "react";
import type { Message, Source } from "../types";

type State = {
    messages: Message[];
    sources: Source[];
    busy: boolean;
};

type Action =
    | { type: "ADD_MSG"; message: Message }
    | { type: "SET_SOURCES"; sources: Source[] }
    | { type: "CLEAR" }
    | { type: "BUSY"; on: boolean };

const initial: State = { messages: [], sources: [], busy: false };

function reducer(state: State, action: Action): State {
    switch (action.type) {
        case "ADD_MSG":
            return { ...state, messages: [...state.messages, action.message] };
        case "SET_SOURCES":
            return { ...state, sources: action.sources };
        case "CLEAR":
            return { ...initial };
        case "BUSY":
            return { ...state, busy: action.on };
        default:
            return state;
    }
}

const Ctx = createContext<ReturnType<typeof useChatStore> | null>(null);

function useChatStore() {
    const [state, dispatch] = useReducer(reducer, initial);

    const api = useMemo(() => ({
        state,
        send: async (text: string) => {
            const user: Message = { id: crypto.randomUUID(), role: "user", content: text, createdAt: Date.now() };
            dispatch({ type: "ADD_MSG", message: user });
            dispatch({ type: "BUSY", on: true });
            // UI-only preview reply (backend in Step 5)
            setTimeout(() => {
                dispatch({
                    type: "ADD_MSG", message: {
                        id: crypto.randomUUID(), role: "assistant",
                        content: "🔧 Preview — after wiring the backend, I’ll answer from your docs with citations here.",
                        createdAt: Date.now()
                    }
                });
                dispatch({ type: "SET_SOURCES", sources: [{ source: "example.txt", page: 1 }] });
                dispatch({ type: "BUSY", on: false });
            }, 600);
        },
        clear: () => dispatch({ type: "CLEAR" }),
    }), []);

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
