import api from "./api";

export const getTopics = async () => {
  const response = await api.get("/api/topics");
  return response.data;
};

export const createTopic = async (data) => {
  const response = await api.post("/api/topics", data);
  return response.data;
};

export const updateTopic = async (id, data) => {
  const response = await api.put(`/api/topics/${id}`, data);
  return response.data;
};

export const deleteTopic = async (id) => {
  const response = await api.delete(`/api/topics/${id}`);
  return response.data;
};
