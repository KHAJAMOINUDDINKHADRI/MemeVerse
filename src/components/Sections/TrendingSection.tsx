"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import MemeCard from "@/components/MemeCard";
import { getMemesByCategory } from "@/lib/api";
import { Meme } from "@/types/meme";

const TRENDING_LIMIT = 8;

export default function TrendingSection() {
  const [trendingMemes, setTrendingMemes] = useState<Meme[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchTrendingMemes = async () => {
      setLoading(true);
      try {
        const memes = await getMemesByCategory("trending");
        // Ensure unique memes by filtering based on unique IDs
        const uniqueMemes = Array.from(
          new Map(memes.map((meme) => [meme.id, meme])).values()
        );
        // Sort by likes and limit to TRENDING_LIMIT
        const sortedMemes = uniqueMemes
          .sort((a, b) => b.likes - a.likes)
          .slice(0, TRENDING_LIMIT);

        setTrendingMemes(sortedMemes);
      } catch (error) {
        console.error("Error fetching trending memes:", error);
        setError("Failed to load trending memes");
      } finally {
        setLoading(false);
      }
    };

    fetchTrendingMemes();
  }, []);

  return (
    <section className="py-16 px-4 md:px-8 bg-gradient-to-b from-background to-muted/20">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-bold">🔥 Trending Memes</h2>
          <Link
            href="/explore"
            className="group flex items-center text-foreground hover:text-foreground/80"
          >
            View all
            <ChevronRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>

        {loading && (
          <div className="flex justify-center py-12">
            <div className="animate-pulse text-center">
              <p className="text-muted-foreground">Loading trending memes...</p>
            </div>
          </div>
        )}

        {error && (
          <div className="text-center py-12 text-red-500">
            <p>{error}</p>
          </div>
        )}

        {!loading && !error && trendingMemes.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {trendingMemes.map((meme) => (
              <div key={meme.id}>
                <MemeCard meme={meme} />
              </div>
            ))}
          </div>
        )}

        {!loading && !error && trendingMemes.length === 0 && (
          <div className="text-center py-12 text-muted-foreground">
            <p>No trending memes available at the moment.</p>
          </div>
        )}
      </div>
    </section>
  );
}
