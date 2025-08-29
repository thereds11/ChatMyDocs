import {
  Button, HStack, Icon, IconButton, Input, List, ListItem, Text, VStack
} from "@chakra-ui/react";
import { useRef } from "react";
import { FiUploadCloud, FiFile, FiX } from "react-icons/fi";
import { AiFillFilePdf } from "react-icons/ai";
import { PiMicrosoftWordLogo, PiMicrosoftExcelLogo, PiMicrosoftPowerpointLogo } from "react-icons/pi";
import { TbMarkdown } from "react-icons/tb";

type Props = {
  selected: File[];
  onPick: (files: File[]) => void;
  onRemove?: (index: number) => void; // NEW
  showList?: boolean;
  buttonLabel?: string;
};

function iconFor(name: string) {
  const ext = name.split(".").pop()?.toLowerCase();
  switch (ext) {
    case "pdf": return { Comp: AiFillFilePdf, color: "red.400" };
    case "doc": case "docx": return { Comp: PiMicrosoftWordLogo, color: "blue.400" };
    case "xls": case "xlsx": case "csv": return { Comp: PiMicrosoftExcelLogo, color: "green.400" };
    case "ppt": case "pptx": return { Comp: PiMicrosoftPowerpointLogo, color: "orange.400" };
    case "md": return { Comp: TbMarkdown, color: "gray.300" };
    case "txt": return { Comp: FiFile, color: "gray.300" };
    default: return { Comp: FiFile, color: "gray.300" };
  }
}

function formatBytes(b: number) {
  if (b < 1024) return `${b} B`;
  const u = ["KB", "MB", "GB", "TB"];
  let i = -1;
  do { b = b / 1024; i++; } while (b >= 1024 && i < u.length - 1);
  return `${b.toFixed(1)} ${u[i]}`;
}

export default function DocsFilePicker({
  selected, onPick, onRemove, showList = true, buttonLabel = "Choose files"
}: Props) {
  const ref = useRef<HTMLInputElement>(null);

  return (
    <VStack align="stretch">
      <Input
        type="file"
        ref={ref}
        onChange={(e) => onPick(Array.from(e.target.files || []))}
        accept=".pdf,.doc,.docx,.txt,.md,.csv,.xls,.xlsx,.ppt,.pptx"
        display="none"
        multiple
      />
      <Button onClick={() => ref.current?.click()} variant="outline">
        <FiUploadCloud />
        {buttonLabel}
      </Button>

      {showList && selected.length > 0 && (
        <>
          <Text fontSize="sm" color="gray.400">Selected files</Text>
          <List.Root fontSize="sm">
            {selected.map((f, i) => {
              const { Comp, color } = iconFor(f.name);
              return (
                <ListItem key={`${f.name}-${i}`}>
                  <HStack justify="space-between">
                    <HStack maxW="calc(100% - 40px)">
                      <Icon as={Comp} color={color} boxSize={5} />
                      <Text>{f.name}</Text>
                      <Text color="gray.500">· {formatBytes(f.size)}</Text>
                    </HStack>
                    {onRemove && (
                      <IconButton
                        size="xs"
                        aria-label="Remove"
                        variant="ghost"
                        onClick={() => onRemove(i)}
                      ><FiX /></IconButton>
                    )}
                  </HStack>
                </ListItem>
              );
            })}
          </List.Root>
        </>
      )}
    </VStack>
  );
}
