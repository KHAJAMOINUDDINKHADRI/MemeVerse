"use client";

import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/Button";
import MemeCard from "@/components/MemeCard";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search, Filter, ArrowUpDown } from "lucide-react";
import { getMemesByCategory } from "@/lib/api";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { Meme, MemeCategory, SortOption } from "@/types/meme";

// Custom hook for debouncing
function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}

const categories = [
  { value: "all", label: "All Memes" },
  { value: "trending", label: "Trending" },
  { value: "new", label: "New" },
  { value: "classic", label: "Classic" },
  { value: "random", label: "Random" },
];

const sortOptions = [
  { value: "likes", label: "Most Liked" },
  { value: "date", label: "Latest" },
  { value: "name", label: "Name" },
];

const ITEMS_PER_PAGE = 12;

export default function Explore() {
  const [memes, setMemes] = useState<Meme[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [category, setCategory] = useState("all");
  const [sortBy, setSortBy] = useState("likes");
  const [currentPage, setCurrentPage] = useState(1);
  const [error, setError] = useState("");

  const debouncedSearch = useDebounce(searchQuery, 500);

  useEffect(() => {
    const fetchMemes = async () => {
      setLoading(true);
      try {
        // Only fetch from API
        const apiMemes = await getMemesByCategory(category);

        if (apiMemes.length === 0) {
          console.log("No memes found from API");
          setMemes([]);
          setLoading(false);
          return;
        }

        // Filter by search query
        let filteredMemes = apiMemes;
        if (debouncedSearch) {
          filteredMemes = apiMemes.filter((meme) =>
            meme.title?.toLowerCase().includes(debouncedSearch.toLowerCase())
          );
        }

        // Sort memes
        filteredMemes.sort((a, b) => {
          switch (sortBy) {
            case "likes":
              return b.likes - a.likes;
            case "date":
              return (
                new Date(b.created_at || 0).getTime() -
                new Date(a.created_at || 0).getTime()
              );
            case "name":
              return a.title.localeCompare(b.title);
            default:
              return 0;
          }
        });

        console.log("Filtered memes count:", filteredMemes.length);
        setMemes(filteredMemes);
        setCurrentPage(1); // Reset page when filters change
      } catch (error) {
        console.error("Error in explore page:", error);
        setError("Failed to load memes. Please try again later.");
        setMemes([]);
      } finally {
        setLoading(false);
      }
    };

    fetchMemes();
  }, [category, debouncedSearch, sortBy]);

  // Calculate pagination
  const totalPages = Math.ceil(memes.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const currentMemes = memes.slice(startIndex, endIndex);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <main>
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col gap-6">
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-bold">Explore Memes</h1>
            <p className="text-muted-foreground">
              Showing {currentMemes.length} of {memes.length} memes
            </p>
          </div>

          <div className="mb-8 space-y-4">
            <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
              <div className="relative w-full sm:w-auto">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  type="text"
                  placeholder="Search memes..."
                  className="pl-10 pr-4 w-full"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>

              <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
                <Select value={category} onValueChange={setCategory}>
                  <SelectTrigger className="w-full sm:w-[180px]">
                    <Filter className="mr-2 h-4 w-4" />
                    <SelectValue placeholder="Category" />
                  </SelectTrigger>
                  <SelectContent className="backdrop-blur-md">
                    {categories.map((cat) => (
                      <SelectItem key={cat.value} value={cat.value}>
                        {cat.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="w-full sm:w-[180px]">
                    <ArrowUpDown className="mr-2 h-4 w-4" />
                    <SelectValue placeholder="Sort by" />
                  </SelectTrigger>
                  <SelectContent className="backdrop-blur-md">
                    {sortOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Error State */}
          {error && (
            <div className="text-center py-12 text-red-500">
              <p>{error}</p>
            </div>
          )}

          {/* Loading State */}
          {loading && (
            <div className="flex justify-center py-12">
              <div className="animate-pulse text-center">
                <p className="text-muted-foreground">Loading memes...</p>
              </div>
            </div>
          )}

          {/* Empty State */}
          {!loading && !error && currentMemes.length === 0 && (
            <div className="text-center py-12">
              <p className="text-xl font-semibold mb-2">No memes found</p>
              <p className="text-muted-foreground mb-4">
                Try adjusting your search or filters
              </p>
              <Button
                onClick={() => {
                  setSearchQuery("");
                  setCategory("all");
                  setSortBy("likes");
                }}
              >
                Reset Filters
              </Button>
            </div>
          )}

          {/* Meme Grid */}
          {!loading && !error && currentMemes.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {currentMemes.map((meme) => (
                <div key={meme.id}>
                  <MemeCard meme={meme} />
                </div>
              ))}
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <Pagination className="mt-8">
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious
                    onClick={() => handlePageChange(currentPage - 1)}
                    className={
                      currentPage === 1
                        ? "pointer-events-none opacity-50"
                        : "cursor-pointer"
                    }
                  />
                </PaginationItem>

                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  let pageNumber;
                  if (totalPages <= 5) {
                    pageNumber = i + 1;
                  } else if (currentPage <= 3) {
                    pageNumber = i + 1;
                  } else if (currentPage >= totalPages - 2) {
                    pageNumber = totalPages - 4 + i;
                  } else {
                    pageNumber = currentPage - 2 + i;
                  }

                  return (
                    <PaginationItem key={pageNumber}>
                      <PaginationLink
                        onClick={() => handlePageChange(pageNumber)}
                        isActive={currentPage === pageNumber}
                        className="cursor-pointer"
                      >
                        {pageNumber}
                      </PaginationLink>
                    </PaginationItem>
                  );
                })}

                <PaginationItem>
                  <PaginationNext
                    onClick={() => handlePageChange(currentPage + 1)}
                    className={
                      currentPage === totalPages
                        ? "pointer-events-none opacity-50"
                        : "cursor-pointer"
                    }
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          )}
        </div>
      </div>
    </main>
  );
}
