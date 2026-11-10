import axios from "axios";
import {
  AlertCircle,
  CalendarDays,
  Clock3,
  Eye,
  FileText,
  Mail,
  MapPin,
  Pencil,
  Phone,
  X,
} from "lucide-react";
import { type FormEvent, useCallback, useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { getAccount, updateAccount } from "../apiservices/AccountService";
import type {
  AccountResponse,
  AccountUser,
  UpdateAccountData,
} from "../formtypes/AccountTypes";
import type { ApiErrorResponse } from "../formtypes/AuthTypes";
import Pagination from "./components/Pagination";

const REQUESTS_PER_PAGE = 5;

const formatDate = (value?: string | null) => {
  if (!value) return null;

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return null;

  return new Intl.DateTimeFormat("en-KE", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(date);
};

const formatDateTime = (value?: string | null) => {
  if (!value) return null;

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return null;

  return new Intl.DateTimeFormat("en-KE", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(date);
};

function AccountSkeleton() {
  return (
    <main className="min-h-screen bg-white px-4 py-10 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl animate-pulse">
        <div className="h-8 w-52 rounded bg-(--color-border)" />
        <div className="mt-3 h-4 w-80 max-w-full rounded bg-(--color-border)" />
        <div className="mt-8 grid gap-6 lg:grid-cols-[20rem_1fr]">
          <div className="h-80 rounded-(--radius-medium) bg-(--color-surface)" />
          <div className="space-y-4">
            {[1, 2, 3].map((item) => (
              <div key={item} className="h-36 rounded-(--radius-medium) bg-(--color-surface)" />
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}

export default function Account() {
  const profileDialog = useRef<HTMLDialogElement>(null);
  const [user, setUser] = useState<AccountUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [updateError, setUpdateError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);

  const loadAccount = useCallback(async () => {
    try {
      const response = await getAccount();
      setUser({ ...response.user, requests: response.user.requests ?? [] });
      localStorage.setItem("authUser", JSON.stringify(response.user));
      window.dispatchEvent(new Event("auth-changed"));
    } catch (requestError) {
      if (axios.isAxiosError<ApiErrorResponse>(requestError)) {
        setError(
          requestError.response?.data?.message ??
            "We could not load your account. Please try again.",
        );
      } else {
        setError("We could not load your account. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    // oxlint-disable-next-line react/set-state-in-effect
    void loadAccount();
  }, [loadAccount]);

  const openProfileDialog = () => {
    setUpdateError(null);
    profileDialog.current?.showModal();
  };

  const handleProfileUpdate = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!user) return;

    const fields = new FormData(event.currentTarget);
    setIsUpdating(true);
    setUpdateError(null);

    try {
      const formData: UpdateAccountData = {
        name: String(fields.get("name") ?? "").trim(),
        email: String(fields.get("email") ?? "").trim(),
        phone: String(fields.get("phone") ?? "").trim(),
        address: String(fields.get("address") ?? "").trim(),
      };
      const response: AccountResponse = await updateAccount(formData);
      const updatedUser = {
        ...user,
        ...response.user,
        requests: response.user.requests ?? user.requests,
      };

      setUser(updatedUser);
      localStorage.setItem("authUser", JSON.stringify(updatedUser));
      window.dispatchEvent(new Event("auth-changed"));
      profileDialog.current?.close();
      toast.success(response.message ?? "Profile updated successfully");
    } catch (requestError) {
      if (axios.isAxiosError<ApiErrorResponse>(requestError)) {
        setUpdateError(
          requestError.response?.data?.message ??
            "We could not update your profile. Please try again.",
        );
      } else {
        setUpdateError("We could not update your profile. Please try again.");
      }
    } finally {
      setIsUpdating(false);
    }
  };

  if (isLoading) return <AccountSkeleton />;

  if (error || !user) {
    return (
      <main className="grid min-h-[60vh] place-items-center bg-white px-4 py-16 text-(--color-ink)">
        <section className="w-full max-w-lg rounded-(--radius-medium) border border-(--color-border) bg-(--color-surface) p-8 text-center shadow-(--shadow-soft)">
          <span className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-red-50 text-red-600">
            <AlertCircle className="h-7 w-7" />
          </span>
          <h1 className="mt-5 text-2xl font-black">Unable to load your account</h1>
          <p className="mt-2 text-sm leading-6 text-(--color-muted)">{error}</p>
        </section>
      </main>
    );
  }

  const requests = user.requests;
  const memberSince = formatDate(user.created_at);
  const totalPages = Math.ceil(requests.length / REQUESTS_PER_PAGE);
  const firstRequestIndex = (currentPage - 1) * REQUESTS_PER_PAGE;
  const paginatedRequests = requests.slice(
    firstRequestIndex,
    firstRequestIndex + REQUESTS_PER_PAGE,
  );

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    document.getElementById("requests-heading")?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };

  return (
    <main className="min-h-screen bg-white px-4 py-10 text-(--color-ink) sm:px-6 lg:px-8 lg:py-14">
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm font-extrabold uppercase tracking-[0.14em] text-(--color-primary)">
              My account
            </p>
            <h1 className="mt-2 text-3xl font-black tracking-tight sm:text-4xl">
              Welcome back, {user.name.split(" ")[0]}
            </h1>
            <p className="mt-2 text-(--color-muted)">
              View your details and follow every service request in one place.
            </p>
          </div>
          
        </div>

        <div className="mt-8 grid items-start gap-6 lg:grid-cols-[20rem_minmax(0,1fr)]">
          <aside className="overflow-hidden rounded-(--radius-medium) border border-(--color-border) bg-(--color-surface) shadow-(--shadow-soft)">
            <div className="bg-[linear-gradient(135deg,var(--color-primary-dark),var(--color-primary))] p-6 text-white">
              <span className="grid h-16 w-16 place-items-center rounded-full bg-white/15 text-2xl font-black uppercase ring-1 ring-white/25">
                {user.name.charAt(0)}
              </span>
              <h2 className="mt-4 truncate text-xl font-black">{user.name}</h2>
              {memberSince && (
                <p className="mt-1 text-xs font-semibold text-white/70">
                  Member since {memberSince}
                </p>
              )}
            </div>

            <div className="space-y-5 p-6">
              <div className="flex items-start gap-3">
                <Mail className="mt-0.5 h-4 w-4 shrink-0 text-(--color-primary)" />
                <div className="min-w-0">
                  <p className="text-xs font-bold uppercase tracking-wider text-(--color-muted)">Email</p>
                  <p className="mt-1 wrap-break-word text-sm font-semibold">{user.email}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Phone className="mt-0.5 h-4 w-4 shrink-0 text-(--color-primary)" />
                <div>
                  <p className="text-xs font-bold uppercase tracking-wider text-(--color-muted)">Phone number</p>
                  <p className="mt-1 text-sm font-semibold">
                    {user.phone_number ?? "Not provided"}
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-(--color-primary)" />
                <div>
                  <p className="text-xs font-bold uppercase tracking-wider text-(--color-muted)">Address</p>
                  <p className="mt-1 text-sm font-semibold leading-5">
                    {user.address ?? "Not provided"}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={openProfileDialog}
                className="flex w-full items-center justify-center gap-2 rounded-(--radius-small) border border-(--color-primary) px-4 py-2.5 text-sm font-extrabold text-(--color-primary) transition hover:bg-(--color-primary) hover:text-white"
              >
                <Pencil className="h-4 w-4" /> Update profile
              </button>
            </div>

            <div className="border-t border-(--color-border)">
              <div className="p-4 text-center">
                <p className="text-2xl font-black text-(--color-primary)">{requests.length}</p>
                <p className="text-xs font-bold text-(--color-muted)">Total requests</p>
              </div>
            </div>
          </aside>

          <section aria-labelledby="requests-heading">
            <h2 id="requests-heading" className="text-2xl font-black">My requests</h2>
            <p className="mt-1 text-sm text-(--color-muted)">
              {requests.length === 1 ? "1 service request" : `${requests.length} service requests`}
            </p>

            {requests.length === 0 ? (
              <div className="mt-5 rounded-(--radius-medium) border border-dashed border-(--color-border) bg-(--color-surface) px-6 py-14 text-center">
                <span className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-(--color-primary)/10 text-(--color-primary)">
                  <FileText className="h-7 w-7" />
                </span>
                <h3 className="mt-5 text-lg font-black">No requests yet</h3>
                <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-(--color-muted)">
                  When you request a service, its progress and updates will appear here.
                </p>
                
              </div>
            ) : (
              <div className="mt-5 space-y-4">
                {paginatedRequests.map((request, index) => {
                  const createdAt = formatDateTime(request.created_at);
                  const updatedAt = formatDateTime(request.updated_at);

                  return (
                    <article
                      key={request.id ?? `${request.created_at}-${index}`}
                      className="rounded-(--radius-medium) border border-(--color-border) bg-(--color-surface) p-5 shadow-[0_5px_18px_rgba(30,58,138,0.06)] transition hover:border-(--color-primary)/40 sm:p-6"
                    >
                      <div className="flex min-w-0 flex-col gap-4 sm:flex-row">
                        <span className="grid h-11 w-11 shrink-0 place-items-center rounded-(--radius-small) bg-(--color-primary)/10 text-(--color-primary)">
                          <FileText className="h-5 w-5" />
                        </span>
                        <div className="min-w-0 flex-1">
                          <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                            <div className="min-w-0">
                              <p className="text-xs font-bold uppercase tracking-wider text-(--color-muted)">
                                Request #{request.id}
                              </p>
                              <h3 className="mt-1 text-lg font-black text-(--color-ink)">
                                {request.subject || "Service request"}
                              </h3>
                            </div>
                            <div className="flex shrink-0 flex-wrap gap-2">
                              <span className="rounded-full bg-(--color-primary)/10 px-3 py-1 text-xs font-extrabold text-(--color-primary)">
                                {request.is_completed || "Submitted"}
                              </span>
                              <span
                                className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-extrabold ${
                                  request.is_viewed
                                    ? "bg-slate-100 text-slate-600"
                                    : "bg-(--color-secondary)/25 text-amber-800"
                                }`}
                              >
                                <Eye className="h-3.5 w-3.5" />
                                {request.is_viewed ? "Viewed" : "Awaiting review"}
                              </span>
                            </div>
                          </div>

                          <div className="mt-4 rounded-(--radius-small) bg-white p-4 ring-1 ring-(--color-border)">
                            <p className="text-xs font-bold uppercase tracking-wider text-(--color-muted)">
                              Description
                            </p>
                            <p className="mt-1.5 whitespace-pre-wrap text-sm leading-6 text-(--color-ink)">
                              {request.request_description || "No description provided."}
                            </p>
                          </div>

                          <div className="mt-5 flex flex-wrap gap-x-5 gap-y-2 border-t border-(--color-border) pt-4 text-xs font-semibold text-(--color-muted)">
                            {createdAt && (
                              <span className="inline-flex items-center gap-1.5">
                                <CalendarDays className="h-3.5 w-3.5" /> Submitted {createdAt}
                              </span>
                            )}
                            {updatedAt && updatedAt !== createdAt && (
                              <span className="inline-flex items-center gap-1.5">
                                <Clock3 className="h-3.5 w-3.5" /> Updated {updatedAt}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </article>
                  );
                })}

                {totalPages > 1 && (
                  <div className="flex flex-col items-center gap-4 border-t border-(--color-border) pt-6">
                    <p className="text-sm font-semibold text-(--color-muted)">
                      Showing {firstRequestIndex + 1}–{Math.min(firstRequestIndex + REQUESTS_PER_PAGE, requests.length)} of {requests.length} requests
                    </p>
                    <Pagination
                      currentPage={currentPage}
                      totalPages={totalPages}
                      onPageChange={handlePageChange}
                    />
                  </div>
                )}
              </div>
            )}
          </section>
        </div>
      </div>

      <dialog
        ref={profileDialog}
        onClick={(event) => {
          if (event.target === event.currentTarget && !isUpdating) {
            event.currentTarget.close();
          }
        }}
        className="m-auto w-[calc(100%-2rem)] max-w-lg rounded-(--radius-medium) border border-(--color-border) bg-(--color-surface) p-0 text-(--color-ink) shadow-2xl backdrop:bg-(--color-primary-dark)/55 backdrop:backdrop-blur-sm"
        aria-labelledby="update-profile-heading"
      >
        <div className="flex items-start justify-between gap-4 border-b border-(--color-border) px-6 py-5">
          <div>
            <h2 id="update-profile-heading" className="text-xl font-black">
              Update profile
            </h2>
            <p className="mt-1 text-sm text-(--color-muted)">
              Keep your contact details up to date.
            </p>
          </div>
          <button
            type="button"
            onClick={() => profileDialog.current?.close()}
            disabled={isUpdating}
            className="grid h-9 w-9 shrink-0 place-items-center rounded-full text-(--color-muted) transition hover:bg-(--color-background) hover:text-(--color-ink) disabled:opacity-50"
            aria-label="Close update profile dialog"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleProfileUpdate} className="space-y-5 p-6">
          <div>
            <label htmlFor="profile-name" className="text-sm font-bold">Full name</label>
            <input
              id="profile-name"
              name="name"
              type="text"
              defaultValue={user.name}
              required
              autoComplete="name"
              className="mt-2 w-full rounded-(--radius-small) border border-(--color-border) bg-(--color-background) px-4 py-3 text-sm outline-none focus:border-(--color-primary) focus:ring-2 focus:ring-(--color-primary)/15"
            />
          </div>
          <div>
            <label htmlFor="profile-email" className="text-sm font-bold">Email address</label>
            <input
              id="profile-email"
              name="email"
              type="email"
              defaultValue={user.email}
              required
              autoComplete="email"
              className="mt-2 w-full rounded-(--radius-small) border border-(--color-border) bg-(--color-background) px-4 py-3 text-sm outline-none focus:border-(--color-primary) focus:ring-2 focus:ring-(--color-primary)/15"
            />
          </div>
          <div>
            <label htmlFor="profile-phone" className="text-sm font-bold">Phone number</label>
            <input
              id="profile-phone"
              name="phone"
              type="tel"
              defaultValue={user.phone_number ?? ""}
              required
              autoComplete="tel"
              placeholder="+254 700 000 000"
              className="mt-2 w-full rounded-(--radius-small) border border-(--color-border) bg-(--color-background) px-4 py-3 text-sm outline-none focus:border-(--color-primary) focus:ring-2 focus:ring-(--color-primary)/15"
            />
          </div>
          <div>
            <label htmlFor="profile-address" className="text-sm font-bold">Address</label>
            <textarea
              id="profile-address"
              name="address"
              defaultValue={user.address ?? ""}
              required
              rows={3}
              autoComplete="street-address"
              placeholder="Street, city, and country"
              className="mt-2 w-full resize-none rounded-(--radius-small) border border-(--color-border) bg-(--color-background) px-4 py-3 text-sm outline-none focus:border-(--color-primary) focus:ring-2 focus:ring-(--color-primary)/15"
            />
          </div>

          {updateError && (
            <p role="alert" className="rounded-(--radius-small) bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">
              {updateError}
            </p>
          )}

          <div className="flex flex-col-reverse gap-3 border-t border-(--color-border) pt-5 sm:flex-row sm:justify-end">
            <button
              type="button"
              onClick={() => profileDialog.current?.close()}
              disabled={isUpdating}
              className="rounded-(--radius-small) border border-(--color-border) px-5 py-3 text-sm font-bold transition hover:bg-(--color-background) disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isUpdating}
              className="rounded-(--radius-small) bg-(--color-primary) px-5 py-3 text-sm font-extrabold text-white transition hover:bg-(--color-primary-dark) disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isUpdating ? "Saving..." : "Save changes"}
            </button>
          </div>
        </form>
      </dialog>
    </main>
  );
}
