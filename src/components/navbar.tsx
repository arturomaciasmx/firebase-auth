"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "./auth-provider";

export default function Navbar() {
  const pathName = usePathname();
  const auth = useAuth();

  const loginGoogle = () => {
    auth
      ?.loginGoogle()
      .then(() => {
        console.log("Logged in successfully");
      })
      .catch(() => {
        console.error("Failed to log in");
      });
  };

  const logout = () => {
    auth
      ?.logout()
      .then(() => {
        console.log("Logged out successfully");
      })
      .catch(() => {
        console.error("Failed to log out");
      });
  };

  return (
    <nav className="mb-8">
      {auth?.currentUser && (
        <div className="mb-8">
          <p>Logged in as {auth.currentUser.email}</p>
          {auth.isAdmin && <p>Admin</p>}
          {auth.isPro && <p>Pro</p>}
        </div>
      )}
      <ul className="flex gap-4">
        {auth?.currentUser ? (
          <li>
            <button onClick={logout}>Logout</button>
          </li>
        ) : (
          <li>
            <button onClick={loginGoogle}>Login</button>
          </li>
        )}
        <li>
          <Link href="/" className={pathName == "/" ? "font-bold" : ""}>
            Home
          </Link>
        </li>
        <li>
          <Link href="/user" className={pathName == "/user" ? "font-bold" : ""}>
            User
          </Link>
        </li>
        <li>
          <Link href="/pro" className={pathName == "/pro" ? "font-bold" : ""}>
            Pro
          </Link>
        </li>
        <li>
          <Link href="/admin" className={pathName == "/admin" ? "font-bold" : ""}>
            Admin
          </Link>
        </li>
      </ul>
    </nav>
  );
}
