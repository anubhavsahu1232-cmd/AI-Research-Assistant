import api from "./api";

export const getReadingHistory = async () => {
  const response = await api.get("/api/reading-history");
  return response.data;
};

export const addReadingHistory = async (paperId) => {
  const response = await api.post(`/api/reading-history/${paperId}`);
  return response.data;
};

export const clearReadingHistory = async () => {
  const response = await api.delete("/api/reading-history");
  return response.data;
};
