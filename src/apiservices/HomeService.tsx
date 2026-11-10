import apiClient from "./Api_client";
import type {
  SubmitRequestData,
  SubmitRequestResponse,
} from "../formtypes/HomeTypes";

export type HomeSubCategory = {
  id: number;
  category_id: number;
  name: string;
  description: string | null;
  image: string | null;
};

export type HomeCategory = {
  id: number;
  name: string;
  description?: string | null;
  image: string | null;
  services?: string[] | null;
  sub_categories?: HomeSubCategory[];
};

export type FetchCategoriesResponse = {
  success: boolean;
  categories: HomeCategory[];
  message?: string;
};

export const fetchCategories = async (): Promise<FetchCategoriesResponse> => {
  const response = await apiClient.get<FetchCategoriesResponse>(
    "/fetch-categories",
  );
  console.log("Fetched categories:", response.data);
  return response.data;
};

export const submitRequest = async (
  requestData: SubmitRequestData,
): Promise<SubmitRequestResponse> => {
  const response = await apiClient.post<SubmitRequestResponse>(
    "/submit-request",
    requestData,
  );
  return response.data;
};
