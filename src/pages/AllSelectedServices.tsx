import axios from "axios";
import { type FormEvent, useEffect, useRef, useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  ImageIcon,
  Layers3,
  LoaderCircle,
  Mail,
  MessageCircle,
  Phone,
  Send,
  X,
} from "lucide-react";
import { Link, useSearchParams } from "react-router-dom";
import ServiceDetailsDialog from "./components/ServiceDetailsDialog";
import {
  fetchCategories,
  submitRequest,
  type HomeCategory,
} from "../apiservices/HomeService";
import type { AuthUser } from "../formtypes/AuthTypes";
import type {
  SubmitRequestData,
  SubmitRequestResponse,
} from "../formtypes/HomeTypes";

type ServiceRequest = {
  category: string;
  service: string;
};

type ServiceDetails = ServiceRequest & {
  categoryId: number;
};

const getStoredUser = (): AuthUser | null => {
  const token = localStorage.getItem("authToken");
  const storedUser = localStorage.getItem("authUser");

  if (!token || !storedUser) return null;

  try {
    return JSON.parse(storedUser) as AuthUser;
  } catch {
    return null;
  }
};

const ServiceImage = ({
  src,
  alt,
  className,
}: {
  src: string | null;
  alt: string;
  className: string;
}) => {
  const [failed, setFailed] = useState(false);

  if (!src || failed) {
    return (
      <span
        className={`${className} grid place-items-center bg-(--color-primary)/8 text-(--color-primary)`}
        aria-hidden="true"
      >
        <ImageIcon className="h-8 w-8" />
      </span>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      className={`${className} object-cover`}
      onError={() => setFailed(true)}
    />
  );
};

function AllSelectedServices() {
  const [searchParams] = useSearchParams();
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [selectedRequest, setSelectedRequest] = useState<ServiceRequest | null>(null);
  const [serviceDetails, setServiceDetails] = useState<ServiceDetails | null>(null);
  const [messageSubmitted, setMessageSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionError, setSubmissionError] = useState<string | null>(null);
  const [categories, setCategories] = useState<HomeCategory[]>([]);
  const [categoriesLoading, setCategoriesLoading] = useState(true);
  const [categoriesError, setCategoriesError] = useState<string | null>(null);
  const [authenticatedUser, setAuthenticatedUser] = useState<AuthUser | null>(
    getStoredUser,
  );
  const categoryName = searchParams.get("category");
  const highlightedService = searchParams.get("service");
  const searchQuery = searchParams.get("search")?.trim() ?? "";
  const normalizedSearchQuery = searchQuery.toLowerCase();
  const selectedCategory = categories.find(
    ({ id, name }) =>
      String(id) === categoryName ||
      name.toLowerCase() === categoryName?.toLowerCase(),
  );

  useEffect(() => {
    const syncAuthenticatedUser = () => setAuthenticatedUser(getStoredUser());

    window.addEventListener("auth-changed", syncAuthenticatedUser);
    window.addEventListener("storage", syncAuthenticatedUser);

    return () => {
      window.removeEventListener("auth-changed", syncAuthenticatedUser);
      window.removeEventListener("storage", syncAuthenticatedUser);
    };
  }, []);

  useEffect(() => {
    let isCurrent = true;

    const loadCategories = async () => {
      try {
        const result = await fetchCategories();

        if (!result.success) {
          throw new Error(result.message || "Unable to load services.");
        }

        if (isCurrent) setCategories(result.categories);
      } catch (error) {
        if (isCurrent) {
          setCategoriesError(
            error instanceof Error ? error.message : "Unable to load services.",
          );
        }
      } finally {
        if (isCurrent) setCategoriesLoading(false);
      }
    };

    void loadCategories();

    return () => {
      isCurrent = false;
    };
  }, []);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    if (selectedRequest && !dialog.open) dialog.showModal();
    if (!selectedRequest && dialog.open) dialog.close();
  }, [selectedRequest]);

  const closeRequestDialog = () => {
    dialogRef.current?.close();
    setSelectedRequest(null);
    setMessageSubmitted(false);
    setSubmissionError(null);
  };

  const requestMessage = selectedRequest
    ? `Hello Alfred, I would like help with ${selectedRequest.service} under ${selectedRequest.category}.`
    : "";

  const handleSubmitRequest = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitting(true);
    setSubmissionError(null);

    const fields = new FormData(event.currentTarget);
    const requestData: SubmitRequestData = {
      subject: String(fields.get("subject") ?? "").trim(),
      description: String(fields.get("description") ?? "").trim(),
    };

    if (authenticatedUser) {
      const userId = Number(authenticatedUser.id);
      if (Number.isInteger(userId)) requestData.user_id = userId;
    } else {
      requestData.name = String(fields.get("name") ?? "").trim();
      requestData.email = String(fields.get("email") ?? "").trim();
      requestData.phone = String(fields.get("phone") ?? "").trim();
      requestData.address = String(fields.get("address") ?? "").trim();
    }

    try {
      const result = await submitRequest(requestData);

      if (!result.success) {
        throw new Error(result.message || "Unable to submit your request.");
      }

      setMessageSubmitted(true);
    } catch (requestError) {
      if (axios.isAxiosError<SubmitRequestResponse>(requestError)) {
        setSubmissionError(
          requestError.response?.data?.message ||
            "Unable to submit your request. Please try again.",
        );
      } else {
        setSubmissionError(
          requestError instanceof Error
            ? requestError.message
            : "Unable to submit your request. Please try again.",
        );
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  if (categoriesLoading) {
    return (
      <main className="grid min-h-[60vh] place-items-center bg-(--color-background) px-4 text-(--color-ink)">
        <div className="text-center" role="status">
          <LoaderCircle className="mx-auto h-9 w-9 animate-spin text-(--color-primary)" />
          <p className="mt-4 font-bold text-(--color-muted)">Loading services...</p>
        </div>
      </main>
    );
  }

  if (categoriesError) {
    return (
      <main className="min-h-[60vh] bg-(--color-background) px-4 py-16 text-(--color-ink) sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl rounded-(--radius-medium) border border-(--color-border) bg-(--color-surface) p-8 text-center shadow-sm">
          <Layers3 className="mx-auto h-12 w-12 text-(--color-primary)" />
          <h1 className="mt-5 text-3xl font-black">Services are unavailable</h1>
          <p className="mt-3 text-(--color-muted)">{categoriesError}</p>
          <button
            type="button"
            onClick={() => window.location.reload()}
            className="mt-7 rounded-(--radius-small) bg-(--color-primary) px-5 py-3 font-bold text-white transition hover:bg-(--color-primary-dark)"
          >
            Try again
          </button>
        </div>
      </main>
    );
  }

  if (categoryName && !selectedCategory) {
    return (
      <main className="min-h-[60vh] bg-(--color-background) px-4 py-16 text-(--color-ink) sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl rounded-(--radius-medium) border border-(--color-border) bg-(--color-surface) p-8 text-center shadow-sm">
          <Layers3 className="mx-auto h-12 w-12 text-(--color-primary)" />
          <h1 className="mt-5 text-3xl font-black">
            Service category not found
          </h1>
          <p className="mt-3 text-(--color-muted)">
            That category may have moved. Browse the available services instead.
          </p>
          <Link
            to="/services"
            className="mt-7 inline-flex items-center gap-2 rounded-(--radius-small) bg-(--color-primary) px-5 py-3 font-bold text-white transition hover:bg-(--color-primary-dark)"
          >
            View all services <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </main>
    );
  }

  const visibleCategories = (selectedCategory ? [selectedCategory] : categories)
    .map((category) => {
      if (!normalizedSearchQuery) return category;

      const matchingServices = category.services?.filter((service) =>
        service.toLowerCase().includes(normalizedSearchQuery),
      );
      const categoryMatches = `${category.name} ${category.description ?? ""}`
        .toLowerCase()
        .includes(normalizedSearchQuery);

      if (!categoryMatches && !matchingServices?.length) return null;

      return categoryMatches
        ? category
        : { ...category, services: matchingServices };
    })
    .filter((category): category is HomeCategory => category !== null);

  return (
    <main className="min-h-screen bg-(--color-background) text-(--color-ink)">
      <section className="bg-(--color-primary-dark) px-4 py-8 text-white sm:px-6 lg:px-8 lg:py-12">
        <div className="mx-auto max-w-7xl">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-sm font-bold text-white/70 transition hover:text-white"
          >
            <ArrowLeft className="h-4 w-4" /> Back to home
          </Link>
          <p className="mt-8 text-sm font-extrabold uppercase tracking-[0.16em] text-(--color-secondary)">
            Msaidizi Diaspora services
          </p>
          <h1 className="mt-3 text-4xl font-black tracking-tight sm:text-5xl">
            {selectedCategory?.name ??
              (searchQuery ? "Search results" : "All services")}
          </h1>
          <p className="mt-4 max-w-2xl leading-7 text-white/75">
            {searchQuery
              ? `Showing services matching "${searchQuery}".`
              : selectedCategory
                ? selectedCategory.description ||
                  `Explore the support available under ${selectedCategory.name.toLowerCase()} and choose the service that fits your request.`
                : "Explore all the practical services available to help you handle important matters across Kenya."}
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
        <nav
          className="flex gap-2 overflow-x-auto pb-3"
          aria-label="Filter service categories"
        >
          <Link
            to="/services"
            className={`shrink-0 rounded-full px-4 py-2 text-sm font-bold transition ${
              !selectedCategory
                ? "bg-(--color-primary) text-white"
                : "border border-(--color-border) bg-(--color-surface) hover:border-(--color-primary) hover:text-(--color-primary)"
            }`}
          >
            All services
          </Link>
          {categories.map(({ id, name }) => (
            <Link
              key={id}
              to={`/services?category=${id}`}
              className={`shrink-0 rounded-full px-4 py-2 text-sm font-bold transition ${
                selectedCategory?.id === id
                  ? "bg-(--color-primary) text-white"
                  : "border border-(--color-border) bg-(--color-surface) hover:border-(--color-primary) hover:text-(--color-primary)"
              }`}
            >
              {name}
            </Link>
          ))}
        </nav>

        {searchQuery && visibleCategories.length === 0 ? (
          <div className="mt-9 rounded-(--radius-medium) border border-dashed border-(--color-border) bg-(--color-surface) px-6 py-12 text-center">
            <h2 className="text-xl font-black">No matching services found</h2>
            <p className="mt-2 text-sm text-(--color-muted)">
              Try a different service or category name.
            </p>
            <Link
              to="/services"
              className="mt-5 inline-flex rounded-(--radius-small) bg-(--color-primary) px-5 py-3 text-sm font-bold text-white transition hover:bg-(--color-primary-dark)"
            >
              Browse all services
            </Link>
          </div>
        ) : (
          <div className="mt-9 space-y-12">
            {visibleCategories.map((category) => (
              <section
                key={category.id}
                aria-labelledby={`category-${category.id}`}
              >
                {!selectedCategory && (
                  <div className="mb-5 flex items-end justify-between gap-4 border-b border-(--color-border) pb-4">
                    <div>
                      <h2
                        id={`category-${category.id}`}
                        className="text-2xl font-black"
                      >
                        {category.name}
                      </h2>
                      {category.description && (
                        <p className="mt-2 max-w-3xl text-sm leading-6 text-(--color-muted)">
                          {category.description}
                        </p>
                      )}
                    </div>
                    <Link
                      to={`/services?category=${category.id}`}
                      className="shrink-0 text-sm font-extrabold text-(--color-primary) hover:underline"
                    >
                      View category
                    </Link>
                  </div>
                )}

                {category.services?.length ? (
                  <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
                    {category.services.map((service, index) => {
                      const isHighlighted =
                        service.toLowerCase() ===
                        highlightedService?.toLowerCase();

                      return (
                        <article
                          key={`${service}-${index}`}
                          className={`flex min-h-80 flex-col overflow-hidden rounded-(--radius-medium) border bg-(--color-surface) shadow-sm transition hover:-translate-y-1 hover:shadow-(--shadow-soft) ${
                            isHighlighted
                              ? "border-(--color-primary) ring-2 ring-(--color-primary)/15"
                              : "border-(--color-border)"
                          }`}
                        >
                          <ServiceImage
                            src={category.image}
                            alt={category.name}
                            className="aspect-video w-full"
                          />
                          <div className="flex flex-1 flex-col p-6">
                            <h3 className="text-lg font-extrabold">{service}</h3>
                            <div className="mt-auto flex items-center justify-between gap-3 pt-6">
                              <button
                                type="button"
                                onClick={() =>
                                  setServiceDetails({
                                    category: category.name,
                                    service,
                                    categoryId: category.id,
                                  })
                                }
                                className="rounded-full border border-(--color-primary)/30 px-3 py-1.5 text-xs font-extrabold text-(--color-primary) transition hover:bg-(--color-primary) hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(--color-primary)"
                              >
                                Details
                              </button>
                              <button
                                type="button"
                                onClick={() => {
                                  setMessageSubmitted(false);
                                  setSubmissionError(null);
                                  setSelectedRequest({
                                    category: category.name,
                                    service,
                                  });
                                }}
                                className="inline-flex items-center gap-2 text-sm font-extrabold text-(--color-primary) hover:underline"
                              >
                                Request this service <ArrowRight className="h-4 w-4" />
                              </button>
                            </div>
                          </div>
                        </article>
                      );
                    })}
                  </div>
                ) : (
                  <div className="rounded-(--radius-medium) border border-dashed border-(--color-border) bg-(--color-surface) px-6 py-12 text-center text-(--color-muted)">
                    No services have been added to this category yet.
                  </div>
                )}
              </section>
            ))}
          </div>
        )}
      </section>

      {serviceDetails && (
        <ServiceDetailsDialog
          category={serviceDetails.category}
          service={serviceDetails.service}
          requestHref={`/services/${serviceDetails.categoryId}?service=${encodeURIComponent(serviceDetails.service)}`}
          onClose={() => setServiceDetails(null)}
        />
      )}
      <dialog
        ref={dialogRef}
        onClose={() => {
          setSelectedRequest(null);
          setMessageSubmitted(false);
          setSubmissionError(null);
        }}
        onClick={(event) => {
          if (event.target === event.currentTarget) closeRequestDialog();
        }}
        aria-labelledby="request-dialog-title"
        className="m-auto max-h-[90vh] w-[calc(100%-2rem)] max-w-xl overflow-y-auto rounded-(--radius-medium) border border-(--color-border) bg-(--color-surface) p-0 text-(--color-ink) shadow-2xl backdrop:bg-(--color-primary-dark)/70 backdrop:backdrop-blur-sm"
      >
        {selectedRequest && (
          <div>
            <div className="flex items-start justify-between gap-5 border-b border-(--color-border) px-6 py-5">
              <div>
                <p className="text-xs font-extrabold uppercase tracking-[0.14em] text-(--color-primary)">
                  {selectedRequest.category}
                </p>
                <h2 id="request-dialog-title" className="mt-1 text-2xl font-black">
                  {selectedRequest.service}
                </h2>
              </div>
              <button
                type="button"
                onClick={closeRequestDialog}
                aria-label="Close request dialog"
                className="grid h-10 w-10 shrink-0 place-items-center rounded-full text-(--color-muted) transition hover:bg-(--color-background) hover:text-(--color-ink) focus-visible:outline-2 focus-visible:outline-(--color-primary)"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="px-6 py-6">
              <div className="flex items-center gap-3">
                <img
                  src="/diaspora/images/alf.jpeg"
                  alt="Alfred"
                  className="h-16 w-16 shrink-0 rounded-full border-2 border-(--color-primary)/15 object-cover object-top"
                />
                <div>
                  <h3 className="font-extrabold">Talk to Alfred</h3>
                  <p className="text-sm text-(--color-muted)">Choose how you would like to connect.</p>
                </div>
              </div>

              <div className="mt-5 grid gap-3 sm:grid-cols-3">
                <a
                  href={`https://wa.me/254720554657?text=${encodeURIComponent(requestMessage)}`}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center justify-center gap-2 rounded-(--radius-small) bg-[#25D366]/12 px-4 py-3 font-bold text-[#128C4A] transition hover:bg-[#25D366] hover:text-white"
                >
                  <MessageCircle className="h-5 w-5" /> WhatsApp
                </a>
                <a
                  href="tel:+254720554657"
                  className="flex items-center justify-center gap-2 rounded-(--radius-small) bg-(--color-primary)/10 px-4 py-3 font-bold text-(--color-primary) transition hover:bg-(--color-primary) hover:text-white"
                >
                  <Phone className="h-5 w-5" /> Call
                </a>
                <a
                  href={`mailto:support@msaidizidiaspora.co.ke?subject=${encodeURIComponent(`Service request: ${selectedRequest.service}`)}&body=${encodeURIComponent(requestMessage)}`}
                  className="flex items-center justify-center gap-2 rounded-(--radius-small) bg-(--color-background) px-4 py-3 font-bold transition hover:text-(--color-primary)"
                >
                  <Mail className="h-5 w-5" /> Email
                </a>
              </div>

              <div className="my-6 flex items-center gap-4" aria-hidden="true">
                <span className="h-px flex-1 bg-(--color-border)" />
                <span className="text-xs font-bold uppercase tracking-wider text-(--color-muted)">or send a message</span>
                <span className="h-px flex-1 bg-(--color-border)" />
              </div>

              {messageSubmitted ? (
                <div className="rounded-(--radius-small) bg-emerald-50 p-5 text-center text-emerald-800">
                  <CheckCircle2 className="mx-auto h-7 w-7" />
                  <p className="mt-2 font-extrabold">Your request has been submitted.</p>
                  <p className="mt-1 text-sm">Alfred will get back to you shortly.</p>
                </div>
              ) : (
                <form
                  onSubmit={handleSubmitRequest}
                >
                  {submissionError && (
                    <div
                      role="alert"
                      className="mb-4 rounded-(--radius-small) bg-red-50 px-4 py-3 text-sm font-semibold text-red-700"
                    >
                      {submissionError}
                    </div>
                  )}
                  {!authenticatedUser && (
                    <div className="mb-4 grid gap-4 sm:grid-cols-2">
                      <div className="sm:col-span-2">
                        <label
                          htmlFor="service-request-name"
                          className="text-sm font-extrabold"
                        >
                          Name
                        </label>
                        <input
                          id="service-request-name"
                          name="name"
                          type="text"
                          autoComplete="name"
                          required
                          className="mt-2 w-full rounded-(--radius-small) border border-(--color-border) bg-(--color-background) px-4 py-3 text-sm outline-none transition focus:border-(--color-primary) focus:ring-2 focus:ring-(--color-primary)/15"
                        />
                      </div>
                      <div>
                        <label
                          htmlFor="service-request-email"
                          className="text-sm font-extrabold"
                        >
                          Email
                        </label>
                        <input
                          id="service-request-email"
                          name="email"
                          type="email"
                          autoComplete="email"
                          required
                          className="mt-2 w-full rounded-(--radius-small) border border-(--color-border) bg-(--color-background) px-4 py-3 text-sm outline-none transition focus:border-(--color-primary) focus:ring-2 focus:ring-(--color-primary)/15"
                        />
                      </div>
                      <div>
                        <label
                          htmlFor="service-request-phone"
                          className="text-sm font-extrabold"
                        >
                          Phone
                        </label>
                        <input
                          id="service-request-phone"
                          name="phone"
                          type="tel"
                          autoComplete="tel"
                          required
                          className="mt-2 w-full rounded-(--radius-small) border border-(--color-border) bg-(--color-background) px-4 py-3 text-sm outline-none transition focus:border-(--color-primary) focus:ring-2 focus:ring-(--color-primary)/15"
                        />
                      </div>
                      <div className="sm:col-span-2">
                        <label
                          htmlFor="service-request-address"
                          className="text-sm font-extrabold"
                        >
                          Address
                        </label>
                        <input
                          id="service-request-address"
                          name="address"
                          type="text"
                          autoComplete="street-address"
                          required
                          className="mt-2 w-full rounded-(--radius-small) border border-(--color-border) bg-(--color-background) px-4 py-3 text-sm outline-none transition focus:border-(--color-primary) focus:ring-2 focus:ring-(--color-primary)/15"
                        />
                      </div>
                    </div>
                  )}

                  <label
                    htmlFor="service-request-subject"
                    className="text-sm font-extrabold"
                  >
                    Subject
                  </label>
                  <input
                    key={selectedRequest.service}
                    id="service-request-subject"
                    name="subject"
                    type="text"
                    required
                    defaultValue={selectedRequest.service}
                    className="mt-2 mb-4 w-full rounded-(--radius-small) border border-(--color-border) bg-(--color-background) px-4 py-3 text-sm outline-none transition focus:border-(--color-primary) focus:ring-2 focus:ring-(--color-primary)/15"
                  />

                  <label htmlFor="service-request-message" className="text-sm font-extrabold">
                    Tell Alfred what you need
                  </label>
                  <textarea
                    id="service-request-message"
                    name="description"
                    required
                    rows={4}
                    placeholder={`Add details about your ${selectedRequest.service.toLowerCase()} request...`}
                    className="mt-2 w-full resize-y rounded-(--radius-small) border border-(--color-border) bg-(--color-background) px-4 py-3 text-sm outline-none transition placeholder:text-(--color-muted) focus:border-(--color-primary) focus:ring-2 focus:ring-(--color-primary)/15"
                  />
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="mt-3 inline-flex w-full items-center justify-center gap-2 rounded-(--radius-small) bg-(--color-primary) px-5 py-3 font-extrabold text-white transition hover:bg-(--color-primary-dark) focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(--color-primary) disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {isSubmitting ? "Submitting..." : "Submit request"}
                    {!isSubmitting && <Send className="h-4 w-4" />}
                  </button>
                </form>
              )}
            </div>
          </div>
        )}
      </dialog>
    </main>
  );
}

export default AllSelectedServices;
