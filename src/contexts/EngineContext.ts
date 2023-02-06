import { EnginesQueryResponse } from "models/sepana";
import { createContext } from "react";

export const EngineContext = createContext<{
  engine?: EnginesQueryResponse;
  setEngine?: (engineId: EnginesQueryResponse | undefined) => void;
}>({
  engine: undefined,
  setEngine: undefined,
});
