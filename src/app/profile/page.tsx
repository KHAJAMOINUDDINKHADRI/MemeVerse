"use client";

import { useState, useEffect } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Camera, User } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import MemeCard from "@/components/MemeCard";
import Link from "next/link";
import { Meme } from "@/types/meme";

interface UserProfile {
  name: string;
  bio: string;
  profilePic: string;
}

export default function Profile() {
  const { toast } = useToast();
  const [profile, setProfile] = useState<UserProfile>({
    name: "",
    bio: "",
    profilePic: "",
  });
  const [uploadedMemes, setUploadedMemes] = useState<Meme[]>([]);
  const [likedMemes, setLikedMemes] = useState<Meme[]>([]);
  const [editing, setEditing] = useState(false);
  const [editedProfile, setEditedProfile] = useState(profile);

  useEffect(() => {
    if (typeof window === "undefined") return;

    // Load user profile from local storage
    const storedProfile = JSON.parse(
      localStorage.getItem("memeverse_user") ||
        '{"name":"Anonymous User","bio":"","profilePic":""}'
    );
    setProfile(storedProfile);
    setEditedProfile(storedProfile);

    // Load uploaded memes
    const uploads = JSON.parse(
      localStorage.getItem("memeverse_uploads") || "[]"
    );
    setUploadedMemes(uploads);

    // Load liked memes
    const likedMemeIds = JSON.parse(
      localStorage.getItem("memeverse_likes") || "[]"
    );
    const allMemes = [...uploads]; // In a real app, we'd fetch all memes here
    const liked = allMemes.filter((meme) => likedMemeIds.includes(meme.id));
    setLikedMemes(liked);
  }, []);

  const handleProfileUpdate = () => {
    localStorage.setItem("memeverse_user", JSON.stringify(editedProfile));
    setProfile(editedProfile);
    setEditing(false);
    toast({
      title: "Profile updated",
      description: "Your profile has been updated successfully!",
    });
  };

  const handleProfilePicChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setEditedProfile((prev) => ({
          ...prev,
          profilePic: reader.result as string,
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <main>
      <div className="container mx-auto px-4 py-6 sm:py-8">
        <div className="max-w-4xl mx-auto">
          {/* Profile Header */}
          <div className="bg-card rounded-lg p-4 sm:p-6 mb-6">
            {editing ? (
              <div className="space-y-4">
                <div className="flex flex-col sm:flex-row items-center gap-4">
                  <div className="relative mb-4 sm:mb-0">
                    <Avatar className="h-20 w-20">
                      <AvatarImage src={editedProfile.profilePic} />
                      <AvatarFallback>
                        <User className="h-10 w-10" />
                      </AvatarFallback>
                    </Avatar>
                    <Button
                      size="icon"
                      variant="secondary"
                      className="absolute bottom-0 right-0"
                      onClick={() =>
                        document.getElementById("profile-pic")?.click()
                      }
                    >
                      <Camera className="h-4 w-4" />
                    </Button>
                    <input
                      type="file"
                      id="profile-pic"
                      className="hidden"
                      accept="image/*"
                      onChange={handleProfilePicChange}
                    />
                  </div>
                  <div className="flex-1 space-y-2 w-full">
                    <Label htmlFor="name">Name</Label>
                    <Input
                      id="name"
                      value={editedProfile.name}
                      onChange={(e) =>
                        setEditedProfile((prev) => ({
                          ...prev,
                          name: e.target.value,
                        }))
                      }
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="bio">Bio</Label>
                  <Textarea
                    id="bio"
                    value={editedProfile.bio}
                    onChange={(e) =>
                      setEditedProfile((prev) => ({
                        ...prev,
                        bio: e.target.value,
                      }))
                    }
                    rows={3}
                  />
                </div>
                <div className="flex gap-2">
                  <Button onClick={handleProfileUpdate}>Save Changes</Button>
                  <Button
                    variant="outline"
                    onClick={() => {
                      setEditedProfile(profile);
                      setEditing(false);
                    }}
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            ) : (
              <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 text-center sm:text-left">
                <Avatar className="h-20 w-20">
                  <AvatarImage src={profile.profilePic} />
                  <AvatarFallback>
                    <User className="h-10 w-10" />
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <h2 className="text-2xl font-bold mb-2">{profile.name}</h2>
                  <p className="text-muted-foreground mb-4">
                    {profile.bio || "No bio yet"}
                  </p>
                  <Button onClick={() => setEditing(true)} variant="outline">
                    Edit Profile
                  </Button>
                </div>
              </div>
            )}
          </div>

          {/* Memes Tabs */}
          <Tabs
            defaultValue="uploaded"
            className="space-y-6 shadow-lg rounded-md"
          >
            <TabsList className="w-full flex">
              <TabsTrigger
                value="uploaded"
                className="flex-1 border shadow-lg rounded-md m-2"
              >
                Uploaded Memes ({uploadedMemes.length})
              </TabsTrigger>
            </TabsList>

            <TabsContent value="uploaded" className="space-y-6 p-4">
              {uploadedMemes.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {uploadedMemes.map((meme) => (
                    <MemeCard key={meme.id} meme={meme} />
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 text-muted-foreground">
                  <p>You haven&apos;t uploaded any memes yet.</p>
                  <Link href="/upload">
                    <Button variant="outline" className="mt-4">
                      Upload Your First Meme
                    </Button>
                  </Link>
                </div>
              )}
            </TabsContent>

            <TabsContent value="liked" className="space-y-6">
              {likedMemes.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {likedMemes.map((meme) => (
                    <MemeCard key={meme.id} meme={meme} />
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 text-muted-foreground">
                  <p>You haven&apos;t liked any memes yet.</p>
                  <Link href="/explore">
                    <Button variant="outline" className="mt-4">
                      Explore Memes
                    </Button>
                  </Link>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </main>
  );
}
