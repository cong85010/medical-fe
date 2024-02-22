import { instance } from ".";

const baseURL = "/auth";

export const register = async (body) => {
  const response = await instance.post(`${baseURL}/register`, body);

  return response;
};

export const login = async (body) => {
    const response = await instance.post(`${baseURL}/login`, body);
  
    return response;
  };
  
export const reAuth = async (body) => {
    const response = await instance.post(`${baseURL}/reauth`, body);
  
    return response;
  };
  