import { instance } from ".";

const baseURL = "/meeting";

export const createMeetingRoom = async (body) => {
  const response = await instance.post(`${baseURL}`, body);

  return response;
};

export const getMeetingRoom = async (id) => {
  const response = await instance.get(`${baseURL}/${id}`);

  return response;
};

export const updateMeetingRoom = async (body) => {
  const response = await instance.put(`${baseURL}`, body);

  return response;
};

export const deleteMeetingRoom = async (id) => {
  const response = await instance.delete(`${baseURL}/${id}`);

  return response;
};

export const getListMeetingRoom = async (body) => {
  const response = await instance.post(`${baseURL}/list`, body);

  return response;
};
