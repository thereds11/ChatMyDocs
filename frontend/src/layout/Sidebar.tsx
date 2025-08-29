import { Box, Separator, Flex, Heading, Icon, IconButton, List, Text } from "@chakra-ui/react";
import { FiMoon, FiSun, FiTrash2 } from "react-icons/fi";
import { useTheme } from "next-themes";
// import DocsFilePicker from "../features/docs/DocsFilePicker";
import { useDocs } from "../state/docs";
import { useChat } from "../state/chat";

type History = { id: string; title: string };

export default function Sidebar({ histories = [], onSelectHistory }: { histories?: History[]; onSelectHistory: (id: string) => void; }) {
  const { resolvedTheme, setTheme } = useTheme();
  const isDark = resolvedTheme === "dark";
  const { state: docs, reset } = useDocs();
  const { clear: clearChat } = useChat();

  return (
    <Flex direction="column" h="100%" borderRight="1px solid" borderColor="panelBorder" p={3} gap={3}>
      <Flex align="center" justify="space-between">
        <Heading size="md">ChatMyDocs</Heading>
        <IconButton aria-label="Toggle color mode" onClick={() => setTheme(isDark ? "light" : "dark")} variant="ghost" >
          <Icon as={isDark ? FiSun : FiMoon} />
        </IconButton>
      </Flex>

      <Box>
        <Text fontSize="sm" color="gray.400">Docs in store</Text>
        <Text fontWeight="bold">{docs.docCount}</Text>
      </Box>
      <IconButton aria-label="Reset corpus" onClick={async () => { await reset(); clearChat(); }} disabled={docs.busy}><FiTrash2 /></IconButton>

      <Separator />

      <Text fontSize="sm" color="gray.400" mb={1}>History</Text>
      <Box overflowY="auto" flex="1" pr={1}>
        {histories.length === 0 ? (
          <Text fontSize="sm" color="gray.500">No conversations yet.</Text>
        ) : (
          <List.Root>
            {histories.map(h => (
              <List.Item key={h.id} px={2} py={2} rounded="md" _hover={{ bg: "gray.700" }} cursor="pointer" onClick={() => onSelectHistory(h.id)}>
                {h.title}
              </List.Item>
            ))}
          </List.Root>
        )}
      </Box>
    </Flex>
  );
}
