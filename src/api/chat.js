import { instance } from ".";

const baseURL = "/chat";

export const getChatsByConversationId = async (conversationId) => {
  const response = await instance.post(`${baseURL}/list`, {
    conversationId,
  });
  return response;
};

export const createChat = async (data) => {
  const response = await instance.post(`${baseURL}/create`, data);
  return response;
};
