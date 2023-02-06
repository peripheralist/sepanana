import { EngineContext } from "contexts/EngineContext";
import { EnginesQueryResponse } from "models/sepana";
import { FC, PropsWithChildren, useState } from "react";

export const EngineContextProvider: FC<PropsWithChildren> = ({ children }) => {
  const [engine, setEngine] = useState<EnginesQueryResponse>();

  return (
    <EngineContext.Provider value={{ engine, setEngine }}>
      {children}
    </EngineContext.Provider>
  );
};
