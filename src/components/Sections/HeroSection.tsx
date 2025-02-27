"use client";

import React from "react";
import Link from "next/link";

export default function HeroSection() {
  return (
    <section className="relative py-16 sm:py-24 md:h-[60vh] flex flex-col items-center justify-center mx-auto overflow-hidden px-4">
      <div className="container mx-auto text-center">
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-4 sm:mb-6">
          Welcome to Meme Verse
        </h1>
        <p className="text-base sm:text-lg md:text-xl mb-8 sm:mb-10 text-muted-foreground max-w-2xl mx-auto">
          Explore, Share, and Create the Best Memes
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/explore" className="w-full sm:w-auto">
            <button className="bg-black text-white px-6 py-3 rounded-md hover:bg-primary/90 transition-colors w-full">
              Explore Memes
            </button>
          </Link>
          <Link href="/upload" className="w-full sm:w-auto">
            <button className="bg-transparent border border-primary text-primary px-6 py-3 rounded-md hover:bg-primary/10 transition-colors w-full">
              Upload a Meme
            </button>
          </Link>
        </div>
      </div>
    </section>
  );
}
