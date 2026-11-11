import axios from "axios";
import { type FormEvent, useRef, useState } from "react";
import { CheckCircle2, LoaderCircle, Send, X } from "lucide-react";
import { useLocation } from "react-router-dom";
import { submitRequest } from "../../apiservices/HomeService";
import type {
  SubmitRequestData,
  SubmitRequestResponse,
} from "../../formtypes/HomeTypes";

const serviceOptions = [
  "Building & Consultancy",
  "Land & Property",
  "Family Errands",
  "Government Services",
  "Investment",
  "Events Planning",
  "Tours & Travel",
  "Car Hire",
  "Other services",
];

const countries = [
  "United States",
  "United Kingdom",
  "Canada",
  "Australia",
  "United Arab Emirates",
  "Kenya",
  "Other",
];

const inputClassName =
  "mt-2 w-full rounded-xl border border-slate-300 bg-white px-4 py-3.5 text-base text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-[#f5b313] focus:ring-2 focus:ring-[#f5b313]/25";

function RequestServiceNow() {
  const location = useLocation();
  const dialogRef = useRef<HTMLDialogElement>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionError, setSubmissionError] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);

  const routeService: Record<string, string> = {
    "/building-consultancy": "Building & Consultancy",
    "/land-property-purchase": "Land & Property",
    "/family-errands-concierge": "Family Errands",
    "/government-services": "Government Services",
    "/investment": "Investment",
  };
  const initialService =
    routeService[location.pathname] ??
    (location.pathname.startsWith("/services/") ? "Other services" : "");

  const closeDialog = () => {
    dialogRef.current?.close();
    formRef.current?.reset();
    setSubmitted(false);
    setSubmissionError(null);
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitting(true);
    setSubmissionError(null);

    const fields = new FormData(event.currentTarget);
    const country = String(fields.get("country") ?? "").trim();
    const service = String(fields.get("service") ?? "").trim();
    const locationInKenya = String(fields.get("location") ?? "").trim();
    const projectDescription = String(fields.get("description") ?? "").trim();
    const requestData: SubmitRequestData = {
      name: String(fields.get("name") ?? "").trim(),
      phone: String(fields.get("phone") ?? "").trim(),
      address: locationInKenya,
      subject: service,
      description: `Country of residence: ${country}\n\nProject description and goals:\n${projectDescription}`,
    };

    try {
      const result = await submitRequest(requestData);
      if (!result.success) {
        throw new Error(result.message || "Unable to submit your request.");
      }
      setSubmitted(true);
    } catch (requestError) {
      setSubmissionError(
        axios.isAxiosError<SubmitRequestResponse>(requestError)
          ? requestError.response?.data?.message ||
              "Unable to submit your request. Please try again."
          : requestError instanceof Error
            ? requestError.message
            : "Unable to submit your request. Please try again.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <button
        type="button"
        onClick={() => {
          setSubmitted(false);
          setSubmissionError(null);
          formRef.current?.reset();
          dialogRef.current?.showModal();
        }}
        className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-[#f5b313] px-5 py-3 font-extrabold text-slate-950 shadow-lg transition hover:-translate-y-0.5 hover:bg-[#ffc533] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#f5b313]"
      >
        <CheckCircle2 className="h-5 w-5" aria-hidden="true" />
        Request Service Now
      </button>

      <dialog
        ref={dialogRef}
        onClose={() => {
          setSubmitted(false);
          setSubmissionError(null);
        }}
        onClick={(event) => {
          if (event.target === event.currentTarget) closeDialog();
        }}
        aria-labelledby="request-service-title"
        className="m-auto max-h-[92vh] w-[calc(100%-1.5rem)] max-w-2xl overflow-y-auto rounded-2xl border border-white/40 bg-white p-0 text-slate-800 shadow-2xl backdrop:bg-slate-950/75 backdrop:backdrop-blur-sm"
      >
        <div className="flex items-start justify-between gap-5 bg-[#f5b313] px-6 py-6 text-slate-950 sm:px-8">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-slate-800">
              Msaidizi Diaspora
            </p>
            <h2
              id="request-service-title"
              className="mt-2 text-3xl font-black sm:text-4xl"
            >
              Submit Service Brief
            </h2>
            <p className="mt-2 max-w-lg text-sm leading-6 text-slate-800 sm:text-base">
              Share what you need, and our team will review your request and
              contact you with next steps.
            </p>
          </div>
          <button
            type="button"
            onClick={closeDialog}
            aria-label="Close request form"
            className="grid h-10 w-10 shrink-0 place-items-center rounded-full text-slate-900/75 transition hover:bg-black/10 hover:text-slate-950 focus-visible:outline-2 focus-visible:outline-slate-950"
          >
            <X className="h-5 w-5" aria-hidden="true" />
          </button>
        </div>

        {submitted ? (
          <div className="px-6 py-12 text-center sm:px-8">
            <CheckCircle2
              className="mx-auto h-12 w-12 text-[#b78300]"
              aria-hidden="true"
            />
            <h3 className="mt-4 text-2xl font-black">
              Your request has been received
            </h3>
            <p className="mt-2 text-slate-600">
              Our team will be in touch to discuss the next steps.
            </p>
            <button
              type="button"
              onClick={closeDialog}
              className="mt-7 rounded-xl bg-[#f5b313] px-6 py-3 font-bold text-slate-950 transition hover:bg-[#ffc533] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#f5b313]"
            >
              Done
            </button>
          </div>
        ) : (
          <form
            ref={formRef}
            onSubmit={handleSubmit}
            className="space-y-5 px-6 py-6 sm:px-8"
          >
            {submissionError && (
              <p
                role="alert"
                className="rounded-xl bg-red-50 px-4 py-3 text-sm font-semibold text-red-700"
              >
                {submissionError}
              </p>
            )}

            <div>
              <label
                htmlFor="request-service-name"
                className="text-sm font-extrabold uppercase tracking-wide text-slate-700"
              >
                Your full name *
              </label>
              <input
                id="request-service-name"
                name="name"
                type="text"
                autoComplete="name"
                placeholder="e.g. John Mwangi"
                required
                className={inputClassName}
              />
            </div>

            <div>
              <label
                htmlFor="request-service-phone"
                className="text-sm font-extrabold uppercase tracking-wide text-slate-700"
              >
                WhatsApp / Phone *
              </label>
              <input
                id="request-service-phone"
                name="phone"
                type="tel"
                autoComplete="tel"
                placeholder="+1 555 123 4567"
                required
                className={inputClassName}
              />
            </div>

            <div>
              <label
                htmlFor="request-service-country"
                className="text-sm font-extrabold uppercase tracking-wide text-slate-700"
              >
                Current country of residence
              </label>
              <select
                id="request-service-country"
                name="country"
                defaultValue=""
                className={inputClassName}
              >
                <option value="">Select country</option>
                {countries.map((country) => (
                  <option key={country} value={country}>
                    {country}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label
                htmlFor="request-service-type"
                className="text-sm font-extrabold uppercase tracking-wide text-slate-700"
              >
                Service required *
              </label>
              <select
                key={location.pathname}
                id="request-service-type"
                name="service"
                defaultValue={initialService}
                required
                className={inputClassName}
              >
                <option value="" disabled>
                  Select a service
                </option>
                {serviceOptions.map((service) => (
                  <option key={service} value={service}>
                    {service}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label
                htmlFor="request-service-location"
                className="text-sm font-extrabold uppercase tracking-wide text-slate-700"
              >
                Target location in Kenya
              </label>
              <input
                id="request-service-location"
                name="location"
                type="text"
                placeholder="e.g. Kitengela, Kajiado County"
                className={inputClassName}
              />
            </div>

            <div>
              <label
                htmlFor="request-service-description"
                className="text-sm font-extrabold uppercase tracking-wide text-slate-700"
              >
                Brief project description &amp; goals *
              </label>
              <textarea
                id="request-service-description"
                name="description"
                rows={4}
                placeholder="Describe what you need verified or done in Kenya..."
                required
                className={`${inputClassName} resize-y`}
              />
            </div>

            <p className="rounded-xl border border-[#f5b313]/35 bg-[#fff8df] p-4 text-sm leading-6 text-slate-800">
              Your details will be used only to review and coordinate your
              request.
            </p>

            <div className="flex flex-col-reverse gap-3 pt-1 sm:flex-row sm:justify-end">
              <button
                type="button"
                onClick={closeDialog}
                className="rounded-xl border border-slate-300 px-5 py-3 font-bold text-slate-700 transition hover:bg-slate-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-500"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#f5b313] px-6 py-3 font-extrabold text-slate-950 transition hover:bg-[#ffc533] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#f5b313] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isSubmitting ? (
                  <>
                    <LoaderCircle
                      className="h-4 w-4 animate-spin"
                      aria-hidden="true"
                    />
                    Submitting...
                  </>
                ) : (
                  <>
                    Submit request
                    <Send className="h-4 w-4" aria-hidden="true" />
                  </>
                )}
              </button>
            </div>
          </form>
        )}
      </dialog>
    </>
  );
}

export default RequestServiceNow;
