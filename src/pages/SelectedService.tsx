import axios from "axios";
import { type FormEvent, useEffect, useState } from "react";
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
} from "lucide-react";
import { Link, useParams } from "react-router-dom";
import {
  fetchCategories,
  submitRequest,
  type HomeCategory,
  type HomeSubCategory,
} from "../apiservices/HomeService";
import type { AuthUser } from "../formtypes/AuthTypes";
import type {
  SubmitRequestData,
  SubmitRequestResponse,
} from "../formtypes/HomeTypes";

type SelectedServiceData = {
  category: HomeCategory;
  service: HomeSubCategory;
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

function SelectedService() {
  const { categoryId, serviceId } = useParams();
  const [selectedService, setSelectedService] =
    useState<SelectedServiceData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [imageFailed, setImageFailed] = useState(false);
  const [messageSubmitted, setMessageSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionError, setSubmissionError] = useState<string | null>(null);
  const [authenticatedUser, setAuthenticatedUser] = useState<AuthUser | null>(
    getStoredUser,
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

    const loadSelectedService = async () => {
      setLoading(true);
      setError(null);
      setImageFailed(false);
      setMessageSubmitted(false);
      setSubmissionError(null);

      try {
        const result = await fetchCategories();

        if (!result.success) {
          throw new Error(result.message || "Unable to load this service.");
        }

        const category = result.categories.find(
          ({ id }) => String(id) === categoryId,
        );
        const service = category?.sub_categories.find(
          ({ id }) => String(id) === serviceId,
        );

        if (!category || !service) {
          throw new Error("The selected service could not be found.");
        }

        if (isCurrent) setSelectedService({ category, service });
      } catch (loadError) {
        if (isCurrent) {
          setError(
            loadError instanceof Error
              ? loadError.message
              : "Unable to load this service.",
          );
        }
      } finally {
        if (isCurrent) setLoading(false);
      }
    };

    void loadSelectedService();

    return () => {
      isCurrent = false;
    };
  }, [categoryId, serviceId]);

  if (loading) {
    return (
      <main className="grid min-h-[60vh] place-items-center bg-(--color-background) px-4 text-(--color-ink)">
        <div className="text-center" role="status">
          <LoaderCircle className="mx-auto h-9 w-9 animate-spin text-(--color-primary)" />
          <p className="mt-4 font-bold text-(--color-muted)">
            Loading service...
          </p>
        </div>
      </main>
    );
  }

  if (error || !selectedService) {
    return (
      <main className="min-h-[60vh] bg-(--color-background) px-4 py-16 text-(--color-ink) sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl rounded-(--radius-medium) border border-(--color-border) bg-(--color-surface) p-8 text-center shadow-sm">
          <Layers3 className="mx-auto h-12 w-12 text-(--color-primary)" />
          <h1 className="mt-5 text-3xl font-black">Service not found</h1>
          <p className="mt-3 text-(--color-muted)">
            {error || "The selected service could not be found."}
          </p>
          <Link
            to="/services"
            className="mt-7 inline-flex items-center gap-2 rounded-(--radius-small) bg-(--color-primary) px-5 py-3 font-bold text-white transition hover:bg-(--color-primary-dark)"
          >
            Browse all services <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </main>
    );
  }

  const { category, service } = selectedService;
  const requestMessage = `Hello Alfred, I would like help with ${service.name} under ${category.name}.`;

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

  return (
    <main className="min-h-screen bg-(--color-background) px-4 py-8 text-(--color-ink) sm:px-6 lg:px-8 lg:py-10">
      <div className="mx-auto grid max-w-6xl items-start gap-6 lg:grid-cols-[minmax(0,1.25fr)_minmax(340px,0.85fr)]">
        <article className="overflow-hidden rounded-(--radius-medium) border border-(--color-border) bg-(--color-surface) shadow-(--shadow-soft)">
          {service.image && !imageFailed ? (
            <img
              src={service.image}
              alt={service.name}
              onError={() => setImageFailed(true)}
              className="h-64 w-full object-cover sm:h-72 lg:h-80"
            />
          ) : (
            <div className="grid h-64 place-items-center bg-(--color-primary)/8 text-(--color-primary) sm:h-72 lg:h-80">
              <ImageIcon className="h-14 w-14" aria-hidden="true" />
            </div>
          )}

          <div className="p-6 sm:p-8">
            <Link
              to={`/services?category=${category.id}`}
              className="inline-flex items-center gap-2 text-sm font-extrabold text-(--color-primary) hover:underline"
            >
              <ArrowLeft className="h-4 w-4" /> Back to {category.name}
            </Link>

            <p className="mt-6 text-sm font-extrabold uppercase tracking-[0.16em] text-(--color-primary)">
              {category.name}
            </p>
            <h1 className="mt-2 text-3xl font-black tracking-tight sm:text-4xl">
              {service.name}
            </h1>
            <p className="mt-4 max-w-3xl text-base leading-7 text-(--color-muted)">
              {service.description ||
                "Get dependable local assistance, clear updates, and support from request to completion."}
            </p>
          </div>
        </article>

        <aside className="rounded-(--radius-medium) border border-(--color-border) bg-(--color-surface) shadow-(--shadow-soft) lg:sticky lg:top-6">
          <div className="border-b border-(--color-border) px-6 py-5">
            <p className="text-xs font-extrabold uppercase tracking-[0.14em] text-(--color-primary)">
              {category.name}
            </p>
            <h2 className="mt-1 text-xl font-black">{service.name}</h2>
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
                <p className="text-sm text-(--color-muted)">
                  Choose how you would like to connect.
                </p>
              </div>
            </div>

            <div className="mt-5 grid gap-3 sm:grid-cols-3 lg:grid-cols-1 xl:grid-cols-3">
              <a
                href={`https://wa.me/254720554657?text=${encodeURIComponent(requestMessage)}`}
                target="_blank"
                rel="noreferrer"
                className="flex items-center justify-center gap-2 rounded-(--radius-small) bg-[#25D366]/12 px-4 py-3 text-sm font-bold text-[#128C4A] transition hover:bg-[#25D366] hover:text-white"
              >
                <MessageCircle className="h-5 w-5" /> WhatsApp
              </a>
              <a
                href="tel:+254720554657"
                className="flex items-center justify-center gap-2 rounded-(--radius-small) bg-(--color-primary)/10 px-4 py-3 text-sm font-bold text-(--color-primary) transition hover:bg-(--color-primary) hover:text-white"
              >
                <Phone className="h-5 w-5" /> Call
              </a>
              <a
                href={`mailto:support@diasporaconnect.co.ke?subject=${encodeURIComponent(`Service request: ${service.name}`)}&body=${encodeURIComponent(requestMessage)}`}
                className="flex items-center justify-center gap-2 rounded-(--radius-small) bg-(--color-background) px-4 py-3 text-sm font-bold transition hover:text-(--color-primary)"
              >
                <Mail className="h-5 w-5" /> Email
              </a>
            </div>

            <div className="my-6 flex items-center gap-4" aria-hidden="true">
              <span className="h-px flex-1 bg-(--color-border)" />
              <span className="text-xs font-bold uppercase tracking-wider text-(--color-muted)">
                or send a message
              </span>
              <span className="h-px flex-1 bg-(--color-border)" />
            </div>

            {messageSubmitted ? (
              <div className="rounded-(--radius-small) bg-emerald-50 p-5 text-center text-emerald-800">
                <CheckCircle2 className="mx-auto h-7 w-7" />
                <p className="mt-2 font-extrabold">
                  Your request has been submitted.
                </p>
                <p className="mt-1 text-sm">
                  Alfred will get back to you shortly.
                </p>
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
                  <div className="mb-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
                    <div className="sm:col-span-2 lg:col-span-1 xl:col-span-2">
                      <label
                        htmlFor="selected-service-name"
                        className="text-sm font-extrabold"
                      >
                        Name
                      </label>
                      <input
                        id="selected-service-name"
                        name="name"
                        type="text"
                        autoComplete="name"
                        required
                        className="mt-2 w-full rounded-(--radius-small) border border-(--color-border) bg-(--color-background) px-4 py-3 text-sm outline-none transition focus:border-(--color-primary) focus:ring-2 focus:ring-(--color-primary)/15"
                      />
                    </div>
                    <div>
                      <label
                        htmlFor="selected-service-email"
                        className="text-sm font-extrabold"
                      >
                        Email
                      </label>
                      <input
                        id="selected-service-email"
                        name="email"
                        type="email"
                        autoComplete="email"
                        required
                        className="mt-2 w-full rounded-(--radius-small) border border-(--color-border) bg-(--color-background) px-4 py-3 text-sm outline-none transition focus:border-(--color-primary) focus:ring-2 focus:ring-(--color-primary)/15"
                      />
                    </div>
                    <div>
                      <label
                        htmlFor="selected-service-phone"
                        className="text-sm font-extrabold"
                      >
                        Phone
                      </label>
                      <input
                        id="selected-service-phone"
                        name="phone"
                        type="tel"
                        autoComplete="tel"
                        required
                        className="mt-2 w-full rounded-(--radius-small) border border-(--color-border) bg-(--color-background) px-4 py-3 text-sm outline-none transition focus:border-(--color-primary) focus:ring-2 focus:ring-(--color-primary)/15"
                      />
                    </div>
                    <div className="sm:col-span-2 lg:col-span-1 xl:col-span-2">
                      <label
                        htmlFor="selected-service-address"
                        className="text-sm font-extrabold"
                      >
                        Address
                      </label>
                      <input
                        id="selected-service-address"
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
                  htmlFor="selected-service-subject"
                  className="text-sm font-extrabold"
                >
                  Subject
                </label>
                <input
                  key={service.id}
                  id="selected-service-subject"
                  name="subject"
                  type="text"
                  required
                  defaultValue={service.name}
                  className="mt-2 mb-4 w-full rounded-(--radius-small) border border-(--color-border) bg-(--color-background) px-4 py-3 text-sm outline-none transition focus:border-(--color-primary) focus:ring-2 focus:ring-(--color-primary)/15"
                />

                <label
                  htmlFor="selected-service-message"
                  className="text-sm font-extrabold"
                >
                  Tell Alfred what you need
                </label>
                <textarea
                  id="selected-service-message"
                  name="description"
                  required
                  rows={5}
                  placeholder={`Add details about your ${service.name.toLowerCase()} request...`}
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
        </aside>
      </div>
    </main>
  );
}

export default SelectedService;
