"use client";

import { useState, useEffect } from "react";
import { Trophy, Smile } from "lucide-react";
import MemeCard from "@/components/MemeCard";

export default function Leaderboard() {
  const [topMemes, setTopMemes] = useState<any[]>([]);

  useEffect(() => {
    if (typeof window === "undefined") return;

    // Load all memes and calculate likes
    const uploadedMemes = JSON.parse(
      localStorage.getItem("memeverse_uploads") || "[]"
    );
    const likedMemeIds = JSON.parse(
      localStorage.getItem("memeverse_likes") || "[]"
    );

    // Update memes with like counts
    const memesWithLikes = uploadedMemes.map((meme: any) => {
      // Ensure we have the required fields
      return {
        ...meme,
        id: meme.id || Date.now().toString(),
        url: meme.url || "",
        title: meme.title || "Untitled Meme",
        likes: likedMemeIds.filter((id: string) => id === meme.id).length,
      };
    });

    // Sort memes by likes
    const sortedMemes = [...memesWithLikes]
      .sort((a, b) => b.likes - a.likes)
      .slice(0, 10);

    console.log("Sorted memes for leaderboard:", sortedMemes);
    setTopMemes(sortedMemes);
  }, []);

  return (
    <main>
      <div className="container mx-auto px-4 py-8 animate-in fade-in duration-500">
        <h1 className="text-3xl font-bold mb-8 flex items-center gap-2">
          <Trophy className="h-8 w-8 text-yellow-500" />
          Leaderboard
        </h1>

        <div>
          {/* Top Memes */}
          <div className="space-y-6">
            <h2 className="text-2xl font-semibold flex items-center gap-2">
              <Smile className="h-6 w-6 text-blue-500" />
              Top 10 Memes
            </h2>

            {/* Grid layout for smaller meme cards */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {topMemes.length > 0 ? (
                topMemes.map((meme, index) => (
                  <div
                    key={meme.id}
                    className="transform transition-all duration-300 hover:scale-[1.01]"
                    style={{
                      animationDelay: `${index * 100}ms`,
                      opacity: 1,
                      animation: "fadeInUp 0.5s ease forwards",
                    }}
                  >
                    <MemeCard meme={meme} />
                  </div>
                ))
              ) : (
                <div className="text-center py-12 text-muted-foreground col-span-full">
                  <p>No memes have been created yet. Be the first to upload!</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
