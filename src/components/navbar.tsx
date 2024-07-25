"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Navbar() {
  const pathName = usePathname();
  return (
    <nav className="mb-8">
      <ul className="flex gap-4">
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
