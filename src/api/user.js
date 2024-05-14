import { instance } from ".";

const BASE_URL = "user";

export const createUser = (user) => {
  return instance.post(`${BASE_URL}/create`, user);
};

export const getUsers = (body) => {
  return instance.post(`${BASE_URL}`, body);
};

export const changeActiveStatus = (user) => {
  return instance.put(`${BASE_URL}/update-status/${user._id}`, user);
};

export const createPatient = (patient) => {
  return instance.post(`${BASE_URL}/create-patient`, patient);
};

export const updateUser = (user) => {
  return instance.put(`${BASE_URL}/update/${user._id}`, user);
};

export const getUserById = (id) => {
  return instance.get(`${BASE_URL}/${id}`);
};

