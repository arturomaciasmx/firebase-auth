"use client";
import { User } from "firebase/auth";
import { createContext, useContext, useEffect, useState } from "react";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { auth } from "../../firebase/client";
import Cookies from "js-cookie";

export function getAuthToken(): string | undefined {
  return Cookies.get("firebaseIdToken");
}

export function setAuthToken(token: string): string | undefined {
  return Cookies.set("firebaseIdToken", token, { secure: true });
}

export function removeAuthToken(): void {
  Cookies.remove("firebaseIdToken");
}

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
        setIsAdmin(false);
        setIsPro(false);
        removeAuthToken();
      }
      if (user) {
        const token = await user.getIdToken();
        setCurrentUser(user);
        setAuthToken(token);

        const tokenValues = await user.getIdTokenResult();
        setIsAdmin(tokenValues.claims.role === "admin");

        const userResponse = await fetch(`/api/users/${user.uid}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (userResponse.ok) {
          const userJson = await userResponse.json();
          setIsPro(userJson.isPro);
        } else {
          console.error("Failed to fetch user data");
        }
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
