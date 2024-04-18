import { instance } from ".";

const baseURL = "/appointment";

export const createAppointment = async (body) => {
  const response = await instance.post(`${baseURL}/create`, body);

  return response;
};

export const updateAppointment = async (body) => {
  const response = await instance.put(`${baseURL}/${body._id}`, body);

  return response;
};

export const updateStatusAppointment = async (body) => {
  const response = await instance.post(`${baseURL}/update-status`, body);

  return response;
};

export const getListAppointment = async (params = {}) => {
  const paramsStr = Object.entries(params)
    .map((param) => `${param[0]}=${param[1]}`)
    .join("&");
  const response = await instance.get(`${baseURL}?${paramsStr}`);

  return response;
};

export const getListAppointmentQuery = async (body) => {
  const response = await instance.post(`${baseURL}/query`, body);

  return response;
};

export const getAppointment = async (userId) => {
  const response = await instance.get(`${baseURL}/${userId}`);

  return response;
};

export const getListTimeByDate = async (date, doctorId) => {
  const response = await instance.get(
    `${baseURL}/list-time?date=${date}&doctorId=${doctorId}`
  );

  return response;
};
