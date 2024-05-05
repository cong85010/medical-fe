import { instance } from ".";

const baseURL = "/statistic";

export const getStatistic = async (body) => {
  const response = await instance.post(baseURL, body);

  return response;
};
