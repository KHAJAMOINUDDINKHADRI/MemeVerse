"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { Textarea } from "@/components/ui/textarea";
import { Heart, MessageSquare, ArrowLeft } from "lucide-react";
import { getMemeById } from "@/lib/api";
import { toggleLikeMeme, isMemeLiked } from "@/lib/storage";
import { useToast } from "@/hooks/use-toast";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

interface Comment {
  id: string;
  text: string;
  author: string;
  created_at: string;
}

interface Meme {
  id: string;
  url: string;
  title: string;
  likes: number;
}

export default function MemeDetails() {
  const params = useParams();
  const id = params?.id as string;
  const router = useRouter();
  const { toast } = useToast();
  const [meme, setMeme] = useState<any>(null);
  const [isLiked, setIsLiked] = useState(false);
  const [comment, setComment] = useState("");
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMeme = async () => {
      if (!id) return;
      const data = await getMemeById(id);
      if (data) {
        setMeme(data);
        setIsLiked(isMemeLiked(id));
        // Load comments from local storage
        if (typeof window !== "undefined") {
          const storedComments = JSON.parse(
            localStorage.getItem(`meme_${id}_comments`) || "[]"
          );
          setComments(storedComments);
        }
      }
      setLoading(false);
    };

    fetchMeme();
  }, [id]);

  const handleLike = () => {
    if (!id) return;
    const newLikeStatus = toggleLikeMeme(id);
    setIsLiked(newLikeStatus);
    setMeme((prev: Meme) => ({
      ...prev,
      likes: prev.likes + (newLikeStatus ? 1 : -1),
    }));
  };

  const handleComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!comment.trim() || !id) return;

    const newComment: Comment = {
      id: Date.now().toString(),
      text: comment,
      author: JSON.parse(
        localStorage.getItem("memeverse_user") || '{"name":"Anonymous User"}'
      ).name,
      created_at: new Date().toISOString(),
    };

    const updatedComments = [...comments, newComment];
    setComments(updatedComments);
    localStorage.setItem(
      `meme_${id}_comments`,
      JSON.stringify(updatedComments)
    );
    setComment("");

    toast({
      title: "Comment added",
      description: "Your comment has been added successfully!",
    });
  };

  return (
    <main>
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <Button
            variant="ghost"
            onClick={() => router.back()}
            className="mb-4"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Button>

          {meme ? (
            <div className="bg-card rounded-lg shadow-lg overflow-hidden">
              <img
                src={meme.url}
                alt={meme.title}
                className="w-full h-auto object-contain max-h-[80vh]"
              />

              <div className="p-4 sm:p-6">
                <h1 className="text-xl sm:text-2xl font-bold mb-4">
                  {meme.title}
                </h1>

                <div className="flex items-center gap-4 mb-6">
                  <Button
                    variant="ghost"
                    size="sm"
                    className={`gap-2 ${isLiked ? "text-red-500" : ""}`}
                    onClick={handleLike}
                  >
                    <Heart
                      className={`h-5 w-5 ${isLiked ? "fill-current" : ""}`}
                    />
                    {meme.likes}
                  </Button>

                  <Button variant="ghost" size="sm" className="gap-2">
                    <MessageSquare className="h-5 w-5" />
                    {comments.length}
                  </Button>
                </div>

                {/* Comments Section */}
                <div className="space-y-4">
                  <form onSubmit={handleComment} className="space-y-2">
                    <Textarea
                      placeholder="Add a comment..."
                      value={comment}
                      onChange={(e) => setComment(e.target.value)}
                      className="min-h-[80px]"
                    />
                    <Button
                      type="submit"
                      disabled={!comment.trim()}
                      variant="outline"
                      className="w-full sm:w-auto"
                    >
                      Post Comment
                    </Button>
                  </form>

                  <div className="space-y-4 mt-6">
                    {comments.length === 0 ? (
                      <p className="text-center text-muted-foreground py-4">
                        No comments yet. Be the first to comment!
                      </p>
                    ) : (
                      comments.map((comment) => (
                        <div key={comment.id} className="border-b pb-4">
                          <div className="flex items-center gap-2 mb-2">
                            <Avatar className="h-8 w-8">
                              <AvatarFallback>
                                {comment.author[0]}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="font-medium">{comment.author}</p>
                              <p className="text-xs text-muted-foreground">
                                {new Date(comment.created_at).toLocaleString()}
                              </p>
                            </div>
                          </div>
                          <p className="pl-10">{comment.text}</p>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </main>
  );
}
