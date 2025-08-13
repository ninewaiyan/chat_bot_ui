// ThemeContext.ts
import React from "react";
import type { ColorSchemeName } from "react-native";

export const ThemeContext = React.createContext<{
  scheme: ColorSchemeName | "system";
  toggle: () => void;
}>({
  scheme: "light",
  toggle: () => {},
});
