
import api from "./api";

export const getBookmarks = async () => {
  const response = await api.get("/api/bookmarks");
  return response.data;
};

export const addBookmark = async (paperId) => {
  const response = await api.post(`/api/bookmarks/${paperId}`);
  return response.data;
};

export const removeBookmark = async (paperId) => {
  const response = await api.delete(`/api/bookmarks/${paperId}`);
  return response.data;
};
