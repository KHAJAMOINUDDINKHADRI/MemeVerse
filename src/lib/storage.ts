export const initializeLocalStorage = () => {
  if (typeof window === "undefined") return;

  if (!localStorage.getItem("memeverse_likes")) {
    localStorage.setItem("memeverse_likes", JSON.stringify([]));
  }
  if (!localStorage.getItem("memeverse_comments")) {
    localStorage.setItem("memeverse_comments", JSON.stringify({}));
  }
  if (!localStorage.getItem("memeverse_user")) {
    localStorage.setItem(
      "memeverse_user",
      JSON.stringify({
        name: "Anonymous User",
        bio: "",
        profilePic: "",
      })
    );
  }
};

export const toggleLikeMeme = (memeId: string) => {
  if (typeof window === "undefined") return false;

  const likes = JSON.parse(localStorage.getItem("memeverse_likes") || "[]");
  const index = likes.indexOf(memeId);

  if (index > -1) {
    likes.splice(index, 1);
  } else {
    likes.push(memeId);
  }

  localStorage.setItem("memeverse_likes", JSON.stringify(likes));
  return index === -1;
};

export const isMemeLiked = (memeId: string) => {
  if (typeof window === "undefined") return false;

  const likes = JSON.parse(localStorage.getItem("memeverse_likes") || "[]");
  return likes.includes(memeId);
};
