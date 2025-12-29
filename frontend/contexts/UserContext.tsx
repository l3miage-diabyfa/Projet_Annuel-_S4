"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";

interface UserInfo {
  firstname: string;
  lastname: string;
  email: string;
  role: string;
  establishment?: string;
  provider?: string;
  profilePic?: string;
}

interface UserContextType {
  user: UserInfo | null;
  setUser: (user: UserInfo | null) => void;
  logout: () => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: ReactNode }) {
  const [user, setUserState] = useState<UserInfo | null>(null);

  // Hydrater depuis localStorage au montage
  useEffect(() => {
    const storedUserInfo = localStorage.getItem("userInfo");
    if (storedUserInfo) {
      try {
        const userData = JSON.parse(storedUserInfo);
        setUserState(userData);
      } catch (e) {
        console.error("Erreur lors de la lecture des informations utilisateur:", e);
        localStorage.removeItem("userInfo");
      }
    }
  }, []);

  // Fonction pour mettre à jour l'utilisateur (avec persistance dans localStorage)
  const setUser = (userData: UserInfo | null) => {
    setUserState(userData);
    if (userData) {
      localStorage.setItem("userInfo", JSON.stringify(userData));
    } else {
      localStorage.removeItem("userInfo");
    }
  };

  // Fonction de déconnexion
  const logout = () => {
    setUserState(null);
    localStorage.removeItem("userInfo");
  };

  return (
    <UserContext.Provider value={{ user, setUser, logout }}>
      {children}
    </UserContext.Provider>
  );
}

// Hook personnalisé pour utiliser le contexte
export function useUser() {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error("useUser doit être utilisé dans un UserProvider");
  }
  return context;
}