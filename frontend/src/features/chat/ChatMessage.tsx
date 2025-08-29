import { Avatar, Box, HStack, Text } from "@chakra-ui/react";
import type { Message } from "../../types";

export default function ChatMessage({ m }: { m: Message }) {
  const isUser = m.role === "user";
  return (
    <HStack
      align="flex-start"
      justify={isUser ? "flex-end" : "flex-start"}
    >
      {!isUser &&<Avatar.Root size={"sm"}>
                <Avatar.Fallback name="Doc Bot" />
            </Avatar.Root>}
      <Box
        bg={isUser ? "blue.600" : "gray.700"}
        px={3}
        py={2}
        rounded="lg"
        maxW="80%"
        whiteSpace="pre-wrap"
      >
        <Text fontSize="sm">{m.content}</Text>
      </Box>
      {isUser && <Avatar.Root size={"sm"}>
                <Avatar.Fallback name="You" />
            </Avatar.Root>}     {/* optional user avatar */}
    </HStack>
  );
}
