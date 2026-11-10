export type Category = {
  id: number;
  name: string;
  description: string | null;
  services?: string[] | null;
  image: string | null;
  created_at: string | null;
  updated_at: string | null;
};

export type CategoryFormValues = {
  name: string;
  services: string;
  image: File | null;
};

export type ViewCategoriesResponse = {
  success: boolean;
  categories: Category[];
  message?: string;
};

export type CategoryMutationResponse = {
  success: boolean;
  message: string;
  category?: Category;
};

export type SubCategory = {
  id: number;
  category_id: number;
  name: string;
  description: string | null;
  image: string | null;
  category: Category | null;
  created_at: string | null;
  updated_at: string | null;
};

export type SubCategoryFormValues = {
  categoryId: number;
  name: string;
  description: string;
  image: File | null;
};

export type ViewSubCategoriesResponse = {
  success: boolean;
  sub_categories: SubCategory[];
  message?: string;
};

export type SubCategoryMutationResponse = {
  success: boolean;
  message: string;
  sub_category?: SubCategory;
};

export type AdminApiError = {
  success?: boolean;
  message?: string;
  errors?: Record<string, string[]>;
};

export type RequestStatus = "Accepted" | "Completed" | "Rejected";

export type MarkRequestViewedResponse = {
  success: boolean;
  message?: string;
};

export type UpdateRequestResponse = {
  success: boolean;
  message?: string;
};
