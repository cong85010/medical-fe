import { instance } from ".";

const baseURL = "/medical-record";

export const createMedicalRecord = async (body) => {
  const response = await instance.post(`${baseURL}`, body);

  return response;
};

export const getMedicalRecord = async (id) => {
  const response = await instance.get(`${baseURL}/${id}`);

  return response;
};

export const updateMedicalRecord = async (body) => {
  const response = await instance.put(`${baseURL}`, body);

  return response;
};

export const deleteMedicalRecord = async (id) => {
  const response = await instance.delete(`${baseURL}/${id}`);

  return response;
};

export const getListMedicalRecord = async (body) => {
  const response = await instance.post(`${baseURL}/list`, body);

  return response;
};
