import api from "./api";

export const saveDraft = async (draft) => {
  const response = await api.post("/api/drafts", {
    title: draft.title,
    topic: draft.topic,
    content: draft.content
  });

  return response.data;
};

export const getDrafts = async () => {
  const response = await api.get("/api/drafts");
  return response.data;
};

export const getDraftById = async (id) => {
  const response = await api.get(`/api/drafts/${id}`);
  return response.data;
};

export const updateDraft = async (id, draft) => {
  const response = await api.put(`/api/drafts/${id}`, draft);
  return response.data;
};

export const deleteDraft = async (id) => {
  const response = await api.delete(`/api/drafts/${id}`);
  return response.data;
};
