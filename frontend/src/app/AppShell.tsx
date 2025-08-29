import { Grid, GridItem, Box, Text } from "@chakra-ui/react";
import Sidebar from "../layout/Sidebar";
import { useDocs } from "../state/docs";
import { useChat } from "../state/chat";
import DocsEmptyState from "../features/docs/DocsEmptyState";
import ChatTranscript from "../features/chat/ChatTranscript";
import ChatComposer from "../features/chat/ChatCompose";
import { useEffect, useRef, useState } from "react";

export default function AppShell() {
    const { state: docs, pickFiles, confirm, removeSelected } = useDocs();
    const { state: chat, send, pushAssistant  } = useChat();
    const [draft, setDraft] = useState("");

    const greeted = useRef(false);
    useEffect(() => {
        if (docs.hasDocs && !greeted.current) {
            pushAssistant("Hi! I’m ready to answer questions about your documents.");
            greeted.current = true;
        }
        if (!docs.hasDocs) {
            greeted.current = false; // allow greeting again after a full reset
        }
    }, [docs.hasDocs, pushAssistant]);

    return (
        <Grid templateColumns={{ base: "280px 1fr" }} h="100%">
            <GridItem>
                <Sidebar histories={[]} onSelectHistory={() => { }} />
            </GridItem>

            <GridItem p={4} display="flex" flexDir="column" minH="0">
                {/* MIDDLE AREA: takes remaining height and can scroll its contents */}
                <Box flex="1" minH="0" display="flex" flexDir="column" gap={3}>
                    {docs.hasDocs ? (
                        <>
                            {/* Chat list fills available height and scrolls */}
                            <ChatTranscript messages={chat.messages} thinking={chat.busy} />
                        </>
                    ) : (
                        <>
                            {/* Empty state also fills and centers within the scroll area */}
                            <DocsEmptyState
                                selected={docs.selected}
                                onPick={pickFiles}
                                onConfirm={confirm}
                                onRemove={removeSelected}
                                busy={docs.busy}
                            />
                        </>
                    )}
                </Box>

                {/* INPUT stays pinned at bottom */}
                <ChatComposer
                    value={draft}
                    onChange={setDraft}
                    onSend={() => { if (draft.trim()) { send(draft); setDraft(""); } }}
                    disabled={!(docs.hasDocs && !chat.busy)}
                />

                {/* Sources under the input (optional) */}
                <Box fontSize="sm" color="gray.400" mt={2}>
                    <Text mb={1}>Sources</Text>
                    {chat.sources.length ? (
                        <ul>
                            {chat.sources.map((s, i) => (
                                <li key={i}>
                                    {s.source}{s.page != null ? ` (page ${s.page})` : ""}
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <Text>No sources yet.</Text>
                    )}
                </Box>
            </GridItem>
        </Grid>
    );
}
