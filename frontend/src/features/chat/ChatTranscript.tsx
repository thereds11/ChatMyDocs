import { VStack } from "@chakra-ui/react";
import { useEffect, useRef } from "react";
import type { Message } from "../../types";
import ChatMessage from "./ChatMessage";
import ChatThinking from "./ChatThinking";

export default function ChatTranscript({
    messages,
    thinking = false,
}: { messages: Message[], thinking?: boolean }) {
    const endRef = useRef<HTMLDivElement>(null);
    useEffect(() => { endRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages, thinking]);

    const last = messages[messages.length - 1];
    const showThinking = thinking && (!last || last.role === "user"); // only after user sends
    return (
        <VStack align="stretch" flex="1" overflowY="auto" p={3} rounded="xl">
            {messages.map((m) => <ChatMessage key={m.id} m={m} />)}
            {showThinking && <ChatThinking />}
            <div ref={endRef} />
        </VStack>
    );
}
