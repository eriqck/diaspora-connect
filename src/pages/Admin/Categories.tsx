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
  deleteCategory,
  updateCategory,
  viewCategories,
} from "../../apiservices/AdminService";
import type {
  AdminApiError,
  Category,
  CategoryFormValues,
} from "../../formtypes/AdminTypes";
import Pagination from "../components/Pagination";

const ITEMS_PER_PAGE = 8;

const emptyForm: CategoryFormValues = {
  name: "",
  services: "",
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
  const [categories, setCategories] = useState<Category[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryPage, setCategoryPage] = useState(1);
  const [formValues, setFormValues] = useState<CategoryFormValues>(emptyForm);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [categoryToDelete, setCategoryToDelete] = useState<Category | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isDraggingImage, setIsDraggingImage] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [loadError, setLoadError] = useState<string | null>(null);

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
    return () => {
      if (previewObjectUrl.current) URL.revokeObjectURL(previewObjectUrl.current);
    };
  }, []);

  const filteredCategories = useMemo(() => {
    const query = searchTerm.trim().toLowerCase();
    if (!query) return categories;

    return categories.filter(
      (category) =>
        category.name.toLowerCase().includes(query) ||
        category.description?.toLowerCase().includes(query) ||
        category.services?.some((service) =>
          service.toLowerCase().includes(query),
        ),
    );
  }, [categories, searchTerm]);

  const categoryTotalPages = Math.ceil(filteredCategories.length / ITEMS_PER_PAGE);
  const activeCategoryPage = Math.min(
    categoryPage,
    Math.max(1, categoryTotalPages),
  );
  const paginatedCategories = filteredCategories.slice(
    (activeCategoryPage - 1) * ITEMS_PER_PAGE,
    activeCategoryPage * ITEMS_PER_PAGE,
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
      services: category.services?.join("\n") ?? "",
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
      toast.success(response.message ?? "Category deleted successfully.");
      deleteDialog.current?.close();
      setCategoryToDelete(null);
    } catch (error) {
      toast.error(getErrorMessage(error, "Unable to delete the category."));
    } finally {
      setIsDeleting(false);
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
                  {category.services?.length ? (
                    <ul className="mt-1.5 min-h-9 list-inside list-disc space-y-0.5 text-xs leading-4.5 text-(--color-muted)">
                      {category.services.map((service, index) => (
                        <li key={`${service}-${index}`}>{service}</li>
                      ))}
                    </ul>
                  ) : (
                    <p className="mt-1.5 min-h-9 text-xs leading-4.5 text-(--color-muted)">
                      No services added.
                    </p>
                  )}
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
                <label htmlFor="category-services" className="text-sm font-bold">Services</label>
                <span className="text-xs text-(--color-muted)">One service per line</span>
              </div>
              <textarea
                id="category-services"
                value={formValues.services}
                onChange={(event) =>
                  setFormValues((current) => ({ ...current, services: event.target.value }))
                }
                rows={4}
                disabled={isSaving}
                placeholder={"e.g. Property inspection\nLand title search"}
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

    </div>
  );
}

export default Categories;
