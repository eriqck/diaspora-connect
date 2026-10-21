import {
  Bell,
  CheckCircle2,
  Clock3,
  Eye,
  EyeOff,
  ShieldCheck,
} from "lucide-react";
import axios from "axios";
import { type FormEvent, useEffect, useRef, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { loginUser, registerUser } from "../../apiservices/AuthService";
import type {
  ApiErrorResponse,
  AuthResponse,
  LoginFormData,
  RegisterFormData,
} from "../../formtypes/AuthTypes";

type SocialIconProps = {
  className?: string;
};

const GoogleIcon = ({ className }: SocialIconProps) => (
  <svg aria-hidden="true" className={className} viewBox="0 0 24 24">
    <path
      fill="#4285F4"
      d="M21.6 12.23c0-.71-.06-1.4-.18-2.07H12v3.91h5.38a4.6 4.6 0 0 1-2 3.02v2.54h3.24c1.9-1.75 2.98-4.33 2.98-7.4Z"
    />
    <path
      fill="#34A853"
      d="M12 22c2.7 0 4.97-.9 6.62-2.42l-3.24-2.53c-.9.6-2.05.96-3.38.96-2.61 0-4.82-1.76-5.61-4.13H3.05v2.61A10 10 0 0 0 12 22Z"
    />
    <path
      fill="#FBBC05"
      d="M6.39 13.88A6.02 6.02 0 0 1 6.07 12c0-.65.11-1.28.32-1.88V7.51H3.05A10 10 0 0 0 2 12c0 1.61.38 3.14 1.05 4.49l3.34-2.61Z"
    />
    <path
      fill="#EA4335"
      d="M12 5.99c1.47 0 2.79.5 3.83 1.49l2.87-2.87A9.62 9.62 0 0 0 12 2a10 10 0 0 0-8.95 5.51l3.34 2.61C7.18 7.75 9.39 5.99 12 5.99Z"
    />
  </svg>
);

const FacebookIcon = ({ className }: SocialIconProps) => (
  <svg
    aria-hidden="true"
    className={className}
    viewBox="0 0 24 24"
    fill="#1877F2"
  >
    <path d="M22 12a10 10 0 1 0-11.56 9.88v-6.99H7.9V12h2.54V9.8c0-2.51 1.5-3.9 3.79-3.9 1.1 0 2.24.2 2.24.2v2.46h-1.26c-1.24 0-1.63.77-1.63 1.56V12h2.77l-.44 2.89h-2.33v6.99A10 10 0 0 0 22 12Z" />
  </svg>
);

const inputClasses =
  "mt-2 w-full rounded-(--radius-small) border border-(--color-border) bg-(--color-background) px-4 py-3 text-sm outline-none transition placeholder:text-(--color-muted) focus:border-(--color-primary) focus:ring-2 focus:ring-(--color-primary)/15";

export default function Auth() {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const isSignUp = pathname === "/register";
  const [showPassword, setShowPassword] = useState(false);
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const confirmPasswordRef = useRef<HTMLInputElement>(null);
  const phoneIsValid = /^\+?[0-9 ()-]{9,20}$/.test(phone);
  const passwordsMatch = password.length > 0 && password === confirmPassword;
  const passwordRules = [
    { label: "8 or more characters", valid: password.length >= 8 },
    { label: "One uppercase letter", valid: /[A-Z]/.test(password) },
    { label: "One lowercase letter", valid: /[a-z]/.test(password) },
    { label: "One number", valid: /[0-9]/.test(password) },
  ];

  useEffect(() => {
    const confirmInput = confirmPasswordRef.current;
    if (!confirmInput) return;

    confirmInput.setCustomValidity(
      confirmPassword && !passwordsMatch ? "Passwords do not match." : "",
    );
  }, [confirmPassword, passwordsMatch]);

  const saveAuthenticatedUser = (response: AuthResponse) => {
    const token =
      response.authtoken ??
      response.access_token ??
      response.authorisation?.token ??
      response.data?.token;
    const user = response.user ?? response.data?.user;

    if (token) localStorage.setItem("authToken", token);
    if (user) localStorage.setItem("authUser", JSON.stringify(user));
    window.dispatchEvent(new Event("auth-changed"));
  };

  const showRequestError = (error: unknown) => {
    if (!axios.isAxiosError<ApiErrorResponse>(error)) {
      toast.error("Something went wrong", {
        description: "Please try again in a moment.",
      });
      return;
    }

    const status = error.response?.status;
    const errorData = error.response?.data;

    if (status === 422) {
      toast.error(errorData?.message ?? "Please check your details");
      return;
    }

    if (status && status >= 500) {
      toast.error("We could not complete your request", {
        description: "Our service is temporarily unavailable. Please try again shortly.",
      });
      return;
    }

    toast.error(errorData?.message ?? "Unable to connect", {
      description: error.response
        ? "Please review your details and try again."
        : "Check your internet connection and try again.",
    });
  };

  const handleRegister = async (form: HTMLFormElement) => {
    const fields = new FormData(form);
    const payload: RegisterFormData = {
      name: String(fields.get("name") ?? "").trim(),
      email: String(fields.get("email") ?? "").trim(),
      phone: String(fields.get("phone") ?? "").trim(),
      address: String(fields.get("address") ?? "").trim(),
      password,
      password_confirmation: confirmPassword,
    };

    const response = await registerUser(payload);
    toast.success(response.message ?? "Account created successfully");
    navigate("/login", { replace: true });
  };

  const handleLogin = async (form: HTMLFormElement) => {
    const fields = new FormData(form);
    const payload: LoginFormData = {
      email: String(fields.get("email") ?? "").trim(),
      password,
    };

    const response = await loginUser(payload);
    saveAuthenticatedUser(response);
    toast.success(response.message ?? "Signed in successfully");
    navigate("/", { replace: true });
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (isSignUp && !passwordsMatch) {
      toast.error("Passwords do not match");
      confirmPasswordRef.current?.focus();
      return;
    }

    setIsSubmitting(true);

    try {
      if (isSignUp) {
        await handleRegister(event.currentTarget);
      } else {
        await handleLogin(event.currentTarget);
      }
    } catch (error) {
      showRequestError(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="min-h-[calc(100vh-8rem)] bg-(--color-background) px-4 py-10 text-(--color-ink) sm:px-6 lg:px-8 lg:py-16">
      <div className="mx-auto grid max-w-6xl overflow-hidden rounded-3xl border border-(--color-border) bg-(--color-surface) shadow-(--shadow-soft) lg:grid-cols-[0.85fr_1.15fr]">
        <section className="relative overflow-hidden bg-[linear-gradient(145deg,var(--color-primary-dark),var(--color-primary))] p-8 text-white sm:p-10 lg:p-12">
          <div
            className="absolute -right-20 -top-20 h-64 w-64 rounded-full border-45 border-white/10"
            aria-hidden="true"
          />
          <div
            className="absolute -bottom-28 -left-24 h-72 w-72 rounded-full bg-(--color-secondary)/20 blur-2xl"
            aria-hidden="true"
          />

          <div className="relative">
            <Link to="/" className="text-2xl font-black tracking-tight">
              Diaspora <span className="text-(--color-secondary)">Help</span>
            </Link>
            <p className="mt-12 text-sm font-extrabold uppercase tracking-[0.16em] text-(--color-secondary)">
              Your requests, all in one place
            </p>
            <h1 className="mt-4 text-3xl font-black leading-tight sm:text-4xl">
              Sign up to keep track of every request.
            </h1>
            <p className="mt-4 max-w-md leading-7 text-white/75">
              Create an account to follow progress, review updates, and return
              to your request history whenever you need it.
            </p>

            <div className="mt-9 space-y-5">
              {[
                { Icon: Clock3, text: "Track request progress and timelines" },
                { Icon: Bell, text: "See important updates in one place" },
                {
                  Icon: ShieldCheck,
                  text: "Keep a secure history of your requests",
                },
              ].map(({ Icon, text }) => (
                <div key={text} className="flex items-center gap-3">
                  <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-white/10 text-(--color-secondary)">
                    <Icon className="h-4 w-4" />
                  </span>
                  <span className="text-sm font-semibold text-white/85">
                    {text}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="p-6 sm:p-10 lg:p-12" aria-labelledby="auth-heading">
          <div className="mx-auto max-w-md">
            <div className="grid grid-cols-2 rounded-(--radius-small) bg-(--color-background) p-1">
              <Link
                to="/login"
                className={`rounded-lg px-4 py-2.5 text-center text-sm font-extrabold transition ${
                  !isSignUp
                    ? "bg-(--color-surface) text-(--color-primary) shadow-sm"
                    : "text-(--color-muted) hover:text-(--color-ink)"
                }`}
              >
                Sign in
              </Link>
              <Link
                to="/register"
                className={`rounded-lg px-4 py-2.5 text-center text-sm font-extrabold transition ${
                  isSignUp
                    ? "bg-(--color-surface) text-(--color-primary) shadow-sm"
                    : "text-(--color-muted) hover:text-(--color-ink)"
                }`}
              >
                Sign up
              </Link>
            </div>

            <h2
              id="auth-heading"
              className="mt-8 text-3xl font-black tracking-tight"
            >
              {isSignUp ? "Create your account" : "Welcome back"}
            </h2>
            <p className="mt-2 text-sm leading-6 text-(--color-muted)">
              {isSignUp
                ? "Join Diaspora Help and start tracking your requests."
                : "Sign in to view and manage your requests."}
            </p>

            <form
              className="mt-7 space-y-5"
              onSubmit={handleSubmit}
            >
              {isSignUp && (
                <div>
                  <label htmlFor="full-name" className="text-sm font-bold">
                    Full name
                  </label>
                  <input
                    id="full-name"
                    name="name"
                    type="text"
                    autoComplete="name"
                    required
                    placeholder="Your full name"
                    className={inputClasses}
                  />
                </div>
              )}

              <div>
                <label htmlFor="email" className="text-sm font-bold">
                  Email address
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  placeholder="you@example.com"
                  className={inputClasses}
                />
              </div>

              {isSignUp && (
                <div>
                  <label htmlFor="phone" className="text-sm font-bold">
                    Phone number
                  </label>
                  <input
                    id="phone"
                    name="phone"
                    type="tel"
                    autoComplete="tel"
                    required
                    pattern="[+]?[0-9 ()-]{9,20}"
                    title="Enter 9 to 20 digits. Spaces, brackets and hyphens are allowed."
                    value={phone}
                    onChange={(event) => setPhone(event.target.value)}
                    placeholder="+254 700 000 000"
                    aria-invalid={phone.length > 0 && !phoneIsValid}
                    aria-describedby="phone-validation"
                    className={inputClasses}
                  />
                  {phone.length > 0 && (
                    <p
                      id="phone-validation"
                      className={`mt-1.5 text-xs font-semibold ${
                        phoneIsValid ? "text-emerald-700" : "text-red-600"
                      }`}
                    >
                      {phoneIsValid
                        ? "Phone number looks valid."
                        : "Enter a valid phone number with 9 to 20 digits."}
                    </p>
                  )}
                </div>
              )}

              {isSignUp && (
                <div>
                  <label htmlFor="address" className="text-sm font-bold">
                    Address
                  </label>
                  <input
                    id="address"
                    name="address"
                    type="text"
                    autoComplete="street-address"
                    required
                    minLength={5}
                    placeholder="Street, city, and country"
                    className={inputClasses}
                  />
                </div>
              )}

              <div>
                <div className="flex items-center justify-between gap-4">
                  <label htmlFor="password" className="text-sm font-bold">
                    Password
                  </label>
                  {!isSignUp && (
                    <a
                      href="/forgot-password"
                      className="text-xs font-bold text-(--color-primary) hover:underline"
                    >
                      Forgot password?
                    </a>
                  )}
                </div>
                <div className="relative">
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    autoComplete={
                      isSignUp ? "new-password" : "current-password"
                    }
                    required
                    minLength={8}
                    pattern={isSignUp ? "(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9]).{8,}" : undefined}
                    title={isSignUp ? "Use at least 8 characters with uppercase, lowercase and a number." : undefined}
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    placeholder="At least 8 characters"
                    className={`${inputClasses} pr-12`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((visible) => !visible)}
                    className="absolute bottom-0 right-0 grid h-11 w-12 place-items-center text-(--color-muted) hover:text-(--color-ink)"
                    aria-label={
                      showPassword ? "Hide password" : "Show password"
                    }
                  >
                    {showPassword ? (
                      <EyeOff className="h-5 w-5" />
                    ) : (
                      <Eye className="h-5 w-5" />
                    )}
                  </button>
                </div>
                {isSignUp && password.length > 0 && (
                  <ul className="mt-2 grid gap-1 text-xs sm:grid-cols-2" aria-label="Password requirements">
                    {passwordRules.map(({ label, valid }) => (
                      <li
                        key={label}
                        className={`flex items-center gap-1.5 font-semibold ${
                          valid ? "text-emerald-700" : "text-(--color-muted)"
                        }`}
                      >
                        <CheckCircle2 className="h-3.5 w-3.5" /> {label}
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              {isSignUp && (
                <div>
                  <label htmlFor="confirm-password" className="text-sm font-bold">
                    Confirm password
                  </label>
                  <div className="relative">
                    <input
                      ref={confirmPasswordRef}
                      id="confirm-password"
                      name="confirmPassword"
                      type={showPassword ? "text" : "password"}
                      autoComplete="new-password"
                      required
                      value={confirmPassword}
                      onChange={(event) => setConfirmPassword(event.target.value)}
                      placeholder="Enter your password again"
                      aria-invalid={confirmPassword.length > 0 && !passwordsMatch}
                      aria-describedby="password-match-status"
                      className={`${inputClasses} pr-12`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((visible) => !visible)}
                      className="absolute bottom-0 right-0 grid h-11 w-12 place-items-center text-(--color-muted) hover:text-(--color-ink)"
                      aria-label={showPassword ? "Hide passwords" : "Show passwords"}
                    >
                      {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                    </button>
                  </div>
                  {confirmPassword.length > 0 && (
                    <p
                      id="password-match-status"
                      role="status"
                      className={`mt-1.5 flex items-center gap-1.5 text-xs font-bold ${
                        passwordsMatch ? "text-emerald-700" : "text-red-600"
                      }`}
                    >
                      <CheckCircle2 className="h-3.5 w-3.5" />
                      {passwordsMatch ? "Passwords match." : "Passwords do not match."}
                    </p>
                  )}
                </div>
              )}

              {isSignUp && (
                <label className="flex items-start gap-3 text-sm leading-6 text-(--color-muted)">
                  <input
                    type="checkbox"
                    required
                    className="mt-1 h-4 w-4 accent-(--color-primary)"
                  />
                  <span>
                    I agree to the{" "}
                    <a
                      href="/terms"
                      className="font-bold text-(--color-primary) hover:underline"
                    >
                      Terms of Service
                    </a>{" "}
                    and{" "}
                    <a
                      href="/privacy"
                      className="font-bold text-(--color-primary) hover:underline"
                    >
                      Privacy Policy
                    </a>
                    .
                  </span>
                </label>
              )}

              <button
                type="submit"
                disabled={isSubmitting}
                className="flex w-full items-center justify-center gap-2 rounded-(--radius-small) bg-(--color-primary) px-5 py-3.5 font-extrabold text-white transition hover:bg-(--color-primary-dark) focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(--color-primary) disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isSubmitting
                  ? isSignUp
                    ? "Creating account..."
                    : "Signing in..."
                  : isSignUp
                    ? "Create account"
                    : "Sign in"}
                <CheckCircle2 className="h-4 w-4" />
              </button>
            </form>

            <div className="my-7 flex items-center gap-4" aria-hidden="true">
              <span className="h-px flex-1 bg-(--color-border)" />
              <span className="text-xs font-bold uppercase tracking-wider text-(--color-muted)">
                or continue with
              </span>
              <span className="h-px flex-1 bg-(--color-border)" />
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              <button
                type="button"
                className="flex items-center justify-center gap-3 rounded-(--radius-small) border border-(--color-border) px-4 py-3 text-sm font-bold transition hover:border-(--color-primary) hover:bg-(--color-background)"
              >
                <GoogleIcon className="h-5 w-5" /> Google
              </button>
              <button
                type="button"
                className="flex items-center justify-center gap-3 rounded-(--radius-small) border border-(--color-border) px-4 py-3 text-sm font-bold transition hover:border-(--color-primary) hover:bg-(--color-background)"
              >
                <FacebookIcon className="h-5 w-5" /> Facebook
              </button>
            </div>

            <p className="mt-6 text-center text-sm text-(--color-muted)">
              {isSignUp ? "Already have an account?" : "New to Diaspora Help?"}{" "}
              <Link
                to={isSignUp ? "/login" : "/register"}
                className="font-extrabold text-(--color-primary) hover:underline"
              >
                {isSignUp ? "Sign in" : "Create an account"}
              </Link>
            </p>
          </div>
        </section>
      </div>
    </main>
  );
}
