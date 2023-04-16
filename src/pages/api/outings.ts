import axios from "axios";

const BASE_URL = "https://www.yourdomain.com/api";

export const createUser = async (body: any) => {
  const response = await axios.post(`${BASE_URL}/users`, body);
  return response.data;
};

export const getUserList = async () => {
  const response = await axios.get(`${BASE_URL}/users`);
  return response.data;
};

export const getUserDetails = async (userId: number) => {
  const response = await axios.get(`${BASE_URL}/users/${userId}`);
  return response.data;
};

export const updateUser = async (body: any) => {
  const response = await axios.put(`${BASE_URL}/users`, body);
  return response.data;
};

export const deleteUser = async (userId: number) => {
  const response = await axios.delete(`${BASE_URL}/users/${userId}`);
  return response.data;
};
