import {
  ChevronDown,
  LogOut,
  Menu,
  X,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { logoutUser } from "../../../apiservices/AuthService";
import type { AuthUser } from "../../../formtypes/AuthTypes";

const adminLinks = [
  { label: "Categories", to: "/admin/categories" },
];

const getStoredAdmin = (): AuthUser | null => {
  const storedUser = localStorage.getItem("authUser");

  if (!storedUser) return null;

  try {
    return JSON.parse(storedUser) as AuthUser;
  } catch {
    localStorage.removeItem("authUser");
    return null;
  }
};

function NavBar() {
  const navigate = useNavigate();
  const profileMenu = useRef<HTMLDivElement>(null);
  const [admin, setAdmin] = useState<AuthUser | null>(getStoredAdmin);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSigningOut, setIsSigningOut] = useState(false);

  useEffect(() => {
    const syncAdmin = () => setAdmin(getStoredAdmin());
    const closeMenus = (event: PointerEvent) => {
      if (!profileMenu.current?.contains(event.target as Node)) {
        setIsProfileOpen(false);
      }
    };
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsProfileOpen(false);
        setIsMobileMenuOpen(false);
      }
    };

    window.addEventListener("auth-changed", syncAdmin);
    window.addEventListener("storage", syncAdmin);
    document.addEventListener("pointerdown", closeMenus);
    document.addEventListener("keydown", closeOnEscape);

    return () => {
      window.removeEventListener("auth-changed", syncAdmin);
      window.removeEventListener("storage", syncAdmin);
      document.removeEventListener("pointerdown", closeMenus);
      document.removeEventListener("keydown", closeOnEscape);
    };
  }, []);

  const handleSignOut = async () => {
    setIsSigningOut(true);

    try {
      await logoutUser();
      toast.success("Signed out successfully");
    } catch {
      toast.info("You have been signed out on this device");
    } finally {
      localStorage.removeItem("authToken");
      localStorage.removeItem("authUser");
      window.dispatchEvent(new Event("auth-changed"));
      setIsProfileOpen(false);
      setIsSigningOut(false);
      navigate("/admin/login", { replace: true });
    }
  };

  const displayName = admin?.name ?? "Administrator";
  const displayEmail = admin?.email ?? "Admin account";

  return (
    <header className="sticky top-0 z-40 border-b border-(--color-border) bg-(--color-surface)/95 text-(--color-ink) shadow-[0_4px_18px_rgba(30,58,138,0.06)] backdrop-blur">
      <div className="mx-auto grid min-h-18 max-w-7xl grid-cols-[1fr_auto] items-center gap-4 px-4 sm:px-6 md:grid-cols-[1fr_auto_1fr] lg:px-8">
        <Link
          to="/admin/dashboard"
          className="flex w-fit items-center gap-3 rounded-lg focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-(--color-primary)"
          aria-label="Msaidizi Diaspora admin dashboard"
        >
          
          <span>
            <span className="block text-lg font-black leading-none tracking-tight">
              Diaspora <span className="text-(--color-primary)">Help</span>
            </span>
            <span className="mt-1 block text-[10px] font-extrabold uppercase tracking-[0.2em] text-(--color-muted)">
              Admin
            </span>
          </span>
        </Link>

        <nav className="hidden items-center gap-1 md:flex" aria-label="Admin navigation">
          {adminLinks.map(({ label, to }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                `rounded-lg px-5 py-2.5 text-sm font-bold transition focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(--color-primary) ${
                  isActive
                    ? "bg-(--color-primary-dark) text-white"
                    : "bg-(--color-primary) text-white hover:bg-(--color-primary-dark)"
                }`
              }
            >
              <span className="text-white">{label}</span>
            </NavLink>
          ))}
        </nav>

        <div className="flex items-center justify-end gap-1">
          <button
            type="button"
            onClick={() => setIsMobileMenuOpen((isOpen) => !isOpen)}
            className="grid h-10 w-10 place-items-center rounded-lg text-(--color-muted) transition hover:bg-(--color-background) hover:text-(--color-primary) focus-visible:outline-2 focus-visible:outline-(--color-primary) md:hidden"
            aria-label={isMobileMenuOpen ? "Close navigation" : "Open navigation"}
            aria-expanded={isMobileMenuOpen}
            aria-controls="admin-mobile-navigation"
          >
            {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>

          <div ref={profileMenu} className="relative">
            <button
              type="button"
              onClick={() => setIsProfileOpen((isOpen) => !isOpen)}
              className="flex items-center gap-2 rounded-xl p-1.5 transition hover:bg-(--color-background) focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(--color-primary) sm:gap-3 sm:pr-2"
              aria-label="Open administrator profile menu"
              aria-expanded={isProfileOpen}
              aria-controls="admin-profile-menu"
            >
              <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-(--color-primary-dark) text-sm font-black uppercase text-white">
                {displayName.charAt(0)}
              </span>
              <span className="hidden max-w-36 text-left sm:block">
                <span className="block truncate text-sm font-extrabold">{displayName}</span>
                <span className="block text-xs text-(--color-muted)">Administrator</span>
              </span>
              <ChevronDown
                className={`hidden h-4 w-4 text-(--color-muted) transition-transform sm:block ${
                  isProfileOpen ? "rotate-180" : ""
                }`}
              />
            </button>

            {isProfileOpen && (
              <div
                id="admin-profile-menu"
                className="absolute right-0 top-[calc(100%+0.65rem)] w-64 overflow-hidden rounded-(--radius-medium) border border-(--color-border) bg-(--color-surface) p-2 shadow-xl"
              >
                <div className="border-b border-(--color-border) px-3 py-3">
                  <p className="truncate text-sm font-extrabold">{displayName}</p>
                  <p className="mt-1 truncate text-xs text-(--color-muted)">{displayEmail}</p>
                </div>
               
                <button
                  type="button"
                  onClick={handleSignOut}
                  disabled={isSigningOut}
                  className="mt-1 flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm font-bold text-red-600 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  <LogOut className="h-4 w-4" />
                  {isSigningOut ? "Signing out..." : "Sign out"}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {isMobileMenuOpen && (
        <nav
          id="admin-mobile-navigation"
          className="border-t border-(--color-border) px-4 py-3 md:hidden"
          aria-label="Admin mobile navigation"
        >
          <div className="mx-auto flex max-w-7xl gap-2">
            {adminLinks.map(({ label, to }) => (
              <NavLink
                key={to}
                to={to}
                onClick={() => setIsMobileMenuOpen(false)}
                className={({ isActive }) =>
                  `flex-1 rounded-lg px-4 py-2.5 text-center text-sm font-bold transition ${
                    isActive
                      ? "bg-(--color-primary-dark) text-white"
                      : "bg-(--color-primary) text-white hover:bg-(--color-primary-dark)"
                  }`
                }
              >
                <span className="text-white">{label}</span>
              </NavLink>
            ))}
          </div>
        </nav>
      )}
    </header>
  );
}

export default NavBar;
