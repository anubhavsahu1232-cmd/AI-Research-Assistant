import api from "./api";

export const getResearchPapers = async () => {
  const response = await api.get("/api/research-papers");
  return response.data;
};

export const getResearchPaperById = async (id) => {
  const response = await api.get(`/api/research-papers/${id}`);
  return response.data;
};

export const saveResearchPaper = async (paper) => {
  const response = await api.post("/api/research-papers", paper);
  return response.data;
};

export const updateResearchPaper = async (id, paper) => {
  const response = await api.put(`/api/research-papers/${id}`, paper);
  return response.data;
};

export const deleteResearchPaper = async (id) => {
  const response = await api.delete(`/api/research-papers/${id}`);
  return response.data;
};
