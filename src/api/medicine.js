import { instance } from ".";

const baseURL = "/medicine";

export const getListMedicine = async (params = {}) => {
  const paramsStr = Object.entries(params)
    .map((param) => `${param[0]}=${param[1]}`)
    .join("&");
  const response = await instance.get(`${baseURL}?${paramsStr}`);

  return response;
};

export const getMedicine = async (userId) => {
  const response = await instance.get(`${baseURL}/${userId}`);

  return response;
};

export const createMedicine = async (data) => {
  const response = await instance.post(baseURL, data);

  return response;
};
