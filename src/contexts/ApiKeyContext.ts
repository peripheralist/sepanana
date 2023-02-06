import { createContext } from "react";

export const ApiKeyContext = createContext<{
  apiKey?: string;
  setApiKey?: (apiKey: string | undefined) => void;
}>({
  apiKey: undefined,
  setApiKey: undefined,
});
