import { instance } from ".";

const baseURL = "/prescription";

export const getListPrescription = async (params = {}) => {
  const paramsStr = Object.entries(params)
    .map((param) => `${param[0]}=${param[1]}`)
    .join("&");
  const response = await instance.get(`${baseURL}?${paramsStr}`);

  return response;
};

export const getPrescription = async (userId) => {
  const response = await instance.get(`${baseURL}/${userId}`);

  return response;
};
