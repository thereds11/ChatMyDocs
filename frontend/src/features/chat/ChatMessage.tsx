import { Avatar, Box, HStack, Text } from "@chakra-ui/react";
import type { Message } from "../../types";

export default function ChatMessage({ m }: { m: Message }) {
    const isUser = m.role === "user";
    return (
        <HStack key={m.id} align="flex-start" >
            <Avatar.Root size={"sm"}>
                <Avatar.Fallback name={isUser ? "You" : "Doc Bot"} />
            </Avatar.Root>
            <Box
                bg={isUser ? "blue.600" : "gray.700"}
                px={3} py={2} rounded="lg" maxW="80%"
                whiteSpace="pre-wrap"
            >
                <Text fontSize="sm">{m.content}</Text>
            </Box>
        </HStack>
    );
}
