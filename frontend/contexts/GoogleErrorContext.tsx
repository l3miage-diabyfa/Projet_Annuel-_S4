"use client";
import React, { createContext, useContext, useState, ReactNode } from "react";

interface GoogleErrorContextType {
  googleError: boolean;
  setGoogleError: (value: boolean) => void;
}

const GoogleErrorContext = createContext<GoogleErrorContextType | undefined>(undefined);

export function GoogleErrorProvider({ children }: { children: ReactNode }) {
  const [googleError, setGoogleError] = useState(false);

  return (
    <GoogleErrorContext.Provider value={{ googleError, setGoogleError }}>
      {children}
    </GoogleErrorContext.Provider>
  );
}

export function useGoogleError() {
  const context = useContext(GoogleErrorContext);
  if (context === undefined) {
    throw new Error("useGoogleError must be used within a GoogleErrorProvider");
  }
  return context;
}
