import api from "./api";

export const generateResearchPaper = async (topic, instructions = "") => {
  const response = await api.post("/api/ai/generate-paper", {
    topic,
    instructions
  });

  return response.data;
};

export const generateSection = async (topic, section, instructions = "") => {
  const response = await api.post("/api/ai/generate", {
    topic,
    section,
    instructions
  });

  return response.data;
};
