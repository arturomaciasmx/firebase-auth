"use client";
import { User } from "firebase/auth";
import { createContext, useContext, useEffect, useState } from "react";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { auth } from "../../firebase/client";

type AuthContextType = {
  currentUser: User | null;
  isAdmin: boolean;
  isPro: boolean;
  loginGoogle: () => Promise<void>;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isPro, setIsPro] = useState(false);

  useEffect(() => {
    if (!auth) return;

    return auth.onAuthStateChanged(async (user) => {
      if (!user) {
        setCurrentUser(null);
      }
      if (user) {
        setCurrentUser(user);
      }
    });
  }, []);

  function loginGoogle(): Promise<void> {
    return new Promise((resolve, reject) => {
      if (!auth) {
        return reject();
      }
      signInWithPopup(auth, new GoogleAuthProvider()).then();
    });
  }

  function logout(): Promise<void> {
    return new Promise((resolve, reject) => {
      if (!auth) {
        return reject();
      }
      auth
        .signOut()
        .then(() => {
          console.log("Logged out successfully");
          resolve();
        })
        .catch(() => {
          console.error("Failed to log out");
          reject();
        });
    });
  }

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        isAdmin,
        isPro,
        loginGoogle,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
