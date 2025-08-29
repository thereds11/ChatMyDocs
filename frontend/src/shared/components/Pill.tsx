import { Box, type BoxProps } from "@chakra-ui/react";

export default function Pill(props: BoxProps) {
    return (
        <Box
            rounded="full"
            border="1px solid"
            borderColor="borderMuted"
            bg="surface"
            px={3}
            py={2}
            overflow="hidden"
            {...props}
        />
    );
}
