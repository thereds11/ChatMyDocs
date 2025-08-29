import { VStack } from "@chakra-ui/react";
import { useEffect, useRef } from "react";
import type { Message } from "../../types";
import ChatMessage from "./ChatMessage";

export default function ChatTranscript({ messages }: { messages: Message[] }) {
    const endRef = useRef<HTMLDivElement>(null);
    useEffect(() => { endRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages]);

    return (
        <VStack align="stretch" flex="1" overflowY="auto" p={3} rounded="xl">
            {messages.map((m) => <ChatMessage key={m.id} m={m} />)}
            <div ref={endRef} />
        </VStack>
    );
}
