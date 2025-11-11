import axiosInstance from "./axios";

export const getTests = async () => {
  const { data } = await axiosInstance.get("tests/");
  return data;
};

export const addTest = async (payload) => {
  const { data } = await axiosInstance.post("tests/", payload);
  return data;
};
