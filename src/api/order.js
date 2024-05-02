import { instance } from ".";

const baseURL = "/order";

export const createOrder = async (order) => {
  return await instance.post(baseURL, order);
};
export const getListOrder = async (params) => {
  return await instance.get(baseURL, { params });
};
export const getOrder = async (orderId) => {
  return await instance.get(`${baseURL}/${orderId}`);
};
export const getOrderByMedicalRecordId = async (medicalRecordId) => {
  return await instance.get(`${baseURL}/medical/${medicalRecordId}`);
};
export const updateOrder = async (order) => {
  return await instance.put(`${baseURL}/${order._id}`, order);
};
export const deleteOrder = async (orderId) => {
  return await instance.delete(`${baseURL}/${orderId}`);
};
export const getStatisticOrder = async () => {
  return await instance.get(`${baseURL}/statistic`);
};
export const getListOrderByPatientId = async (patientId) => {
  return await instance.get(`${baseURL}/patientId/${patientId}`);
};
