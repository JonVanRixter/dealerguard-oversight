import React, { createContext, useContext, useState, useCallback } from "react";

interface ImpersonationState {
  impersonationMode: boolean;
  impersonatedLender: string;
  startImpersonation: (lenderName: string) => void;
  stopImpersonation: () => void;
}

const ImpersonationContext = createContext<ImpersonationState | null>(null);

export const ImpersonationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [impersonationMode, setMode] = useState(false);
  const [impersonatedLender, setLender] = useState("");

  const startImpersonation = useCallback((lenderName: string) => {
    setMode(true);
    setLender(lenderName);
  }, []);

  const stopImpersonation = useCallback(() => {
    setMode(false);
    setLender("");
  }, []);

  return (
    <ImpersonationContext.Provider value={{ impersonationMode, impersonatedLender, startImpersonation, stopImpersonation }}>
      {children}
    </ImpersonationContext.Provider>
  );
};

export const useImpersonation = () => {
  const ctx = useContext(ImpersonationContext);
  if (!ctx) throw new Error("useImpersonation must be used within ImpersonationProvider");
  return ctx;
};
