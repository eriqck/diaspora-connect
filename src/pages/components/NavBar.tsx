import { useEffect, useRef, useState } from "react";
import { LogOut, Menu, X } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import msaidiziLogo from "../../assets/msaidizi-diaspora-logo.png";
import { logoutUser } from "../../apiservices/AuthService";
import {
  fetchCategories,
  type HomeCategory,
} from "../../apiservices/HomeService";
import type { AuthUser } from "../../formtypes/AuthTypes";

type IconProps = { className?: string };
type ServiceSearchResult = { title: string; categoryId: number; service?: string };

const featuredServiceLinks = [
  { label: "Building & Consultancy", to: "/building-consultancy" },
  { label: "Land & Property", to: "/land-property-purchase" },
  { label: "Family Errands", to: "/family-errands-concierge" },
  { label: "Government Services", to: "/government-services" },
  { label: "Investment", to: "/investment" },
];

const SearchIcon = ({ className }: IconProps) => (
  <svg
    aria-hidden="true"
    className={className}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
  >
    <circle cx="11" cy="11" r="7" />
    <path strokeLinecap="round" d="m20 20-4-4" />
  </svg>
);

const UserIcon = ({ className }: IconProps) => (
  <svg
    aria-hidden="true"
    className={className}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
  >
    <circle cx="12" cy="8" r="4" />
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M4.5 21a7.5 7.5 0 0 1 15 0"
    />
  </svg>
);

const ChevronIcon = ({ className }: IconProps) => (
  <svg
    aria-hidden="true"
    className={className}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
  >
    <path strokeLinecap="round" strokeLinejoin="round" d="m8 10 4 4 4-4" />
  </svg>
);

const ArrowIcon = ({ className }: IconProps) => (
  <svg
    aria-hidden="true"
    className={className}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
  >
    <path strokeLinecap="round" strokeLinejoin="round" d="m9 18 6-6-6-6" />
  </svg>
);

const getStoredUser = (): AuthUser | null => {
  const token = localStorage.getItem("authToken");
  const storedUser = localStorage.getItem("authUser");

  if (!token || !storedUser) return null;

  try {
    return JSON.parse(storedUser) as AuthUser;
  } catch {
    localStorage.removeItem("authUser");
    return null;
  }
};

function NavBar() {
  const navigate = useNavigate();
  const categoryRail = useRef<HTMLDivElement>(null);
  const accountDropdown = useRef<HTMLDetailsElement>(null);
  const searchForm = useRef<HTMLFormElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const [authenticatedUser, setAuthenticatedUser] = useState<AuthUser | null>(
    getStoredUser,
  );
  const authenticatedUserName =
    typeof authenticatedUser?.name === "string" ? authenticatedUser.name : "";
  const [isSigningOut, setIsSigningOut] = useState(false);
  const [categories, setCategories] = useState<HomeCategory[]>([]);
  const [categoriesLoading, setCategoriesLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchOpen, setSearchOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    let isCurrent = true;

    const loadCategories = async () => {
      try {
        const result = await fetchCategories();

        if (!result.success) {
          throw new Error(result.message || "Unable to load categories");
        }

        if (isCurrent) setCategories(result.categories);
      } catch (error) {
        console.error("Unable to load navigation categories", error);
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
    const syncAuthenticatedUser = () => setAuthenticatedUser(getStoredUser());

    window.addEventListener("auth-changed", syncAuthenticatedUser);
    window.addEventListener("storage", syncAuthenticatedUser);

    return () => {
      window.removeEventListener("auth-changed", syncAuthenticatedUser);
      window.removeEventListener("storage", syncAuthenticatedUser);
    };
  }, []);

  useEffect(() => {
    const clickOut = (event: PointerEvent) => {
      const dropdown = accountDropdown.current;

      if (dropdown && !dropdown.contains(event.target as Node)) {
        dropdown.removeAttribute("open");
      }

      if (
        searchForm.current &&
        !searchForm.current.contains(event.target as Node)
      ) {
        setSearchOpen(false);
      }
    };

    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setSearchOpen(false);
        setMobileMenuOpen(false);
      }
    };

    document.addEventListener("pointerdown", clickOut);
    document.addEventListener("keydown", closeOnEscape);

    return () => {
      document.removeEventListener("pointerdown", clickOut);
      document.removeEventListener("keydown", closeOnEscape);
    };
  }, []);

  const updateScrollButtons = () => {
    const rail = categoryRail.current;
    if (!rail) return;

    setCanScrollLeft(rail.scrollLeft > 2);
    setCanScrollRight(
      rail.scrollLeft + rail.clientWidth < rail.scrollWidth - 2,
    );
  };

  useEffect(() => {
    const rail = categoryRail.current;
    if (!rail) return;

    updateScrollButtons();
    const observer = new ResizeObserver(updateScrollButtons);
    observer.observe(rail);
    window.addEventListener("resize", updateScrollButtons);

    return () => {
      observer.disconnect();
      window.removeEventListener("resize", updateScrollButtons);
    };
  }, [categories]);

  const scrollCategories = (direction: "left" | "right") => {
    categoryRail.current?.scrollBy({
      left: direction === "left" ? -320 : 320,
      behavior: "smooth",
    });
  };

  const normalizedSearch = searchQuery.trim().toLowerCase();
  const searchResults: ServiceSearchResult[] = normalizedSearch
    ? categories.flatMap((category) => [
        ...(category.name.toLowerCase().includes(normalizedSearch)
          ? [{ title: category.name, categoryId: category.id }]
          : []),
        ...(category.services ?? [])
          .filter((service) => service.toLowerCase().includes(normalizedSearch))
          .map((service) => ({
            title: service,
            categoryId: category.id,
            service,
          })),
      ])
    : [];
  const selectSearchResult = (result: ServiceSearchResult) => {
    const serviceQuery = result.service
      ? `?service=${encodeURIComponent(result.service)}`
      : "";
    navigate(`/services/${result.categoryId}${serviceQuery}`);
    setSearchQuery("");
    setSearchOpen(false);
  };

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
      setAuthenticatedUser(null);
      window.dispatchEvent(new Event("auth-changed"));
      accountDropdown.current?.removeAttribute("open");
      setIsSigningOut(false);
      navigate("/login", { replace: true });
    }
  };

  return (
    <header className="sticky top-0 z-40 border-b border-(--color-border)/80 bg-[rgba(242,243,250,0.9)] text-(--color-ink) shadow-[0_8px_28px_rgba(32,33,88,0.08)] backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl flex-wrap items-center gap-4 px-4 py-4 sm:px-6 lg:flex-nowrap lg:px-8">
        <Link
          to="/"
          className="flex shrink-0 items-center gap-0.5 rounded-lg focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-(--color-primary)"
          aria-label="Msaidizi Diaspora home"
        >
          <img
            src={msaidiziLogo}
            alt=""
            className="h-14 w-14 shrink-0 object-contain sm:h-16 sm:w-16"
          />
          <span className="text-xl font-extrabold tracking-tight sm:text-2xl">
            Msaidizi <span className="text-(--color-primary)">Diaspora</span>
          </span>
        </Link>

        <form
          ref={searchForm}
          className="order-3 relative flex w-full min-w-0 items-center rounded-(--radius-medium) bg-(--color-background) p-1.5 ring-1 ring-inset ring-(--color-border) transition focus-within:ring-2 focus-within:ring-(--color-primary) lg:order-0 lg:mx-auto lg:max-w-2xl"
          role="search"
          onSubmit={(event) => {
            event.preventDefault();
            if (searchResults[0]) selectSearchResult(searchResults[0]);
          }}
        >
          <SearchIcon className="ml-3 h-5 w-5 shrink-0 text-(--color-muted)" />
          <label className="sr-only" htmlFor="service-search">
            Search services
          </label>
          <input
            id="service-search"
            name="search"
            type="search"
            value={searchQuery}
            onFocus={() => setSearchOpen(true)}
            onChange={(event) => {
              setSearchQuery(event.target.value);
              setSearchOpen(true);
            }}
            placeholder="Search services"
            autoComplete="off"
            aria-autocomplete="list"
            aria-expanded={searchOpen && normalizedSearch.length > 0}
            aria-controls="service-search-results"
            className="min-w-0 flex-1 bg-transparent px-3 py-2 text-sm outline-none placeholder:text-(--color-muted) sm:text-base"
          />
          {searchOpen && normalizedSearch && (
            <div
              id="service-search-results"
              role="listbox"
              aria-label="Matching services"
              className="absolute inset-x-0 top-[calc(100%+0.5rem)] z-50 overflow-hidden rounded-(--radius-medium) border border-(--color-border) bg-(--color-surface) py-1 shadow-(--shadow-soft)"
            >
              {categoriesLoading ? (
                <p className="px-4 py-3 text-sm text-(--color-muted)">
                  Loading services...
                </p>
              ) : searchResults.length ? (
                searchResults.map((result, index) => (
                  <button
                    key={`${result.categoryId}-${result.service ?? "category"}-${result.title}-${index}`}
                    type="button"
                    role="option"
                    aria-selected="false"
                    onClick={() => selectSearchResult(result)}
                    className="block w-full px-4 py-3 text-left text-sm font-semibold text-(--color-ink) transition hover:bg-(--color-background) hover:text-(--color-primary) focus-visible:bg-(--color-background) focus-visible:outline-none"
                  >
                    {result.title}
                  </button>
                ))
              ) : (
                <p className="px-4 py-3 text-sm text-(--color-muted)">
                  No matching services found.
                </p>
              )}
            </div>
          )}
        </form>

        <button
          type="button"
          aria-expanded={mobileMenuOpen}
          aria-controls="mobile-service-menu"
          aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
          onClick={() => setMobileMenuOpen((isOpen) => !isOpen)}
          className="ml-auto grid h-10 w-10 shrink-0 place-items-center rounded-lg text-(--color-primary) transition hover:bg-(--color-background) focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(--color-primary) lg:hidden"
        >
          {mobileMenuOpen ? (
            <X className="h-6 w-6" aria-hidden="true" />
          ) : (
            <Menu className="h-6 w-6" aria-hidden="true" />
          )}
        </button>

        <details
          ref={accountDropdown}
          className="group relative z-50 shrink-0 lg:ml-auto"
        >
          <summary className="flex cursor-pointer list-none items-center gap-2 rounded-lg px-2 py-2 font-semibold transition hover:bg-(--color-background) focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(--color-primary) [&::-webkit-details-marker]:hidden">
            {authenticatedUser ? (
              <span className="grid h-8 w-8 place-items-center rounded-full bg-(--color-primary) text-sm font-black uppercase text-white">
                {authenticatedUserName.trim().charAt(0) || "A"}
              </span>
            ) : (
              <UserIcon className="h-6 w-6 text-(--color-primary)" />
            )}
            <span className="hidden max-w-36 truncate sm:inline">
              {authenticatedUserName || "Account"}
            </span>
            <ChevronIcon className="h-4 w-4 transition-transform group-open:rotate-180" />
          </summary>
          <div className="absolute right-0 z-50 top-[calc(100%+0.5rem)] w-64 overflow-hidden rounded-(--radius-medium) border border-(--color-border) bg-(--color-surface) p-2 shadow-(--shadow-soft)">
            {authenticatedUser ? (
              <>
                <div className="border-b border-(--color-border) px-4 py-3">
                  <p className="truncate text-sm font-extrabold text-(--color-ink)">
                    {authenticatedUserName || "Account"}
                  </p>
                  <p className="mt-0.5 truncate text-xs text-(--color-muted)">
                    {authenticatedUser.email}
                  </p>
                </div>
                <Link
                  to="/account"
                  onClick={() => accountDropdown.current?.removeAttribute("open")}
                  className="mt-1 block rounded-lg px-4 py-2.5 text-sm font-medium hover:bg-(--color-background) hover:text-(--color-primary)"
                >
                  My account
                </Link>
                <button
                  type="button"
                  onClick={handleSignOut}
                  disabled={isSigningOut}
                  className="mt-1 flex w-full items-center gap-2 border-t border-(--color-border) px-4 py-3 text-left text-sm font-bold text-red-600 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  <LogOut className="h-4 w-4" />
                  {isSigningOut ? "Signing out..." : "Sign out"}
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  onClick={() => accountDropdown.current?.removeAttribute("open")}
                  className="block rounded-lg px-4 py-2.5 text-sm font-medium hover:bg-(--color-background) hover:text-(--color-primary)"
                >
                  Sign in
                </Link>
                <Link
                  to="/register"
                  onClick={() => accountDropdown.current?.removeAttribute("open")}
                  className="block rounded-lg px-4 py-2.5 text-sm font-medium hover:bg-(--color-background) hover:text-(--color-primary)"
                >
                  Create account
                </Link>
              </>
            )}
          </div>
        </details>
      </div>

      {mobileMenuOpen && (
        <nav
          id="mobile-service-menu"
          aria-label="Mobile services and information"
          className="border-t border-(--color-border) bg-(--color-surface) px-4 py-3 shadow-lg lg:hidden sm:px-6"
        >
          <div className="mx-auto grid max-w-7xl gap-1">
            {featuredServiceLinks.map(({ label, to }) => (
              <Link
                key={to}
                to={to}
                onClick={() => setMobileMenuOpen(false)}
                className="rounded-lg px-4 py-3 text-sm font-semibold text-(--color-ink) transition hover:bg-(--color-background) hover:text-(--color-primary) focus-visible:outline-2 focus-visible:outline-(--color-primary)"
              >
                {label}
              </Link>
            ))}
            {categoriesLoading && categories.length === 0 && (
              <p className="px-4 py-3 text-sm text-(--color-muted)">
                Loading services...
              </p>
            )}
            {categories.map(({ id, name }) => (
              <Link
                key={id}
                to={`/services/${id}`}
                onClick={() => setMobileMenuOpen(false)}
                className="rounded-lg px-4 py-3 text-sm font-semibold text-(--color-ink) transition hover:bg-(--color-background) hover:text-(--color-primary) focus-visible:outline-2 focus-visible:outline-(--color-primary)"
              >
                {name}
              </Link>
            ))}
            <Link
              to="/how-it-works"
              onClick={() => setMobileMenuOpen(false)}
              className="rounded-lg px-4 py-3 text-sm font-semibold text-(--color-ink) transition hover:bg-(--color-background) hover:text-(--color-primary) focus-visible:outline-2 focus-visible:outline-(--color-primary)"
            >
              How It Works
            </Link>
          </div>
        </nav>
      )}

      <nav
        className="relative z-0 hidden border-t border-white/15 bg-(--color-accent) text-white lg:block"
        aria-label="Services and information"
      >
        <div className="relative mx-auto flex max-w-7xl items-center px-4 sm:px-6 lg:px-8">
          {featuredServiceLinks.map(({ label, to }) => (
            <Link
              key={to}
              to={to}
              className="mr-1 shrink-0 whitespace-nowrap rounded-lg px-3 py-2.5 text-sm font-semibold text-white/90 transition hover:bg-white/10 hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
            >
              {label}
            </Link>
          ))}
          {canScrollLeft && (
            <button
              type="button"
              onClick={() => scrollCategories("left")}
              className="absolute left-2 z-10 grid h-9 w-9 place-items-center rounded-full border border-white/35 bg-white/10 text-white shadow-md transition hover:bg-white hover:text-(--color-primary) focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white sm:left-4"
              aria-label="Show previous service categories"
            >
              <ArrowIcon className="h-4 w-4 rotate-180" />
            </button>
          )}

          <div
            ref={categoryRail}
            onScroll={updateScrollButtons}
            className="scrollbar-none flex w-full snap-x gap-1 overflow-x-auto py-2"
          >
            {categoriesLoading && categories.length === 0 && (
              <span className="px-4 py-2.5 text-sm font-semibold text-white/75">
                Loading services...
              </span>
            )}
            {!categoriesLoading && categories.length === 0 && (
              <Link
                to="/services"
                className="rounded-lg px-4 py-2.5 text-sm font-semibold text-white hover:bg-white/10"
              >
                Browse all services
              </Link>
            )}
            {categories.map(({ id, name }) => (
              <Link
                key={id}
                to={`/services/${id}`}
                className="flex shrink-0 snap-start items-center whitespace-nowrap rounded-lg px-4 py-2.5 text-sm font-semibold text-white/90 transition hover:bg-white/10 hover:text-white focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-white"
              >
                {name}
              </Link>
            ))}
          </div>

          {canScrollRight && (
            <button
              type="button"
              onClick={() => scrollCategories("right")}
              className="absolute right-2 z-10 grid h-9 w-9 place-items-center rounded-full border border-white/35 bg-white/10 text-white shadow-md transition hover:bg-white hover:text-(--color-primary) focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white sm:right-4"
              aria-label="Show more service categories"
            >
              <ArrowIcon className="h-4 w-4" />
            </button>
          )}
        </div>

      </nav>
    </header>
  );
}

export default NavBar;
