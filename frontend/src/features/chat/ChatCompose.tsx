import { HStack, IconButton, Input } from "@chakra-ui/react";
import { FiMic, FiSend } from "react-icons/fi";
import { TbWaveSine } from "react-icons/tb";
import Pill from "../../shared/components/Pill";

type Props = {
    value: string;
    onChange: (v: string) => void;
    onSend: () => void;
    disabled?: boolean;
    onVoice?: () => void;
    onWave?: () => void;
    placeholder?: string;
};

export default function ChatComposer({
    value, onChange, onSend, disabled, onVoice, onWave,
    placeholder = "Ask anything about your documents",
}: Props) {
    return (
        <Pill>
            <HStack>
                <Input
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); onSend(); } }}
                    placeholder={placeholder}
                    //   @ts-expect-error Chakra UI has it but didn't included into their types
                    variant="unstyled"
                    bg="transparent"
                    rounded="full"
                    px={3}
                    _placeholder={{ color: "textMuted" }}
                />
                <HStack>
                    <IconButton aria-label="Voice input" size="sm" variant="ghost" onClick={onVoice} disabled={disabled} rounded="full" ><FiMic /></IconButton>
                    <IconButton aria-label="Audio" size="sm" variant="ghost" onClick={onWave} disabled={disabled} rounded="full" ><TbWaveSine /></IconButton>
                    <IconButton aria-label="Send" size="sm" colorScheme="purple" onClick={onSend} disabled={disabled || !value.trim()} rounded="full" ><FiSend /></IconButton>
                </HStack>
            </HStack>
        </Pill>
    );
}
