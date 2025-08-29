import AppShell from "./app/AppShell";
import { DocsProvider } from "./state/docs";
import { ChatProvider } from "./state/chat";

export default function App() {
  return (
    <DocsProvider>
      <ChatProvider>
        <AppShell />
      </ChatProvider>
    </DocsProvider>
  );
}
