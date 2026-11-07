import api from "./api";

export const getNotes = async () => {
  const response = await api.get("/api/notes");
  return response.data;
};

export const getNotesByPaper = async (paperId) => {
  const response = await api.get(`/api/notes/paper/${paperId}`);
  return response.data;
};

export const saveNote = async (paperId, content) => {
  const response = await api.post(`/api/notes/${paperId}`, {
    content
  });
  return response.data;
};

export const updateNote = async (noteId, content) => {
  const response = await api.put(`/api/notes/${noteId}`, {
    content
  });
  return response.data;
};

export const deleteNote = async (noteId) => {
  const response = await api.delete(`/api/notes/${noteId}`);
  return response.data;
};
