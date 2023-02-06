import { ApiKeyContext } from "contexts/ApiKeyContext";
import { FC, PropsWithChildren, useState } from "react";

export const ApiKeyContextProvider: FC<PropsWithChildren> = ({ children }) => {
  const [apiKey, setApiKey] = useState<string>();

  return (
    <ApiKeyContext.Provider value={{ apiKey, setApiKey }}>
      {children}
    </ApiKeyContext.Provider>
  );
};
