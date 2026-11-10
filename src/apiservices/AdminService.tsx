import type {
  CategoryFormValues,
  CategoryMutationResponse,
  MarkRequestViewedResponse,
  RequestStatus,
  SubCategoryFormValues,
  SubCategoryMutationResponse,
  UpdateRequestResponse,
  ViewCategoriesResponse,
  ViewSubCategoriesResponse,
} from "../formtypes/AdminTypes";
import apiClient from "./Api_client";

export const viewRequests = async () => {
  const response = await apiClient.get("/view-requests");
  console.log("View requests response:", response.data);
  return response.data;
};

export const markRequestViewed = async (requestId: number) => {
  const response = await apiClient.post<MarkRequestViewedResponse>(
    "/mark-viewed",
    { request_id: requestId },
  );
  return response.data;
};

export const updateRequest = async (
  requestId: number,
  status: RequestStatus,
  comments: string,
) => {
  const response = await apiClient.patch<UpdateRequestResponse>(
    "/update-request",
    {
      request_id: requestId,
      status,
      comments: comments.trim(),
    },
  );
  return response.data;
};

const toCategoryFormData = (
  values: CategoryFormValues,
  categoryId?: number,
) => {
  const formData = new FormData();

  if (categoryId !== undefined) {
    formData.append("category_id", String(categoryId));
  }

  formData.append("name", values.name.trim());

  const services = values.services
    .split(/\r?\n/)
    .map((service) => service.trim())
    .filter(Boolean);

  if (services.length > 0) {
    // Sent as services[0], services[1]... so Laravel reads it as a real array
    services.forEach((service) => formData.append("services[]", service));
  } else {
    // Empty string becomes null in Laravel, which clears the list
    formData.append("services", "");
  }

  if (values.image) {
    formData.append("image", values.image);
  }

  return formData;
};

export const addCategory = async (values: CategoryFormValues) => {
  const response = await apiClient.post<CategoryMutationResponse>(
    "/add-category",
    toCategoryFormData(values),
  );
  return response.data;
};

export const viewCategories = async () => {
  const response = await apiClient.get<ViewCategoriesResponse>(
    "/view-categories",
  );
  console.log("View categories response:", response.data);
  return response.data;
};

export const updateCategory = async (
  categoryId: number,
  values: CategoryFormValues,
) => {
  const formData = toCategoryFormData(values, categoryId);
  formData.append("_method", "PATCH");

  const response = await apiClient.post<CategoryMutationResponse>(
    "/update-category",
    formData,
  );
  return response.data;
};

export const deleteCategory = async (categoryId: number) => {
  const response = await apiClient.delete<CategoryMutationResponse>(
    `/delete-category/${categoryId}`,
  );
  return response.data;
};

const toSubCategoryFormData = (
  values: SubCategoryFormValues,
  subCategoryId?: number,
) => {
  const formData = new FormData();

  if (subCategoryId !== undefined) {
    formData.append("sub_category_id", String(subCategoryId));
  }

  formData.append("category_id", String(values.categoryId));
  formData.append("name", values.name.trim());
  formData.append("description", values.description.trim());

  if (values.image) formData.append("image", values.image);

  return formData;
};

export const addSubCategory = async (values: SubCategoryFormValues) => {
  const response = await apiClient.post<SubCategoryMutationResponse>(
    "/add-sub-category",
    toSubCategoryFormData(values),
  );
  return response.data;
};

export const viewSubCategories = async () => {
  const response = await apiClient.get<ViewSubCategoriesResponse>(
    "/view-sub-categories",
  );
  return response.data;
};

export const updateSubCategory = async (
  subCategoryId: number,
  values: SubCategoryFormValues,
) => {
  const formData = toSubCategoryFormData(values, subCategoryId);
  formData.append("_method", "PATCH");

  const response = await apiClient.post<SubCategoryMutationResponse>(
    "/update-sub-category",
    formData,
  );
  return response.data;
};

export const deleteSubCategory = async (subCategoryId: number) => {
  const response = await apiClient.delete<SubCategoryMutationResponse>(
    `/delete-sub-category/${subCategoryId}`,
  );
  return response.data;
};
