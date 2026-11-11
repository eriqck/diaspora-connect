import axios from "axios";
import {
  ArrowLeft,
  ArrowRight,
  Eye,
  EyeOff,
  LockKeyhole,
  ShieldCheck,
} from "lucide-react";
import { type FormEvent, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { loginAdmin } from "../../apiservices/AuthService";
import type {
  ApiErrorResponse,
  AuthResponse,
  LoginFormData,
} from "../../formtypes/AuthTypes";

const inputClasses =
  "mt-2 w-full rounded-(--radius-small) border border-(--color-border) bg-(--color-background) px-4 py-3 text-sm outline-none transition placeholder:text-(--color-muted) focus:border-(--color-primary) focus:ring-2 focus:ring-(--color-primary)/15";

const getErrorMessage = (error: unknown) => {
  if (!axios.isAxiosError<ApiErrorResponse>(error)) {
    return "Something went wrong. Please try again in a moment.";
  }

  if (!error.response) {
    return "Unable to connect. Check your internet connection and try again.";
  }

  if (error.response.status === 401) {
    return "The email address or password is incorrect.";
  }

  if (error.response.status >= 500) {
    return "The service is temporarily unavailable. Please try again shortly.";
  }

  return error.response.data?.message ?? "Unable to sign in with those details.";
};

const saveAdminSession = (response: AuthResponse) => {
  const token =
    response.authtoken ??
    response.access_token ??
    response.authorisation?.token ??
    response.data?.token;
  const user = response.user ?? response.data?.user;

  if (!token) {
    throw new Error("The server did not return an authentication token.");
  }

  localStorage.setItem("authToken", token);
  if (user) localStorage.setItem("authUser", JSON.stringify(user));
  window.dispatchEvent(new Event("auth-changed"));
};

export default function AdminLogin() {
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const fields = new FormData(event.currentTarget);
    const payload: LoginFormData = {
      email: String(fields.get("email") ?? "").trim(),
      password,
    };

    setIsSubmitting(true);
    setErrorMessage(null);

    try {
      const response = await loginAdmin(payload);
      saveAdminSession(response);
      toast.success(response.message ?? "Welcome back");
      navigate("/admin/dashboard", { replace: true });
    } catch (error) {
      setErrorMessage(getErrorMessage(error));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="grid min-h-screen bg-(--color-background) text-(--color-ink) lg:grid-cols-[1.05fr_0.95fr]">
      <section className="relative hidden overflow-hidden bg-[linear-gradient(145deg,var(--color-primary-dark),#172554)] px-12 py-10 text-white lg:flex lg:flex-col lg:justify-between xl:px-20 xl:py-14">
        <div
          aria-hidden="true"
          className="absolute -right-32 -top-32 h-96 w-96 rounded-full border-60 border-white/5"
        />
        <div
          aria-hidden="true"
          className="absolute -bottom-32 -left-28 h-96 w-96 rounded-full bg-(--color-secondary)/15 blur-3xl"
        />

        <Link to="/" className="relative w-fit text-2xl font-black tracking-tight">
          Msaidizi <span className="text-(--color-secondary)">Diaspora</span>
        </Link>

        <div className="relative max-w-xl">
          <span className="grid h-14 w-14 place-items-center rounded-2xl bg-white/10 text-(--color-secondary) ring-1 ring-white/15">
            <ShieldCheck className="h-7 w-7" />
          </span>
          <p className="mt-8 text-sm font-extrabold uppercase tracking-[0.18em] text-(--color-secondary)">
            Secure administration
          </p>
          <h1 className="mt-4 text-4xl font-black leading-tight xl:text-5xl">
            Manage every request from one trusted workspace.
          </h1>
          <p className="mt-5 max-w-lg text-base leading-7 text-white/70">
            Review service requests, coordinate updates, and support Diaspora
            Help customers from the administrative dashboard.
          </p>
        </div>

        <p className="relative text-xs font-semibold text-white/45">
          Restricted to authorised Msaidizi Diaspora administrators.
        </p>
      </section>

      <section className="flex min-h-screen items-center px-4 py-10 sm:px-8 lg:px-12 xl:px-20">
        <div className="mx-auto w-full max-w-md">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-sm font-bold text-(--color-muted) transition hover:text-(--color-primary)"
          >
            <ArrowLeft className="h-4 w-4" /> Back to main website
          </Link>

          <div className="mt-10">
            <span className="grid h-12 w-12 place-items-center rounded-(--radius-medium) bg-(--color-primary)/10 text-(--color-primary)">
              <LockKeyhole className="h-6 w-6" />
            </span>
            <p className="mt-6 text-sm font-extrabold uppercase tracking-[0.16em] text-(--color-primary)">
              Admin portal
            </p>
            <h2 className="mt-2 text-3xl font-black tracking-tight sm:text-4xl">
              Sign in to your account
            </h2>
            <p className="mt-3 text-sm leading-6 text-(--color-muted)">
              Enter your administrator credentials to continue.
            </p>
          </div>

          <form className="mt-8 space-y-5" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="admin-email" className="text-sm font-bold">
                Email address
              </label>
              <input
                id="admin-email"
                name="email"
                type="email"
                autoComplete="username"
                autoFocus
                required
                disabled={isSubmitting}
                placeholder="admin@example.com"
                className={inputClasses}
              />
            </div>

            <div>
              <label htmlFor="admin-password" className="text-sm font-bold">
                Password
              </label>
              <div className="relative">
                <input
                  id="admin-password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  required
                  disabled={isSubmitting}
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  placeholder="Enter your password"
                  className={`${inputClasses} pr-12`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((visible) => !visible)}
                  disabled={isSubmitting}
                  className="absolute bottom-0 right-0 grid h-11 w-12 place-items-center text-(--color-muted) transition hover:text-(--color-ink) disabled:opacity-50"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  aria-pressed={showPassword}
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5" />
                  ) : (
                    <Eye className="h-5 w-5" />
                  )}
                </button>
              </div>
            </div>

            {errorMessage && (
              <p
                role="alert"
                className="rounded-(--radius-small) border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold leading-6 text-red-700"
              >
                {errorMessage}
              </p>
            )}

            <button
              type="submit"
              disabled={isSubmitting}
              className="flex w-full items-center justify-center gap-2 rounded-(--radius-small) bg-(--color-primary) px-5 py-3.5 font-extrabold text-white transition hover:bg-(--color-primary-dark) focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(--color-primary) disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isSubmitting ? "Signing in..." : "Sign in securely"}
              {!isSubmitting && <ArrowRight className="h-4 w-4" />}
            </button>
          </form>

          <div className="mt-8 border-t border-(--color-border) pt-6">
            <p className="text-center text-xs leading-5 text-(--color-muted)">
              This area is monitored and limited to authorised staff. If you
              need access, contact your system administrator.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
