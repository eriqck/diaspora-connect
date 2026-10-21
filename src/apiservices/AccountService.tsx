import type {
  AccountResponse,
  UpdateAccountData,
} from "../formtypes/AccountTypes";
import apiClient from "./Api_client";

export const getAccount = async () => {
  const response = await apiClient.get<AccountResponse>("/account");
  console.log("Account response:", response.data);  
  return response.data;
};

export const updateAccount = async (formData: UpdateAccountData) => {
  const response = await apiClient.patch<AccountResponse>("/update-account", formData);
  return response.data;
};
