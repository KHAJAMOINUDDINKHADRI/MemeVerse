"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <div className="container mx-auto px-4">
      <nav className="flex bg-transparent justify-between items-center h-20">
        <div>
          <span className="text-2xl font-bold">
            <Link href="/">Meme Verse</Link>
          </span>
        </div>

        {/* Mobile menu button */}
        <button
          className="md:hidden p-2"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>

        {/* Desktop navigation */}
        <div className="hidden md:block">
          <ul className="flex flex-row gap-4">
            <li className="cursor-pointer bg-transparent border rounded pt-2 pb-2 pl-4 pr-4 text-primary hover:bg-primary/80">
              <Link href="/explore">Explore</Link>
            </li>
            <li className="cursor-pointer bg-transparent border rounded pt-2 pb-2 pl-4 pr-4 text-primary hover:bg-primary/80">
              <Link href="/upload">Upload</Link>
            </li>
            <li className="cursor-pointer bg-transparent border rounded pt-2 pb-2 pl-4 pr-4 text-primary hover:bg-primary/80">
              <Link href="/leaderboard">Leaderboard</Link>
            </li>
            <li className="cursor-pointer bg-black border rounded pt-2 pb-2 pl-4 pr-4 text-white hover:bg-black/80">
              <Link href="/profile">Profile</Link>
            </li>
          </ul>
        </div>
      </nav>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="md:hidden absolute left-0 right-0 bg-background/95 backdrop-blur-sm z-50 p-4 shadow-lg">
          <ul className="flex flex-col gap-4">
            <li className="cursor-pointer border rounded py-3 px-4 text-primary hover:bg-primary/10 text-center">
              <Link href="/explore" onClick={() => setIsMenuOpen(false)}>
                Explore
              </Link>
            </li>
            <li className="cursor-pointer border rounded py-3 px-4 text-primary hover:bg-primary/10 text-center">
              <Link href="/upload" onClick={() => setIsMenuOpen(false)}>
                Upload
              </Link>
            </li>
            <li className="cursor-pointer border rounded py-3 px-4 text-primary hover:bg-primary/10 text-center">
              <Link href="/leaderboard" onClick={() => setIsMenuOpen(false)}>
                Leaderboard
              </Link>
            </li>
            <li className="cursor-pointer bg-black border rounded py-3 px-4 text-white hover:bg-black/80 text-center">
              <Link href="/profile" onClick={() => setIsMenuOpen(false)}>
                Profile
              </Link>
            </li>
          </ul>
        </div>
      )}
    </div>
  );
}
