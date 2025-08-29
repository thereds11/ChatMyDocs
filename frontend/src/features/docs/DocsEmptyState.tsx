import { Button, Flex, Text, VStack } from "@chakra-ui/react";
import DocsFilePicker from "./DocsFilePicker";

type Props = {
  selected: File[];
  onPick: (files: File[]) => void;
  onRemove: (index: number) => void;  // NEW
  onConfirm: () => void;
  busy: boolean;
};

export default function DocsEmptyState({ selected, onPick, onRemove, onConfirm, busy }: Props) {
  return (
    <Flex
      flex="1"
      align="center"
      justify="center"
      rounded="xl"
      p={6}
    >
      <VStack maxW="lg" w="full">
        <Text fontSize="lg" fontWeight="semibold">Get started</Text>
        <Text fontSize="sm" color="gray.400" textAlign="center">
          Choose one or more documents, then click <b>Confirm</b>. After that, you can ask questions.
        </Text>
        <DocsFilePicker selected={selected} onPick={onPick} onRemove={onRemove} />
        <Button colorScheme="purple" onClick={onConfirm} disabled={selected.length === 0 || busy} w="full">
          Confirm
        </Button>
      </VStack>
    </Flex>
  );
}
