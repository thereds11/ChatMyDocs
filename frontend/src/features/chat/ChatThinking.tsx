import { Avatar, Box, HStack } from "@chakra-ui/react";
import { keyframes } from "@emotion/react";

const blink = keyframes`
  0% { opacity: .2; transform: translateY(0); }
  20% { opacity: 1; transform: translateY(-2px); }
  100% { opacity: .2; transform: translateY(0); }
`;

function Dot({ delay }: { delay: string }) {
    return (
        <Box
            as="span"
            w="6px"
            h="6px"
            rounded="full"
            bg="gray.300"
            mx="3px"
            animation={`${blink} 1s infinite`}
            animationDelay={delay}
            display="inline-block"
        />
    );
}

export default function ChatThinking() {
    return (
        <HStack align="flex-start" justify="flex-start">
            <Avatar.Root size={"sm"}>
                <Avatar.Fallback name="Doc Bot" />
            </Avatar.Root>
            <Box bg="gray.700" px={3} py={2} rounded="lg">
                <Dot delay="0s" />
                <Dot delay=".15s" />
                <Dot delay=".3s" />
            </Box>
        </HStack>
    );
}
