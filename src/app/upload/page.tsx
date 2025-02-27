"use client";

import { useState, useRef } from "react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Upload as UploadIcon, Image as ImageIcon, Wand2 } from "lucide-react";
import { uploadMeme, generateMemeCaption } from "@/lib/api";
import { useToast } from "@/components/ui/use-toast";
import { useRouter } from "next/navigation";
import Image from "next/image";

export default function Upload() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string>("");
  const [title, setTitle] = useState("");
  const [caption, setCaption] = useState("");
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();
  const router = useRouter();

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.type.startsWith("image/")) {
        setSelectedFile(file);
        const reader = new FileReader();
        reader.onload = () => {
          setPreview(reader.result as string);
        };
        reader.readAsDataURL(file);
      } else {
        toast({
          title: "Invalid file type",
          description: "Please select an image file (PNG, JPG, GIF)",
        });
      }
    }
  };

  const handleGenerateCaption = async () => {
    if (!title) {
      toast({
        title: "Title required",
        description: "Please add a title first to generate a caption",
      });
      return;
    }

    setLoading(true);
    try {
      const generatedCaption = await generateMemeCaption();
      setCaption(generatedCaption);
    } catch {
      toast({
        title: "Error",
        description: "Failed to generate caption",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFile || !title) return;

    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("image", selectedFile);
      formData.append("title", title);
      formData.append("caption", caption);

      const response = await uploadMeme(formData);

      toast({
        title: "Success!",
        description: "Your meme has been uploaded successfully",
      });

      router.push(`/meme/${response.id}`);
    } catch {
      toast({
        title: "Error",
        description: "Failed to upload meme",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <main>
      <div className="container mx-auto px-4 py-8 animate-in fade-in duration-500">
        <div className="max-w-2xl mx-auto">
          <h1 className="text-3xl font-bold mb-6">Upload Meme</h1>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Image Upload */}
            <div className="space-y-4">
              <Label htmlFor="image">Meme Image</Label>

              {preview ? (
                <div className="relative aspect-video rounded-lg overflow-hidden bg-muted">
                  <Image
                    src={preview}
                    alt={title || "Meme preview"}
                    width={800}
                    height={600}
                    className="w-full h-full object-contain"
                  />
                  <Button
                    type="button"
                    variant="secondary"
                    size="sm"
                    className="absolute top-2 right-2"
                    onClick={() => {
                      setSelectedFile(null);
                      setPreview("");
                      if (fileInputRef.current) {
                        fileInputRef.current.value = "";
                      }
                    }}
                  >
                    Change Image
                  </Button>
                </div>
              ) : (
                <div
                  onClick={() => fileInputRef.current?.click()}
                  className="border-2 border-dashed rounded-lg p-8 text-center cursor-pointer hover:border-primary transition-colors"
                >
                  <ImageIcon className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                  <p className="text-sm text-muted-foreground mb-2">
                    Click to upload or drag and drop
                  </p>
                  <p className="text-xs text-muted-foreground">
                    PNG, JPG, GIF up to 10MB
                  </p>
                </div>
              )}

              <input
                ref={fileInputRef}
                type="file"
                id="image"
                accept="image/*"
                className="hidden"
                onChange={handleFileSelect}
              />
            </div>

            {/* Title */}
            <div className="space-y-2">
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                value={title}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setTitle(e.target.value)
                }
                placeholder="Give your meme a catchy title"
                required
              />
            </div>

            {/* Caption */}
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <Label htmlFor="caption">Caption (Optional)</Label>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={handleGenerateCaption}
                  disabled={loading || !title}
                >
                  <Wand2 className="mr-2 h-4 w-4" />
                  Generate Caption
                </Button>
              </div>
              <Textarea
                id="caption"
                value={caption}
                onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                  setCaption(e.target.value)
                }
                placeholder="Add a funny caption to your meme"
                rows={3}
              />
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              className="w-full"
              disabled={loading || !selectedFile || !title}
            >
              {loading ? (
                "Uploading..."
              ) : (
                <>
                  <UploadIcon className="mr-2 h-4 w-4" />
                  Upload Meme
                </>
              )}
            </Button>
          </form>
        </div>
      </div>
    </main>
  );
}
