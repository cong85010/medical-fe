import { instance } from ".";

const baseURL = "/conversation";

export const getConversationsByUserId = async (userId) => {
  const response = await instance.post(`${baseURL}/list`, {
    userId,
  });
  return response;
};

export const getConversationinstance = async (conversationId) => {
  const response = await instance.get(`${baseURL}/${conversationId}`);
  return response;
};

export const createConversation = async (data) => {
  const response = await instance.post(`${baseURL}/create`, data);
  return response;
};
