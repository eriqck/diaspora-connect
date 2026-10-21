import axios from "axios";
import {
  ImageIcon,
  LoaderCircle,
  Pencil,
  Plus,
  Search,
  Trash2,
  Upload,
  X,
} from "lucide-react";
import {
  type ChangeEvent,
  type DragEvent,
  type FormEvent,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { toast } from "sonner";
import {
  addCategory,
  addSubCategory,
  deleteCategory,
  deleteSubCategory,
  updateCategory,
  updateSubCategory,
  viewCategories,
  viewSubCategories,
} from "../../apiservices/AdminService";
import type {
  AdminApiError,
  Category,
  CategoryFormValues,
  SubCategory,
  SubCategoryFormValues,
} from "../../formtypes/AdminTypes";
import Pagination from "../components/Pagination";

const ITEMS_PER_PAGE = 8;

const emptyForm: CategoryFormValues = {
  name: "",
  description: "",
  image: null,
};

const emptySubCategoryForm: SubCategoryFormValues = {
  categoryId: 0,
  name: "",
  description: "",
  image: null,
};

const inputClass =
  "mt-2 w-full rounded-xl border border-(--color-border) bg-white px-4 py-3 text-sm outline-none transition placeholder:text-(--color-muted)/65 focus:border-(--color-primary) focus:ring-3 focus:ring-(--color-primary)/10 disabled:cursor-not-allowed disabled:opacity-60";

const getErrorMessage = (error: unknown, fallback: string) => {
  if (!axios.isAxiosError<AdminApiError>(error)) return fallback;

  const response = error.response?.data;
  const validationMessage = response?.errors
    ? Object.values(response.errors).flat()[0]
    : undefined;

  return validationMessage ?? response?.message ?? fallback;
};

function Categories() {
  const formDialog = useRef<HTMLDialogElement>(null);
  const deleteDialog = useRef<HTMLDialogElement>(null);
  const imageInput = useRef<HTMLInputElement>(null);
  const dragDepth = useRef(0);
  const previewObjectUrl = useRef<string | null>(null);
  const subCategoryDialog = useRef<HTMLDialogElement>(null);
  const subCategoryDeleteDialog = useRef<HTMLDialogElement>(null);
  const subCategoryImageInput = useRef<HTMLInputElement>(null);
  const subCategoryPreviewObjectUrl = useRef<string | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [subCategories, setSubCategories] = useState<SubCategory[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [subCategorySearch, setSubCategorySearch] = useState("");
  const [categoryPage, setCategoryPage] = useState(1);
  const [subCategoryPage, setSubCategoryPage] = useState(1);
  const [formValues, setFormValues] = useState<CategoryFormValues>(emptyForm);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [categoryToDelete, setCategoryToDelete] = useState<Category | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isDraggingImage, setIsDraggingImage] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [subCategoryForm, setSubCategoryForm] =
    useState<SubCategoryFormValues>(emptySubCategoryForm);
  const [editingSubCategory, setEditingSubCategory] =
    useState<SubCategory | null>(null);
  const [subCategoryToDelete, setSubCategoryToDelete] =
    useState<SubCategory | null>(null);
  const [isSubCategoryLoading, setIsSubCategoryLoading] = useState(true);
  const [isSubCategorySaving, setIsSubCategorySaving] = useState(false);
  const [isSubCategoryDeleting, setIsSubCategoryDeleting] = useState(false);
  const [isDraggingSubCategoryImage, setIsDraggingSubCategoryImage] =
    useState(false);
  const [subCategoryImagePreview, setSubCategoryImagePreview] =
    useState<string | null>(null);
  const [subCategoryError, setSubCategoryError] = useState<string | null>(null);

  const loadCategories = useCallback(async (showLoader = true) => {
    if (showLoader) setIsLoading(true);
    setLoadError(null);

    try {
      const response = await viewCategories();
      setCategories(response.categories ?? []);
    } catch (error) {
      setLoadError(getErrorMessage(error, "Unable to load categories right now."));
    } finally {
      if (showLoader) setIsLoading(false);
    }
  }, []);

  const loadSubCategories = useCallback(async (showLoader = true) => {
    if (showLoader) setIsSubCategoryLoading(true);
    setSubCategoryError(null);

    try {
      const response = await viewSubCategories();
      setSubCategories(response.sub_categories ?? []);
    } catch (error) {
      setSubCategoryError(
        getErrorMessage(error, "Unable to load sub-categories right now."),
      );
    } finally {
      if (showLoader) setIsSubCategoryLoading(false);
    }
  }, []);

  useEffect(() => {
    let isMounted = true;

    void viewCategories()
      .then((response) => {
        if (isMounted) setCategories(response.categories ?? []);
      })
      .catch((error: unknown) => {
        if (isMounted) {
          setLoadError(
            getErrorMessage(error, "Unable to load categories right now."),
          );
        }
      })
      .finally(() => {
        if (isMounted) setIsLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    let isMounted = true;

    void viewSubCategories()
      .then((response) => {
        if (isMounted) setSubCategories(response.sub_categories ?? []);
      })
      .catch((error: unknown) => {
        if (isMounted) {
          setSubCategoryError(
            getErrorMessage(error, "Unable to load sub-categories right now."),
          );
        }
      })
      .finally(() => {
        if (isMounted) setIsSubCategoryLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    return () => {
      if (previewObjectUrl.current) URL.revokeObjectURL(previewObjectUrl.current);
      if (subCategoryPreviewObjectUrl.current) {
        URL.revokeObjectURL(subCategoryPreviewObjectUrl.current);
      }
    };
  }, []);

  const filteredCategories = useMemo(() => {
    const query = searchTerm.trim().toLowerCase();
    if (!query) return categories;

    return categories.filter(
      (category) =>
        category.name.toLowerCase().includes(query) ||
        category.description?.toLowerCase().includes(query),
    );
  }, [categories, searchTerm]);

  const filteredSubCategories = useMemo(() => {
    const query = subCategorySearch.trim().toLowerCase();
    if (!query) return subCategories;

    return subCategories.filter(
      (subCategory) =>
        subCategory.name.toLowerCase().includes(query) ||
        subCategory.description?.toLowerCase().includes(query) ||
        subCategory.category?.name.toLowerCase().includes(query),
    );
  }, [subCategories, subCategorySearch]);

  const categoryTotalPages = Math.ceil(filteredCategories.length / ITEMS_PER_PAGE);
  const subCategoryTotalPages = Math.ceil(
    filteredSubCategories.length / ITEMS_PER_PAGE,
  );
  const activeCategoryPage = Math.min(
    categoryPage,
    Math.max(1, categoryTotalPages),
  );
  const activeSubCategoryPage = Math.min(
    subCategoryPage,
    Math.max(1, subCategoryTotalPages),
  );
  const paginatedCategories = filteredCategories.slice(
    (activeCategoryPage - 1) * ITEMS_PER_PAGE,
    activeCategoryPage * ITEMS_PER_PAGE,
  );
  const paginatedSubCategories = filteredSubCategories.slice(
    (activeSubCategoryPage - 1) * ITEMS_PER_PAGE,
    activeSubCategoryPage * ITEMS_PER_PAGE,
  );

  const openAddDialog = () => {
    if (previewObjectUrl.current) URL.revokeObjectURL(previewObjectUrl.current);
    previewObjectUrl.current = null;
    setEditingCategory(null);
    setFormValues(emptyForm);
    setImagePreview(null);
    if (imageInput.current) imageInput.current.value = "";
    formDialog.current?.showModal();
  };

  const openEditDialog = (category: Category) => {
    if (previewObjectUrl.current) URL.revokeObjectURL(previewObjectUrl.current);
    previewObjectUrl.current = null;
    setEditingCategory(category);
    setFormValues({
      name: category.name,
      description: category.description ?? "",
      image: null,
    });
    setImagePreview(category.image);
    if (imageInput.current) imageInput.current.value = "";
    formDialog.current?.showModal();
  };

  const closeFormDialog = () => {
    if (isSaving) return;
    formDialog.current?.close();
    setEditingCategory(null);
    setFormValues(emptyForm);
    if (previewObjectUrl.current) URL.revokeObjectURL(previewObjectUrl.current);
    previewObjectUrl.current = null;
    setImagePreview(null);
    setIsDraggingImage(false);
    dragDepth.current = 0;
    if (imageInput.current) imageInput.current.value = "";
  };

  const selectImage = (file: File | null) => {
    if (!file) return;

    if (!(["image/jpeg", "image/png"] as string[]).includes(file.type)) {
      toast.error("Please choose a JPG or PNG image.");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error("The image must be 5 MB or smaller.");
      return;
    }

    if (previewObjectUrl.current) URL.revokeObjectURL(previewObjectUrl.current);
    const objectUrl = URL.createObjectURL(file);
    previewObjectUrl.current = objectUrl;
    setImagePreview(objectUrl);
    setFormValues((current) => ({ ...current, image: file }));
  };

  const handleImageChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] ?? null;
    selectImage(file);
  };

  const handleImageDragEnter = (event: DragEvent<HTMLLabelElement>) => {
    event.preventDefault();
    if (isSaving) return;
    dragDepth.current += 1;
    setIsDraggingImage(true);
  };

  const handleImageDragLeave = (event: DragEvent<HTMLLabelElement>) => {
    event.preventDefault();
    dragDepth.current = Math.max(0, dragDepth.current - 1);
    if (dragDepth.current === 0) setIsDraggingImage(false);
  };

  const handleImageDrop = (event: DragEvent<HTMLLabelElement>) => {
    event.preventDefault();
    dragDepth.current = 0;
    setIsDraggingImage(false);
    if (isSaving) return;
    selectImage(event.dataTransfer.files?.[0] ?? null);
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSaving(true);

    try {
      const response = editingCategory
        ? await updateCategory(editingCategory.id, formValues)
        : await addCategory(formValues);

      toast.success(
        response.message ??
          `Category ${editingCategory ? "updated" : "added"} successfully.`,
      );
      formDialog.current?.close();
      setEditingCategory(null);
      setFormValues(emptyForm);
      if (previewObjectUrl.current) URL.revokeObjectURL(previewObjectUrl.current);
      previewObjectUrl.current = null;
      setImagePreview(null);
      if (imageInput.current) imageInput.current.value = "";
      await loadCategories(false);
    } catch (error) {
      toast.error(
        getErrorMessage(
          error,
          `Unable to ${editingCategory ? "update" : "add"} the category.`,
        ),
      );
    } finally {
      setIsSaving(false);
    }
  };

  const openDeleteDialog = (category: Category) => {
    setCategoryToDelete(category);
    deleteDialog.current?.showModal();
  };

  const closeDeleteDialog = () => {
    if (isDeleting) return;
    deleteDialog.current?.close();
    setCategoryToDelete(null);
  };

  const handleDelete = async () => {
    if (!categoryToDelete) return;
    setIsDeleting(true);

    try {
      const response = await deleteCategory(categoryToDelete.id);
      setCategories((current) =>
        current.filter((category) => category.id !== categoryToDelete.id),
      );
      setSubCategories((current) =>
        current.filter(
          (subCategory) => subCategory.category_id !== categoryToDelete.id,
        ),
      );
      toast.success(response.message ?? "Category deleted successfully.");
      deleteDialog.current?.close();
      setCategoryToDelete(null);
    } catch (error) {
      toast.error(getErrorMessage(error, "Unable to delete the category."));
    } finally {
      setIsDeleting(false);
    }
  };

  const resetSubCategoryForm = () => {
    if (subCategoryPreviewObjectUrl.current) {
      URL.revokeObjectURL(subCategoryPreviewObjectUrl.current);
    }
    subCategoryPreviewObjectUrl.current = null;
    setSubCategoryForm(emptySubCategoryForm);
    setEditingSubCategory(null);
    setSubCategoryImagePreview(null);
    setIsDraggingSubCategoryImage(false);
    if (subCategoryImageInput.current) subCategoryImageInput.current.value = "";
  };

  const openAddSubCategoryDialog = () => {
    if (categories.length === 0) {
      toast.info("Add a category before creating a sub-category.");
      return;
    }

    resetSubCategoryForm();
    setSubCategoryForm({ ...emptySubCategoryForm, categoryId: categories[0].id });
    subCategoryDialog.current?.showModal();
  };

  const openEditSubCategoryDialog = (subCategory: SubCategory) => {
    resetSubCategoryForm();
    setEditingSubCategory(subCategory);
    setSubCategoryForm({
      categoryId: subCategory.category_id,
      name: subCategory.name,
      description: subCategory.description ?? "",
      image: null,
    });
    setSubCategoryImagePreview(subCategory.image);
    subCategoryDialog.current?.showModal();
  };

  const closeSubCategoryDialog = () => {
    if (isSubCategorySaving) return;
    subCategoryDialog.current?.close();
    resetSubCategoryForm();
  };

  const selectSubCategoryImage = (file: File | null) => {
    if (!file) return;

    if (!(["image/jpeg", "image/png"] as string[]).includes(file.type)) {
      toast.error("Please choose a JPG or PNG image.");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error("The image must be 5 MB or smaller.");
      return;
    }

    if (subCategoryPreviewObjectUrl.current) {
      URL.revokeObjectURL(subCategoryPreviewObjectUrl.current);
    }
    const objectUrl = URL.createObjectURL(file);
    subCategoryPreviewObjectUrl.current = objectUrl;
    setSubCategoryImagePreview(objectUrl);
    setSubCategoryForm((current) => ({ ...current, image: file }));
  };

  const handleSubCategoryDrop = (event: DragEvent<HTMLLabelElement>) => {
    event.preventDefault();
    setIsDraggingSubCategoryImage(false);
    if (!isSubCategorySaving) {
      selectSubCategoryImage(event.dataTransfer.files?.[0] ?? null);
    }
  };

  const handleSubCategorySubmit = async (
    event: FormEvent<HTMLFormElement>,
  ) => {
    event.preventDefault();
    setIsSubCategorySaving(true);

    try {
      const response = editingSubCategory
        ? await updateSubCategory(editingSubCategory.id, subCategoryForm)
        : await addSubCategory(subCategoryForm);

      toast.success(
        response.message ??
          `Sub-category ${editingSubCategory ? "updated" : "added"} successfully.`,
      );
      subCategoryDialog.current?.close();
      resetSubCategoryForm();
      await loadSubCategories(false);
    } catch (error) {
      toast.error(
        getErrorMessage(
          error,
          `Unable to ${editingSubCategory ? "update" : "add"} the sub-category.`,
        ),
      );
    } finally {
      setIsSubCategorySaving(false);
    }
  };

  const openDeleteSubCategoryDialog = (subCategory: SubCategory) => {
    setSubCategoryToDelete(subCategory);
    subCategoryDeleteDialog.current?.showModal();
  };

  const closeDeleteSubCategoryDialog = () => {
    if (isSubCategoryDeleting) return;
    subCategoryDeleteDialog.current?.close();
    setSubCategoryToDelete(null);
  };

  const handleDeleteSubCategory = async () => {
    if (!subCategoryToDelete) return;
    setIsSubCategoryDeleting(true);

    try {
      const response = await deleteSubCategory(subCategoryToDelete.id);
      setSubCategories((current) =>
        current.filter((item) => item.id !== subCategoryToDelete.id),
      );
      toast.success(response.message ?? "Sub-category deleted successfully.");
      subCategoryDeleteDialog.current?.close();
      setSubCategoryToDelete(null);
    } catch (error) {
      toast.error(getErrorMessage(error, "Unable to delete the sub-category."));
    } finally {
      setIsSubCategoryDeleting(false);
    }
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs font-extrabold uppercase tracking-[0.18em] text-(--color-primary)">
            Service catalogue
          </p>
          <h1 className="mt-1 text-2xl font-black tracking-tight sm:text-3xl">
            Categories
          </h1>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-(--color-muted)">
            Create and manage the service categories shown to customers.
          </p>
        </div>

        <button
          type="button"
          onClick={openAddDialog}
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-(--color-primary) px-5 py-3 text-sm font-extrabold text-white shadow-sm transition hover:bg-(--color-primary-dark) focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(--color-primary)"
        >
          <Plus className="h-4 w-4" /> Add category
        </button>
      </div>

      <section className="mt-7 overflow-hidden rounded-(--radius-medium) border border-(--color-border) bg-(--color-surface) shadow-(--shadow-soft)">
        <div className="flex flex-col gap-4 border-b border-(--color-border) p-5 sm:flex-row sm:items-center sm:justify-between sm:px-6">
          <div>
            <h2 className="text-base font-black">All categories</h2>
            <p className="mt-1 text-xs text-(--color-muted)">
              {categories.length} {categories.length === 1 ? "category" : "categories"} in total
            </p>
          </div>

          <label className="relative block w-full sm:max-w-xs">
            <span className="sr-only">Search categories</span>
            <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-(--color-muted)" />
            <input
              type="search"
              value={searchTerm}
              onChange={(event) => {
                setSearchTerm(event.target.value);
                setCategoryPage(1);
              }}
              placeholder="Search categories..."
              className="w-full rounded-xl border border-(--color-border) bg-(--color-background) py-2.5 pl-10 pr-4 text-sm outline-none transition focus:border-(--color-primary) focus:ring-3 focus:ring-(--color-primary)/10"
            />
          </label>
        </div>

        {isLoading && (
          <div className="grid gap-3 p-5 sm:grid-cols-2 sm:p-6 lg:grid-cols-4" aria-label="Loading categories">
            {[0, 1, 2, 3].map((item) => (
              <div key={item} className="h-56 animate-pulse rounded-xl bg-(--color-background)" />
            ))}
          </div>
        )}

        {!isLoading && loadError && (
          <div className="p-5 text-center sm:p-8">
            <p role="alert" className="text-sm font-semibold text-red-700">{loadError}</p>
            <button
              type="button"
              onClick={() => void loadCategories()}
              className="mt-4 rounded-lg border border-(--color-border) px-4 py-2 text-sm font-bold transition hover:border-(--color-primary) hover:text-(--color-primary)"
            >
              Try again
            </button>
          </div>
        )}

        {!isLoading && !loadError && filteredCategories.length === 0 && (
          <div className="px-5 py-14 text-center sm:px-6">
            <span className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-(--color-primary)/10 text-(--color-primary)">
              <ImageIcon className="h-6 w-6" />
            </span>
            <h2 className="mt-4 text-base font-black">
              {searchTerm ? "No matching categories" : "No categories yet"}
            </h2>
            <p className="mt-1 text-sm text-(--color-muted)">
              {searchTerm ? "Try a different search term." : "Add your first category to get started."}
            </p>
          </div>
        )}

        {!isLoading && !loadError && filteredCategories.length > 0 && (
          <div className="grid gap-3 p-5 sm:grid-cols-2 sm:p-6 lg:grid-cols-4">
            {paginatedCategories.map((category) => (
              <article
                key={category.id}
                className="group overflow-hidden rounded-xl border border-(--color-border) bg-white transition hover:-translate-y-0.5 hover:shadow-lg"
              >
                <div className="relative aspect-video overflow-hidden bg-(--color-background)">
                  {category.image ? (
                    <img
                      src={category.image}
                      alt=""
                      className="h-full w-full object-cover transition duration-300 group-hover:scale-[1.03]"
                    />
                  ) : (
                    <div className="grid h-full place-items-center text-(--color-muted)">
                      <ImageIcon className="h-9 w-9" />
                    </div>
                  )}
                </div>

                <div className="p-3.5">
                  <h3 className="truncate text-sm font-black">{category.name}</h3>
                  <p className="mt-1.5 min-h-9 line-clamp-2 text-xs leading-4.5 text-(--color-muted)">
                    {category.description || "No description provided."}
                  </p>
                  <div className="mt-3 flex gap-2 border-t border-(--color-border) pt-3">
                    <button
                      type="button"
                      onClick={() => openEditDialog(category)}
                      className="inline-flex flex-1 items-center justify-center gap-2 rounded-lg bg-(--color-primary)/10 px-3 py-2 text-xs font-extrabold text-(--color-primary) transition hover:bg-(--color-primary) hover:text-white"
                    >
                      <Pencil className="h-3.5 w-3.5" /> Edit
                    </button>
                    <button
                      type="button"
                      onClick={() => openDeleteDialog(category)}
                      className="inline-flex flex-1 items-center justify-center gap-2 rounded-lg bg-red-50 px-3 py-2 text-xs font-extrabold text-red-600 transition hover:bg-red-600 hover:text-white"
                    >
                      <Trash2 className="h-3.5 w-3.5" /> Delete
                    </button>
                  </div>
                </div>
              </article>
            ))}
            <Pagination
              currentPage={activeCategoryPage}
              totalPages={categoryTotalPages}
              onPageChange={setCategoryPage}
              className="col-span-full pt-3"
            />
          </div>
        )}
      </section>

      <section className="mt-7 overflow-hidden rounded-(--radius-medium) border border-(--color-border) bg-(--color-surface) shadow-(--shadow-soft)">
        <div className="flex flex-col gap-4 border-b border-(--color-border) p-5 sm:flex-row sm:items-center sm:justify-between sm:px-6">
          <div>
            <h2 className="text-base font-black">Sub-categories</h2>
            <p className="mt-1 text-xs text-(--color-muted)">
              {subCategories.length} {subCategories.length === 1 ? "sub-category" : "sub-categories"} in total
            </p>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row">
            <label className="relative block w-full sm:w-64">
              <span className="sr-only">Search sub-categories</span>
              <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-(--color-muted)" />
              <input
                type="search"
                value={subCategorySearch}
                onChange={(event) => {
                  setSubCategorySearch(event.target.value);
                  setSubCategoryPage(1);
                }}
                placeholder="Search sub-categories..."
                className="w-full rounded-xl border border-(--color-border) bg-(--color-background) py-2.5 pl-10 pr-4 text-sm outline-none transition focus:border-(--color-primary) focus:ring-3 focus:ring-(--color-primary)/10"
              />
            </label>
            <button
              type="button"
              onClick={openAddSubCategoryDialog}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-(--color-primary) px-4 py-2.5 text-sm font-extrabold text-white transition hover:bg-(--color-primary-dark)"
            >
              <Plus className="h-4 w-4" /> Add sub-category
            </button>
          </div>
        </div>

        {isSubCategoryLoading && (
          <div className="grid gap-3 p-5 sm:grid-cols-2 sm:p-6 lg:grid-cols-4" aria-label="Loading sub-categories">
            {[0, 1, 2, 3].map((item) => (
              <div key={item} className="h-60 animate-pulse rounded-xl bg-(--color-background)" />
            ))}
          </div>
        )}

        {!isSubCategoryLoading && subCategoryError && (
          <div className="p-6 text-center">
            <p role="alert" className="text-sm font-semibold text-red-700">{subCategoryError}</p>
            <button
              type="button"
              onClick={() => void loadSubCategories()}
              className="mt-4 rounded-lg border border-(--color-border) px-4 py-2 text-sm font-bold hover:border-(--color-primary) hover:text-(--color-primary)"
            >
              Try again
            </button>
          </div>
        )}

        {!isSubCategoryLoading && !subCategoryError && filteredSubCategories.length === 0 && (
          <div className="px-5 py-14 text-center">
            <ImageIcon className="mx-auto h-8 w-8 text-(--color-muted)" />
            <h3 className="mt-3 text-sm font-black">
              {subCategorySearch ? "No matching sub-categories" : "No sub-categories yet"}
            </h3>
            <p className="mt-1 text-xs text-(--color-muted)">
              {subCategorySearch ? "Try a different search term." : "Add a sub-category to organise your services."}
            </p>
          </div>
        )}

        {!isSubCategoryLoading && !subCategoryError && filteredSubCategories.length > 0 && (
          <div className="grid gap-3 p-5 sm:grid-cols-2 sm:p-6 lg:grid-cols-4">
            {paginatedSubCategories.map((subCategory) => (
              <article
                key={subCategory.id}
                className="group overflow-hidden rounded-xl border border-(--color-border) bg-white transition hover:-translate-y-0.5 hover:shadow-lg"
              >
                <div className="relative aspect-video overflow-hidden bg-(--color-background)">
                  {subCategory.image ? (
                    <img
                      src={subCategory.image}
                      alt=""
                      className="h-full w-full object-cover transition duration-300 group-hover:scale-[1.03]"
                    />
                  ) : (
                    <div className="grid h-full place-items-center text-(--color-muted)">
                      <ImageIcon className="h-9 w-9" />
                    </div>
                  )}
                  <span className="absolute left-2.5 top-2.5 max-w-[calc(100%-1.25rem)] truncate rounded-full bg-white/95 px-2.5 py-1 text-[10px] font-extrabold text-(--color-primary-dark) shadow-sm">
                    {subCategory.category?.name ?? "Unassigned"}
                  </span>
                </div>
                <div className="p-3.5">
                  <h3 className="truncate text-sm font-black">{subCategory.name}</h3>
                  <p className="mt-1.5 min-h-9 line-clamp-2 text-xs leading-4.5 text-(--color-muted)">
                    {subCategory.description || "No description provided."}
                  </p>
                  <div className="mt-3 flex gap-2 border-t border-(--color-border) pt-3">
                    <button
                      type="button"
                      onClick={() => openEditSubCategoryDialog(subCategory)}
                      className="inline-flex flex-1 items-center justify-center gap-2 rounded-lg bg-(--color-primary)/10 px-3 py-2 text-xs font-extrabold text-(--color-primary) transition hover:bg-(--color-primary) hover:text-white"
                    >
                      <Pencil className="h-3.5 w-3.5" /> Edit
                    </button>
                    <button
                      type="button"
                      onClick={() => openDeleteSubCategoryDialog(subCategory)}
                      className="inline-flex flex-1 items-center justify-center gap-2 rounded-lg bg-red-50 px-3 py-2 text-xs font-extrabold text-red-600 transition hover:bg-red-600 hover:text-white"
                    >
                      <Trash2 className="h-3.5 w-3.5" /> Delete
                    </button>
                  </div>
                </div>
              </article>
            ))}
            <Pagination
              currentPage={activeSubCategoryPage}
              totalPages={subCategoryTotalPages}
              onPageChange={setSubCategoryPage}
              className="col-span-full pt-3"
            />
          </div>
        )}
      </section>

      <dialog
        ref={formDialog}
        onCancel={(event) => {
          if (isSaving) event.preventDefault();
        }}
        className="m-auto w-[calc(100%-2rem)] max-w-lg rounded-2xl bg-white p-0 text-(--color-ink) shadow-2xl backdrop:bg-slate-950/50 backdrop:backdrop-blur-[2px]"
      >
        <form onSubmit={handleSubmit}>
          <div className="flex items-start justify-between border-b border-(--color-border) px-5 py-4 sm:px-6">
            <div>
              <h2 className="text-lg font-black">
                {editingCategory ? "Edit category" : "Add category"}
              </h2>
              <p className="mt-1 text-xs text-(--color-muted)">
                {editingCategory ? "Update the category details below." : "Create a new service category."}
              </p>
            </div>
            <button
              type="button"
              onClick={closeFormDialog}
              disabled={isSaving}
              className="grid h-9 w-9 place-items-center rounded-lg text-(--color-muted) transition hover:bg-(--color-background) hover:text-(--color-ink) disabled:opacity-50"
              aria-label="Close dialog"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <div className="space-y-5 px-5 py-5 sm:px-6">
            <div>
              <label htmlFor="category-name" className="text-sm font-bold">
                Category name <span className="text-red-600">*</span>
              </label>
              <input
                id="category-name"
                value={formValues.name}
                onChange={(event) =>
                  setFormValues((current) => ({ ...current, name: event.target.value }))
                }
                maxLength={255}
                required
                autoFocus
                disabled={isSaving}
                placeholder="e.g. Property support"
                className={inputClass}
              />
            </div>

            <div>
              <div className="flex items-center justify-between gap-4">
                <label htmlFor="category-description" className="text-sm font-bold">Description</label>
                <span className="text-xs text-(--color-muted)">{formValues.description.length}/255</span>
              </div>
              <textarea
                id="category-description"
                value={formValues.description}
                onChange={(event) =>
                  setFormValues((current) => ({ ...current, description: event.target.value }))
                }
                maxLength={255}
                rows={4}
                disabled={isSaving}
                placeholder="Briefly describe this category"
                className={`${inputClass} resize-none`}
              />
            </div>

            <div>
              <label htmlFor="category-image" className="text-sm font-bold">Category image</label>
              {imagePreview && (
                <div className="mt-2 overflow-hidden rounded-xl border border-(--color-border) bg-(--color-background)">
                  <img
                    src={imagePreview}
                    alt={`${formValues.name || editingCategory?.name || "Category"} preview`}
                    className="h-40 w-full object-cover"
                  />
                </div>
              )}
              <label
                htmlFor="category-image"
                onDragEnter={handleImageDragEnter}
                onDragOver={(event) => {
                  event.preventDefault();
                  event.dataTransfer.dropEffect = "copy";
                }}
                onDragLeave={handleImageDragLeave}
                onDrop={handleImageDrop}
                className={`mt-2 flex min-h-28 cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed px-4 py-5 text-center transition sm:flex-row sm:gap-4 sm:text-left ${
                  isDraggingImage
                    ? "scale-[1.01] border-(--color-primary) bg-(--color-primary)/10"
                    : "border-(--color-border) bg-(--color-background) hover:border-(--color-primary) hover:bg-(--color-primary)/5"
                } ${isSaving ? "pointer-events-none opacity-60" : ""}`}
              >
                <span className={`grid h-11 w-11 shrink-0 place-items-center rounded-xl text-(--color-primary) transition ${
                  isDraggingImage ? "bg-white shadow-sm" : "bg-(--color-primary)/10"
                }`}>
                  <Upload className="h-5 w-5" />
                </span>
                <span className="min-w-0">
                  <span className="block truncate text-sm font-bold">
                    {isDraggingImage
                      ? "Drop the image here"
                      : formValues.image?.name ??
                        (editingCategory?.image
                          ? "Drag an image here to replace it"
                          : "Drag and drop an image here")}
                  </span>
                  <span className="mt-1 block text-xs text-(--color-muted)">
                    {formValues.image
                      ? `${(formValues.image.size / 1024 / 1024).toFixed(2)} MB · Click to choose another`
                      : "or click to browse · JPG or PNG, up to 5 MB"}
                  </span>
                </span>
              </label>
              <input
                ref={imageInput}
                id="category-image"
                type="file"
                accept="image/jpeg,image/png,.jpg,.jpeg,.png"
                onChange={handleImageChange}
                disabled={isSaving}
                className="sr-only"
              />
            </div>
          </div>

          <div className="flex justify-end gap-3 border-t border-(--color-border) bg-(--color-background)/60 px-5 py-4 sm:px-6">
            <button
              type="button"
              onClick={closeFormDialog}
              disabled={isSaving}
              className="rounded-xl border border-(--color-border) bg-white px-4 py-2.5 text-sm font-bold transition hover:border-(--color-muted) disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSaving}
              className="inline-flex min-w-32 items-center justify-center gap-2 rounded-xl bg-(--color-primary) px-5 py-2.5 text-sm font-extrabold text-white transition hover:bg-(--color-primary-dark) disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isSaving && <LoaderCircle className="h-4 w-4 animate-spin" />}
              {isSaving ? "Saving..." : editingCategory ? "Save changes" : "Add category"}
            </button>
          </div>
        </form>
      </dialog>

      <dialog
        ref={deleteDialog}
        onCancel={(event) => {
          if (isDeleting) event.preventDefault();
        }}
        className="m-auto w-[calc(100%-2rem)] max-w-md rounded-2xl bg-white p-0 text-(--color-ink) shadow-2xl backdrop:bg-slate-950/50 backdrop:backdrop-blur-[2px]"
      >
        <div className="p-6">
          <span className="grid h-12 w-12 place-items-center rounded-xl bg-red-50 text-red-600">
            <Trash2 className="h-5 w-5" />
          </span>
          <h2 className="mt-4 text-lg font-black">Delete category?</h2>
          <p className="mt-2 text-sm leading-6 text-(--color-muted)">
            <span className="font-bold text-(--color-ink)">{categoryToDelete?.name}</span>{" "}
            will be permanently removed. This action cannot be undone.
          </p>
          <div className="mt-6 flex justify-end gap-3">
            <button
              type="button"
              onClick={closeDeleteDialog}
              disabled={isDeleting}
              className="rounded-xl border border-(--color-border) px-4 py-2.5 text-sm font-bold transition hover:border-(--color-muted) disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={() => void handleDelete()}
              disabled={isDeleting}
              className="inline-flex min-w-31 items-center justify-center gap-2 rounded-xl bg-red-600 px-4 py-2.5 text-sm font-extrabold text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isDeleting && <LoaderCircle className="h-4 w-4 animate-spin" />}
              {isDeleting ? "Deleting..." : "Delete category"}
            </button>
          </div>
        </div>
      </dialog>

      <dialog
        ref={subCategoryDialog}
        onCancel={(event) => {
          if (isSubCategorySaving) event.preventDefault();
        }}
        className="m-auto max-h-[calc(100vh-2rem)] w-[calc(100%-2rem)] max-w-lg overflow-y-auto rounded-2xl bg-white p-0 text-(--color-ink) shadow-2xl backdrop:bg-slate-950/50 backdrop:backdrop-blur-[2px]"
      >
        <form onSubmit={handleSubCategorySubmit}>
          <div className="sticky top-0 z-10 flex items-start justify-between border-b border-(--color-border) bg-white px-5 py-4 sm:px-6">
            <div>
              <h2 className="text-lg font-black">
                {editingSubCategory ? "Edit sub-category" : "Add sub-category"}
              </h2>
              <p className="mt-1 text-xs text-(--color-muted)">
                Choose its parent category and add the details below.
              </p>
            </div>
            <button
              type="button"
              onClick={closeSubCategoryDialog}
              disabled={isSubCategorySaving}
              className="grid h-9 w-9 place-items-center rounded-lg text-(--color-muted) hover:bg-(--color-background) disabled:opacity-50"
              aria-label="Close dialog"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <div className="space-y-5 px-5 py-5 sm:px-6">
            <div>
              <label htmlFor="sub-category-parent" className="text-sm font-bold">
                Parent category <span className="text-red-600">*</span>
              </label>
              <select
                id="sub-category-parent"
                value={subCategoryForm.categoryId}
                onChange={(event) =>
                  setSubCategoryForm((current) => ({
                    ...current,
                    categoryId: Number(event.target.value),
                  }))
                }
                required
                disabled={isSubCategorySaving}
                className={inputClass}
              >
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>{category.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="sub-category-name" className="text-sm font-bold">
                Sub-category name <span className="text-red-600">*</span>
              </label>
              <input
                id="sub-category-name"
                value={subCategoryForm.name}
                onChange={(event) =>
                  setSubCategoryForm((current) => ({ ...current, name: event.target.value }))
                }
                maxLength={255}
                required
                autoFocus
                disabled={isSubCategorySaving}
                placeholder="e.g. Property inspection"
                className={inputClass}
              />
            </div>

            <div>
              <div className="flex items-center justify-between gap-4">
                <label htmlFor="sub-category-description" className="text-sm font-bold">Description</label>
                <span className="text-xs text-(--color-muted)">{subCategoryForm.description.length}/255</span>
              </div>
              <textarea
                id="sub-category-description"
                value={subCategoryForm.description}
                onChange={(event) =>
                  setSubCategoryForm((current) => ({ ...current, description: event.target.value }))
                }
                maxLength={255}
                rows={3}
                disabled={isSubCategorySaving}
                placeholder="Briefly describe this sub-category"
                className={`${inputClass} resize-none`}
              />
            </div>

            <div>
              <label htmlFor="sub-category-image" className="text-sm font-bold">Sub-category image</label>
              {subCategoryImagePreview && (
                <div className="mt-2 overflow-hidden rounded-xl border border-(--color-border) bg-(--color-background)">
                  <img
                    src={subCategoryImagePreview}
                    alt={`${subCategoryForm.name || editingSubCategory?.name || "Sub-category"} preview`}
                    className="h-40 w-full object-cover"
                  />
                </div>
              )}
              <label
                htmlFor="sub-category-image"
                onDragEnter={(event) => {
                  event.preventDefault();
                  if (!isSubCategorySaving) setIsDraggingSubCategoryImage(true);
                }}
                onDragOver={(event) => {
                  event.preventDefault();
                  event.dataTransfer.dropEffect = "copy";
                }}
                onDragLeave={(event) => {
                  event.preventDefault();
                  if (!event.currentTarget.contains(event.relatedTarget as Node)) {
                    setIsDraggingSubCategoryImage(false);
                  }
                }}
                onDrop={handleSubCategoryDrop}
                className={`mt-2 flex min-h-28 cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed px-4 py-5 text-center transition sm:flex-row sm:gap-4 sm:text-left ${
                  isDraggingSubCategoryImage
                    ? "scale-[1.01] border-(--color-primary) bg-(--color-primary)/10"
                    : "border-(--color-border) bg-(--color-background) hover:border-(--color-primary)"
                } ${isSubCategorySaving ? "pointer-events-none opacity-60" : ""}`}
              >
                <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-(--color-primary)/10 text-(--color-primary)">
                  <Upload className="h-5 w-5" />
                </span>
                <span className="min-w-0">
                  <span className="block truncate text-sm font-bold">
                    {isDraggingSubCategoryImage
                      ? "Drop the image here"
                      : subCategoryForm.image?.name ??
                        (editingSubCategory?.image
                          ? "Drag an image here to replace it"
                          : "Drag and drop an image here")}
                  </span>
                  <span className="mt-1 block text-xs text-(--color-muted)">
                    {subCategoryForm.image
                      ? `${(subCategoryForm.image.size / 1024 / 1024).toFixed(2)} MB | Click to choose another`
                      : "or click to browse | JPG or PNG, up to 5 MB"}
                  </span>
                </span>
              </label>
              <input
                ref={subCategoryImageInput}
                id="sub-category-image"
                type="file"
                accept="image/jpeg,image/png,.jpg,.jpeg,.png"
                onChange={(event) => selectSubCategoryImage(event.target.files?.[0] ?? null)}
                disabled={isSubCategorySaving}
                className="sr-only"
              />
            </div>
          </div>

          <div className="sticky bottom-0 flex justify-end gap-3 border-t border-(--color-border) bg-(--color-background) px-5 py-4 sm:px-6">
            <button
              type="button"
              onClick={closeSubCategoryDialog}
              disabled={isSubCategorySaving}
              className="rounded-xl border border-(--color-border) bg-white px-4 py-2.5 text-sm font-bold disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubCategorySaving || subCategoryForm.categoryId === 0}
              className="inline-flex min-w-36 items-center justify-center gap-2 rounded-xl bg-(--color-primary) px-5 py-2.5 text-sm font-extrabold text-white hover:bg-(--color-primary-dark) disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isSubCategorySaving && <LoaderCircle className="h-4 w-4 animate-spin" />}
              {isSubCategorySaving ? "Saving..." : editingSubCategory ? "Save changes" : "Add sub-category"}
            </button>
          </div>
        </form>
      </dialog>

      <dialog
        ref={subCategoryDeleteDialog}
        onCancel={(event) => {
          if (isSubCategoryDeleting) event.preventDefault();
        }}
        className="m-auto w-[calc(100%-2rem)] max-w-md rounded-2xl bg-white p-0 text-(--color-ink) shadow-2xl backdrop:bg-slate-950/50 backdrop:backdrop-blur-[2px]"
      >
        <div className="p-6">
          <span className="grid h-12 w-12 place-items-center rounded-xl bg-red-50 text-red-600">
            <Trash2 className="h-5 w-5" />
          </span>
          <h2 className="mt-4 text-lg font-black">Delete sub-category?</h2>
          <p className="mt-2 text-sm leading-6 text-(--color-muted)">
            <span className="font-bold text-(--color-ink)">{subCategoryToDelete?.name}</span>{" "}
            will be permanently removed. This action cannot be undone.
          </p>
          <div className="mt-6 flex justify-end gap-3">
            <button
              type="button"
              onClick={closeDeleteSubCategoryDialog}
              disabled={isSubCategoryDeleting}
              className="rounded-xl border border-(--color-border) px-4 py-2.5 text-sm font-bold disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={() => void handleDeleteSubCategory()}
              disabled={isSubCategoryDeleting}
              className="inline-flex min-w-36 items-center justify-center gap-2 rounded-xl bg-red-600 px-4 py-2.5 text-sm font-extrabold text-white hover:bg-red-700 disabled:opacity-60"
            >
              {isSubCategoryDeleting && <LoaderCircle className="h-4 w-4 animate-spin" />}
              {isSubCategoryDeleting ? "Deleting..." : "Delete sub-category"}
            </button>
          </div>
        </div>
      </dialog>
    </div>
  );
}

export default Categories;
