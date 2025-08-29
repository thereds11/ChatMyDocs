import { createSystem, defaultConfig, defineConfig } from "@chakra-ui/react";

const config = defineConfig({
  globalCss: {
    "html, body, #root": { height: "100%" },
    body: { margin: 0 },
  },
  theme: {
    tokens: {
      colors: {
        brand: { 500: { value: "#7c3aed" } },
      },
    },
    semanticTokens: {
      colors: {
        appBg:        { value: { base: "{colors.gray.50}",  _dark: "{colors.gray.900}" } },
        surface:      { value: { base: "{colors.white}",     _dark: "{colors.gray.800}" } },
        surfaceAlt:   { value: { base: "{colors.gray.50}",   _dark: "{colors.gray.750}" } },
        borderMuted:  { value: { base: "{colors.gray.300}",  _dark: "{colors.gray.700}" } },
        textMuted:    { value: { base: "{colors.gray.600}",  _dark: "{colors.gray.400}" } },
        ring:         { value: { base: "{colors.purple.500}", _dark: "{colors.purple.400}" } },
      },
    },
  },
});


export const system = createSystem(defaultConfig, config);