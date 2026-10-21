import {
  CalendarDays,
  Inbox,
  LoaderCircle,
  Mail,
  MapPin,
  Phone,
  X,
} from "lucide-react";
import { type FormEvent, useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import {
  markRequestViewed,
  updateRequest,
  viewRequests,
} from "../../apiservices/AdminService";
import type { RequestStatus } from "../../formtypes/AdminTypes";
import Pagination from "../components/Pagination";

const REQUESTS_PER_PAGE = 5;

type StatusFilter = "All" | "Submitted" | RequestStatus;

type RequestUser = {
  name: string | null;
  email: string | null;
  phone_number: string | null;
  address: string | null;
};

type RawAdminRequest = {
  id: number;
  user_id: number | null;
  name: string | null;
  email: string | null;
  phone_number: string | null;
  address: string | null;
  subject: string | null;
  request_description: string | null;
  comments?: string | null;
  is_viewed: number;
  is_completed: string;
  created_at: string | null;
  updated_at: string | null;
  user: RequestUser | null;
};

type AdminRequest = Omit<
  RawAdminRequest,
  "name" | "email" | "phone_number" | "address" | "user"
> & {
  name: string;
  email: string | null;
  phone_number: string | null;
  address: string | null;
};

type ViewRequestsResponse =
  | RawAdminRequest[]
  | { requests: RawAdminRequest[] }
  | { data: RawAdminRequest[] | { requests: RawAdminRequest[] } };

const getRequests = (response: ViewRequestsResponse): AdminRequest[] => {
  let requests: RawAdminRequest[];

  if (Array.isArray(response)) requests = response;
  else if ("requests" in response) requests = response.requests;
  else if (Array.isArray(response.data)) requests = response.data;
  else requests = response.data.requests;

  return requests.map(({ user, ...request }) => ({
    ...request,
    name: user?.name ?? request.name ?? "Unknown customer",
    email: user?.email ?? request.email,
    phone_number: user?.phone_number ?? request.phone_number,
    address: user?.address ?? request.address,
  }));
};

const formatDate = (date: string | null) => {
  if (!date) return "Date unavailable";

  const parsedDate = new Date(date);
  if (Number.isNaN(parsedDate.getTime())) return "Date unavailable";

  return new Intl.DateTimeFormat("en-KE", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(parsedDate);
};

function Dash() {
  const detailsDialog = useRef<HTMLDialogElement>(null);
  const [requests, setRequests] = useState<AdminRequest[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("All");
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [selectedRequest, setSelectedRequest] = useState<AdminRequest | null>(null);
  const [selectedStatus, setSelectedStatus] = useState<RequestStatus | "">("");
  const [comments, setComments] = useState("");
  const [isUpdating, setIsUpdating] = useState(false);

  const filteredRequests =
    statusFilter === "All"
      ? requests
      : requests.filter((request) => request.is_completed === statusFilter);
  const totalPages = Math.ceil(filteredRequests.length / REQUESTS_PER_PAGE);
  const activePage = Math.min(currentPage, Math.max(1, totalPages));
  const paginatedRequests = filteredRequests.slice(
    (activePage - 1) * REQUESTS_PER_PAGE,
    activePage * REQUESTS_PER_PAGE,
  );

  useEffect(() => {
    let isMounted = true;

    const loadRequests = async () => {
      try {
        const response = (await viewRequests()) as ViewRequestsResponse;
        if (isMounted) setRequests(getRequests(response));
      } catch {
        if (isMounted) {
          setErrorMessage("Unable to load requests right now.");
        }
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };

    void loadRequests();

    return () => {
      isMounted = false;
    };
  }, []);

  const markAsViewed = async (request: AdminRequest) => {
    if (request.is_viewed) return;

    try {
      await markRequestViewed(request.id);
      setRequests((current) =>
        current.map((item) =>
          item.id === request.id ? { ...item, is_viewed: 1 } : item,
        ),
      );
      setSelectedRequest((current) =>
        current?.id === request.id ? { ...current, is_viewed: 1 } : current,
      );
    } catch {
      toast.error("The request was opened, but could not be marked as viewed.");
    }
  };

  const openDetails = (request: AdminRequest) => {
    const currentStatus = ["Accepted", "Completed", "Rejected"].includes(
      request.is_completed,
    )
      ? (request.is_completed as RequestStatus)
      : "";

    setSelectedRequest(request);
    setSelectedStatus(currentStatus);
    setComments(request.comments ?? "");
    detailsDialog.current?.showModal();
    void markAsViewed(request);
  };

  const closeDetails = () => {
    if (isUpdating) return;
    detailsDialog.current?.close();
    setSelectedRequest(null);
    setSelectedStatus("");
    setComments("");
  };

  const handleRequestUpdate = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!selectedRequest || !selectedStatus) return;

    setIsUpdating(true);

    try {
      const response = await updateRequest(
        selectedRequest.id,
        selectedStatus,
        comments,
      );
      setRequests((current) =>
        current.map((request) =>
          request.id === selectedRequest.id
            ? {
                ...request,
                is_completed: selectedStatus,
                comments: comments.trim(),
              }
            : request,
        ),
      );
      toast.success(response.message ?? "Request updated successfully.");
      detailsDialog.current?.close();
      setSelectedRequest(null);
      setSelectedStatus("");
      setComments("");
    } catch {
      toast.error("Unable to update the request right now.");
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <section
        aria-labelledby="recent-requests-heading"
        className="overflow-hidden rounded-(--radius-medium) border border-(--color-border) bg-(--color-surface) shadow-(--shadow-soft)"
      >
        <div className="flex flex-col gap-4 border-b border-(--color-border) px-5 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
          <div>
            <h1 id="recent-requests-heading" className="text-lg font-black">
              Recent requests
            </h1>
            <p className="mt-1 text-xs text-(--color-muted)">
              The latest service requests submitted by customers.
            </p>
          </div>
          {!isLoading && !errorMessage && (
            <div className="flex flex-wrap items-center gap-2">
              <label htmlFor="request-status-filter" className="sr-only">
                Filter requests by status
              </label>
              <select
                id="request-status-filter"
                value={statusFilter}
                onChange={(event) => {
                  setStatusFilter(event.target.value as StatusFilter);
                  setCurrentPage(1);
                }}
                className="rounded-lg border border-(--color-border) bg-white px-3 py-2 text-xs font-bold outline-none transition focus:border-(--color-primary) focus:ring-2 focus:ring-(--color-primary)/10"
              >
                <option value="All">All statuses</option>
                <option value="Submitted">Submitted</option>
                <option value="Accepted">Accepted</option>
                <option value="Completed">Completed</option>
                <option value="Rejected">Rejected</option>
              </select>
              <span className="whitespace-nowrap rounded-full bg-(--color-primary)/10 px-3 py-1 text-xs font-extrabold text-(--color-primary)">
                {statusFilter === "All"
                  ? `${requests.length} total`
                  : `${filteredRequests.length} of ${requests.length}`}
              </span>
            </div>
          )}
        </div>

        {isLoading && (
          <div className="space-y-4 bg-(--color-background)/60 p-5 sm:p-6" aria-label="Loading requests">
            {[0, 1, 2].map((item) => (
              <div
                key={item}
                className="h-28 animate-pulse rounded-xl border border-(--color-border) bg-white shadow-sm"
              />
            ))}
          </div>
        )}

        {!isLoading && errorMessage && (
          <p role="alert" className="m-5 rounded-xl bg-red-50 px-4 py-3 text-sm font-semibold text-red-700 sm:m-6">
            {errorMessage}
          </p>
        )}

        {!isLoading && !errorMessage && requests.length === 0 && (
          <div className="px-5 py-10 text-center sm:px-6">
            <Inbox className="mx-auto h-8 w-8 text-(--color-muted)" />
            <p className="mt-3 text-sm font-extrabold">No requests yet</p>
            <p className="mt-1 text-xs text-(--color-muted)">New requests will appear here.</p>
          </div>
        )}

        {!isLoading &&
          !errorMessage &&
          requests.length > 0 &&
          filteredRequests.length === 0 && (
            <div className="px-5 py-10 text-center sm:px-6">
              <Inbox className="mx-auto h-8 w-8 text-(--color-muted)" />
              <p className="mt-3 text-sm font-extrabold">No matching requests</p>
              <p className="mt-1 text-xs text-(--color-muted)">
                There are no requests with the {statusFilter.toLowerCase()} status.
              </p>
            </div>
          )}

        {!isLoading && !errorMessage && filteredRequests.length > 0 && (
          <div className="space-y-4 bg-(--color-background)/60 p-5 sm:p-6">
            {paginatedRequests.map((request) => (
              <article
                key={request.id}
                role="button"
                tabIndex={0}
                aria-haspopup="dialog"
                onClick={() => openDetails(request)}
                onKeyDown={(event) => {
                  if (event.key === "Enter" || event.key === " ") {
                    event.preventDefault();
                    openDetails(request);
                  }
                }}
                className={`grid cursor-pointer gap-4 rounded-xl border px-5 py-5 shadow-[0_4px_16px_rgba(30,58,138,0.08)] transition hover:-translate-y-0.5 hover:border-(--color-primary)/30 hover:shadow-[0_8px_24px_rgba(30,58,138,0.13)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--color-primary)/30 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-center sm:px-6 ${
                  request.is_viewed
                    ? "border-(--color-border) bg-white"
                    : "border-amber-300 bg-amber-50/70 ring-1 ring-amber-200"
                }`}
              >
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <h2 className="truncate text-sm font-extrabold">{request.name}</h2>
                    <span
                      className={`rounded-full px-2.5 py-1 text-[10px] font-extrabold uppercase tracking-wide ${
                        request.is_viewed
                          ? "bg-slate-100 text-slate-600"
                          : "bg-(--color-secondary)/25 text-amber-800"
                      }`}
                    >
                      {request.is_viewed ? "Viewed" : "New"}
                    </span>
                  </div>
                  {request.subject && (
                    <p className="mt-1 text-xs font-extrabold text-(--color-primary)">
                      {request.subject}
                    </p>
                  )}
                  <p className="mt-1 line-clamp-2 text-sm leading-5 text-(--color-muted)">
                    {request.request_description || "No description provided."}
                  </p>
                  <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-xs text-(--color-muted)">
                    <span className="inline-flex items-center gap-1.5">
                      <Mail className="h-3.5 w-3.5" />
                      {request.email || "Email unavailable"}
                    </span>
                    {request.phone_number && (
                      <span className="inline-flex items-center gap-1.5">
                        <Phone className="h-3.5 w-3.5" /> {request.phone_number}
                      </span>
                    )}
                    {request.address && (
                      <span className="inline-flex items-center gap-1.5">
                        <MapPin className="h-3.5 w-3.5" /> {request.address}
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex items-center justify-between gap-4 sm:block sm:text-right">
                  <span className="inline-block rounded-full bg-(--color-primary)/10 px-3 py-1 text-xs font-bold text-(--color-primary)">
                    {request.is_completed}
                  </span>
                  <p className="mt-0 inline-flex items-center gap-1.5 text-xs text-(--color-muted) sm:mt-2">
                    <CalendarDays className="h-3.5 w-3.5" />
                    {formatDate(request.created_at)}
                  </p>
                </div>
              </article>
            ))}
            <Pagination
              currentPage={activePage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
              className="pt-2"
            />
          </div>
        )}
      </section>

      <dialog
        ref={detailsDialog}
        onCancel={(event) => {
          if (isUpdating) event.preventDefault();
          else closeDetails();
        }}
        aria-labelledby="request-details-title"
        className="m-auto max-h-[calc(100vh-2rem)] w-[calc(100%-2rem)] max-w-2xl overflow-y-auto rounded-2xl bg-white p-0 text-(--color-ink) shadow-2xl backdrop:bg-slate-950/50 backdrop:backdrop-blur-[2px]"
      >
        {selectedRequest && (
          <form onSubmit={handleRequestUpdate}>
            <div className="sticky top-0 z-10 flex items-start justify-between border-b border-(--color-border) bg-white px-5 py-4 sm:px-6">
              <div className="min-w-0">
                <p className="text-xs font-extrabold uppercase tracking-[0.16em] text-(--color-primary)">
                  Request #{selectedRequest.id}
                </p>
                <h2 id="request-details-title" className="mt-1 truncate text-xl font-black">
                  {selectedRequest.subject || "Service request"}
                </h2>
              </div>
              <button
                type="button"
                onClick={closeDetails}
                disabled={isUpdating}
                className="grid h-9 w-9 shrink-0 place-items-center rounded-lg text-(--color-muted) transition hover:bg-(--color-background) hover:text-(--color-ink) disabled:opacity-50"
                aria-label="Close request details"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-6 px-5 py-5 sm:px-6">
              <div className="grid gap-3 rounded-xl bg-(--color-background) p-4 text-sm sm:grid-cols-2">
                <div>
                  <p className="text-xs font-bold text-(--color-muted)">Customer</p>
                  <p className="mt-1 font-extrabold">{selectedRequest.name}</p>
                </div>
                <div>
                  <p className="text-xs font-bold text-(--color-muted)">Submitted</p>
                  <p className="mt-1 font-extrabold">{formatDate(selectedRequest.created_at)}</p>
                </div>
                <div>
                  <p className="text-xs font-bold text-(--color-muted)">Email</p>
                  <p className="mt-1 wrap-break-word font-semibold">
                    {selectedRequest.email || "Email unavailable"}
                  </p>
                </div>
                <div>
                  <p className="text-xs font-bold text-(--color-muted)">Phone</p>
                  <p className="mt-1 font-semibold">
                    {selectedRequest.phone_number || "Phone unavailable"}
                  </p>
                </div>
                <div className="sm:col-span-2">
                  <p className="text-xs font-bold text-(--color-muted)">Address</p>
                  <p className="mt-1 font-semibold">
                    {selectedRequest.address || "Address unavailable"}
                  </p>
                </div>
              </div>

              <div>
                <h3 className="text-sm font-extrabold">Description</h3>
                <p className="mt-2 whitespace-pre-wrap rounded-xl border border-(--color-border) bg-white p-4 text-sm leading-6 text-(--color-muted)">
                  {selectedRequest.request_description || "No description provided."}
                </p>
              </div>

              <div className="border-t border-(--color-border) pt-5">
                <h3 className="text-base font-black">Update request</h3>
                <div className="mt-4 space-y-4">
                  <div>
                    <label htmlFor="request-status" className="text-sm font-bold">
                      Status <span className="text-red-600">*</span>
                    </label>
                    <select
                      id="request-status"
                      value={selectedStatus}
                      onChange={(event) =>
                        setSelectedStatus(event.target.value as RequestStatus | "")
                      }
                      required
                      disabled={isUpdating}
                      className="mt-2 w-full rounded-xl border border-(--color-border) bg-white px-4 py-3 text-sm outline-none transition focus:border-(--color-primary) focus:ring-3 focus:ring-(--color-primary)/10 disabled:opacity-60"
                    >
                      <option value="" disabled>Select a status</option>
                      <option value="Accepted">Accepted</option>
                      <option value="Completed">Completed</option>
                      <option value="Rejected">Rejected</option>
                    </select>
                  </div>

                  <div>
                    <label htmlFor="request-comments" className="text-sm font-bold">
                      Comments
                    </label>
                    <textarea
                      id="request-comments"
                      value={comments}
                      onChange={(event) => setComments(event.target.value)}
                      rows={4}
                      maxLength={255}
                      disabled={isUpdating}
                      placeholder="Add a note or update for this request..."
                      className="mt-2 w-full resize-y rounded-xl border border-(--color-border) bg-white px-4 py-3 text-sm outline-none transition placeholder:text-(--color-muted)/65 focus:border-(--color-primary) focus:ring-3 focus:ring-(--color-primary)/10 disabled:opacity-60"
                    />
                    <p className="mt-1 text-right text-xs text-(--color-muted)">
                      {comments.length}/255
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="sticky bottom-0 flex justify-end gap-3 border-t border-(--color-border) bg-(--color-background) px-5 py-4 sm:px-6">
              <button
                type="button"
                onClick={closeDetails}
                disabled={isUpdating}
                className="rounded-xl border border-(--color-border) bg-white px-4 py-2.5 text-sm font-bold transition hover:border-(--color-muted) disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isUpdating || !selectedStatus}
                className="inline-flex min-w-36 items-center justify-center gap-2 rounded-xl bg-(--color-primary) px-5 py-2.5 text-sm font-extrabold text-white transition hover:bg-(--color-primary-dark) disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isUpdating && <LoaderCircle className="h-4 w-4 animate-spin" />}
                {isUpdating ? "Updating..." : "Update request"}
              </button>
            </div>
          </form>
        )}
      </dialog>
    </div>
  );
}

export default Dash;
