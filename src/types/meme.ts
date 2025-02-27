export interface Meme {
  id: string;
  url: string;
  title: string;
  likes: number;
  created_at?: string;
  author?: string;
  category?: string;
}

export type MemeCategory = "all" | "trending" | "new" | "classic" | "random";
export type SortOption = "likes" | "date" | "name";
