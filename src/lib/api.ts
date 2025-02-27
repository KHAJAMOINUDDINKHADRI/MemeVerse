export const MEME_API = "https://api.imgflip.com";

// Import the Meme type from types/meme.ts
import { Meme } from "@/types/meme";

interface ImgFlipMeme {
  id: string;
  url: string;
  name: string;
}

export const getMemesByCategory = async (category: string): Promise<Meme[]> => {
  try {
    const response = await fetch(`${MEME_API}/get_memes`);
    const data = await response.json();

    if (!data.success) {
      throw new Error("Failed to fetch memes from API");
    }

    // Transform the data to match our app's structure and ensure unique IDs
    const memes = data.data.memes.map(
      (template: ImgFlipMeme, index: number) => ({
        id: `${template.id}_${index}`, // Make IDs unique by combining with index
        url: template.url,
        title: template.name,
        likes: Math.floor(Math.random() * 1000),
        created_at: new Date().toISOString(),
      })
    );

    // Filter by category if needed
    if (category === "trending") {
      return memes.slice(0, 20); // Return first 20 as trending
    } else if (category === "new") {
      return memes.slice(20, 40); // Return next 20 as new
    } else if (category === "classic") {
      return memes.slice(40, 60); // Return next 20 as classic
    } else if (category === "random") {
      return memes.sort(() => Math.random() - 0.5).slice(0, 20); // Random 20
    }

    return memes;
  } catch (error) {
    console.error("Error fetching memes:", error);
    return [];
  }
};

export const getMemeById = async (id: string): Promise<Meme | null> => {
  try {
    // First check localStorage for uploaded memes
    if (typeof window !== "undefined") {
      const uploadedMemes = JSON.parse(
        localStorage.getItem("memeverse_uploads") || "[]"
      );

      const localMeme = uploadedMemes.find((meme: Meme) => meme.id === id);
      if (localMeme) {
        return localMeme;
      }
    }

    // If not found in uploads, continue with API checking
    const idParts = id.split("_");
    const baseId = idParts[0];

    // Fetch all memes
    const allMemes = await getMemesByCategory("all");

    // Find the meme with matching ID
    const meme = allMemes.find((meme) => meme.id === id);
    if (meme) {
      return meme;
    }

    // Try to find by base ID
    const memeByBaseId = allMemes.find((meme) =>
      meme.id.startsWith(baseId + "_")
    );
    if (memeByBaseId) {
      return memeByBaseId;
    }

    console.error(`Meme with ID ${id} not found`);
    return null;
  } catch (error) {
    console.error("Error fetching meme:", error);
    return null;
  }
};

export const uploadMeme = async (formData: FormData): Promise<Meme> => {
  // Store file data as base64 for persistent storage
  const file = formData.get("image") as File;
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      const memes = JSON.parse(
        localStorage.getItem("memeverse_uploads") || "[]"
      );
      const newMeme: Meme = {
        id: Date.now().toString(),
        url: reader.result as string, // Store base64 string instead of URL.createObjectURL
        title: formData.get("title") as string,
        likes: 0,
        created_at: new Date().toISOString(),
        author: JSON.parse(
          localStorage.getItem("memeverse_user") || '{"name": "Anonymous User"}'
        ).name,
      };

      memes.push(newMeme);
      localStorage.setItem("memeverse_uploads", JSON.stringify(memes));
      resolve(newMeme);
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
};

export const generateMemeCaption = async () => {
  // Simulated AI caption generation
  const captions = [
    "When you try your best but don't succeed...",
    "Nobody: \nMe at 3 AM:",
    "That moment when...",
    "Why are you like this?",
    "Plot twist:",
  ];
  return captions[Math.floor(Math.random() * captions.length)];
};
