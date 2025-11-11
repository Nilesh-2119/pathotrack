import axiosInstance from "./axios";

export const assignTest = async (payload) => {
  const { data } = await axiosInstance.post("reports/", payload);
  return data;
};

export const generateReport = async (patientId) => {
  const { data } = await axiosInstance.post("reports/generate/", {
    patient: patientId,
  });
  return data;
};

export const getReports = async () => {
  const { data } = await axiosInstance.get("reports/");
  return data;
};
