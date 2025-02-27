"use client";

import { useState } from "react";
import Link from "next/link";
import { Heart } from "lucide-react";
import Image from "next/image";
import { Meme } from "@/types/meme";

const toggleLikeMeme = (id: string) => {
  console.log(`Toggled like for meme ${id}`);
  return true;
};

interface MemeCardProps {
  meme: Meme;
}

export default function MemeCard({ meme }: MemeCardProps) {
  const [isLiked, setIsLiked] = useState(false);
  const [likes, setLikes] = useState(meme.likes || 0);

  const handleLike = () => {
    const newLikeStatus = !isLiked;
    setIsLiked(newLikeStatus);
    setLikes((prev) => prev + (newLikeStatus ? 1 : -1));
    toggleLikeMeme(meme.id.toString());
  };

  // Check if the URL is a base64 data URL
  const isBase64Image = meme.url.startsWith("data:");

  return (
    <div className="overflow-hidden group hover:shadow-lg transition-shadow duration-300 bg-background rounded-lg">
      <Link href={`/meme/${meme.id}`}>
        <div className="relative aspect-square overflow-hidden bg-muted">
          {isBase64Image ? (
            // For base64 images, use a regular img tag
            <img
              src={meme.url}
              alt={meme.title || "Meme"}
              className="w-full h-full object-cover transition-transform group-hover:scale-105 duration-300"
            />
          ) : (
            // For remote URLs, use Next.js Image component
            <Image
              src={meme.url}
              alt={meme.title || "Meme"}
              width={400}
              height={400}
              className="w-full h-full object-cover transition-transform group-hover:scale-105 duration-300"
              priority={false}
            />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        </div>
      </Link>
      <div className="p-4">
        <h3 className="font-semibold mb-2 line-clamp-1 group-hover:text-primary transition-colors">
          {meme.title || "Untitled Meme"}
        </h3>
        <div className="flex justify-between items-center">
          <span className="text-sm text-muted-foreground">{likes} likes</span>
          <button
            onClick={handleLike}
            className={`p-2 rounded-full transition-colors hover:bg-muted ${
              isLiked ? "text-red-500" : "text-muted-foreground"
            }`}
          >
            <Heart
              className={`w-5 h-5 transition-transform ${
                isLiked ? "fill-current" : ""
              }`}
            />
          </button>
        </div>
      </div>
    </div>
  );
}
