import type {
  AuthResponse,
  LoginFormData,
  RegisterFormData,
} from "../formtypes/AuthTypes";
import apiClient from "./Api_client";

export const registerUser = async (formData: RegisterFormData) => {
  const response = await apiClient.post<AuthResponse>("/sign-up", formData);
  return response.data;
};

export const loginUser = async (formData: LoginFormData) => {
  const response = await apiClient.post<AuthResponse>("/sign-in", formData);
  return response.data;
};

export const loginAdmin = async (formData: LoginFormData) => {
  const response = await apiClient.post<AuthResponse>("/admin-sign-in", formData);
  return response.data;
};

export const logoutUser = async () => {
  const response = await apiClient.post("/sign-out");
  return response.data;
};
