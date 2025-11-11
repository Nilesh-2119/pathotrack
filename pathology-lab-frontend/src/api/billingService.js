import axiosInstance from "./axios";

export const getBills = async () => {
  const { data } = await axiosInstance.get("billing/");
  return data;
};

export const createBill = async (payload) => {
  const { data } = await axiosInstance.post("billing/", payload);
  return data;
};
