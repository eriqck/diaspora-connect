import { useEffect, useRef, useState } from "react";
import { ImageIcon, LogOut } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { logoutUser } from "../../apiservices/AuthService";
import {
  fetchCategories,
  type HomeCategory,
} from "../../apiservices/HomeService";
import type { AuthUser } from "../../formtypes/AuthTypes";

type IconProps = { className?: string };

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

const MenuImage = ({
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
        className={`${className} grid place-items-center bg-(--color-background) text-(--color-muted)`}
        aria-hidden="true"
      >
        <ImageIcon className="h-6 w-6" />
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
  const submenuCloseTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const [authenticatedUser, setAuthenticatedUser] = useState<AuthUser | null>(
    getStoredUser,
  );
  const [isSigningOut, setIsSigningOut] = useState(false);
  const [categories, setCategories] = useState<HomeCategory[]>([]);
  const [categoriesLoading, setCategoriesLoading] = useState(true);
  const [openCategory, setOpenCategory] = useState<{
    id: number;
    top: number;
  } | null>(null);

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
        !(event.target instanceof Element) ||
        !event.target.closest("[data-service-menu]")
      ) {
        setOpenCategory(null);
      }
    };

    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpenCategory(null);
    };

    document.addEventListener("pointerdown", clickOut);
    document.addEventListener("keydown", closeOnEscape);

    return () => {
      document.removeEventListener("pointerdown", clickOut);
      document.removeEventListener("keydown", closeOnEscape);
      if (submenuCloseTimer.current) clearTimeout(submenuCloseTimer.current);
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
    setOpenCategory(null);
    categoryRail.current?.scrollBy({
      left: direction === "left" ? -320 : 320,
      behavior: "smooth",
    });
  };

  const openCategoryMenu = (
    id: number,
    button: HTMLButtonElement,
  ) => {
    if (submenuCloseTimer.current) clearTimeout(submenuCloseTimer.current);

    const buttonBounds = button.getBoundingClientRect();

    setOpenCategory({
      id,
      top: buttonBounds.bottom + 8,
    });
  };

  const scheduleSubmenuClose = () => {
    if (submenuCloseTimer.current) clearTimeout(submenuCloseTimer.current);

    submenuCloseTimer.current = setTimeout(() => {
      setOpenCategory(null);
    }, 150);
  };

  const keepSubmenuOpen = () => {
    if (submenuCloseTimer.current) clearTimeout(submenuCloseTimer.current);
  };

  const activeCategory = categories.find(
    ({ id }) => id === openCategory?.id,
  );

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
    <header className="relative z-30 border-b border-(--color-border) bg-(--color-surface) text-(--color-ink) shadow-[0_6px_20px_rgba(30,58,138,0.07)]">
      <div className="mx-auto flex max-w-7xl flex-wrap items-center gap-4 px-4 py-4 sm:px-6 lg:flex-nowrap lg:px-8">
        <Link
          to="/"
          className="flex shrink-0 items-center gap-2.5 rounded-lg focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-(--color-primary)"
          aria-label="Diaspora Help home"
        >
          <span className="text-xl font-extrabold tracking-tight sm:text-2xl">
            Diaspora <span className="text-(--color-primary)">Help</span>
          </span>
        </Link>

        <form
          className="order-3 flex w-full min-w-0 items-center rounded-(--radius-medium) bg-(--color-background) p-1.5 ring-1 ring-inset ring-(--color-border) transition focus-within:ring-2 focus-within:ring-(--color-primary) lg:order-0 lg:mx-auto lg:max-w-2xl"
          role="search"
          onSubmit={(event) => event.preventDefault()}
        >
          <SearchIcon className="ml-3 h-5 w-5 shrink-0 text-(--color-muted)" />
          <label className="sr-only" htmlFor="service-search">
            Search services
          </label>
          <input
            id="service-search"
            name="search"
            type="search"
            placeholder="Search services and locations"
            className="min-w-0 flex-1 bg-transparent px-3 py-2 text-sm outline-none placeholder:text-(--color-muted) sm:text-base"
          />
          <button
            type="submit"
            className="rounded-(--radius-small) bg-(--color-secondary) px-5 py-2 text-sm font-bold text-(--color-ink) transition hover:bg-(--color-primary) hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(--color-primary) sm:px-7"
          >
            Search
          </button>
        </form>

        <details
          ref={accountDropdown}
          className="group relative z-50 ml-auto shrink-0"
        >
          <summary className="flex cursor-pointer list-none items-center gap-2 rounded-lg px-2 py-2 font-semibold transition hover:bg-(--color-background) focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(--color-primary) [&::-webkit-details-marker]:hidden">
            {authenticatedUser ? (
              <span className="grid h-8 w-8 place-items-center rounded-full bg-(--color-primary) text-sm font-black uppercase text-white">
                {authenticatedUser.name.charAt(0)}
              </span>
            ) : (
              <UserIcon className="h-6 w-6 text-(--color-primary)" />
            )}
            <span className="hidden max-w-36 truncate sm:inline">
              {authenticatedUser?.name ?? "Account"}
            </span>
            <ChevronIcon className="h-4 w-4 transition-transform group-open:rotate-180" />
          </summary>
          <div className="absolute right-0 z-50 top-[calc(100%+0.5rem)] w-64 overflow-hidden rounded-(--radius-medium) border border-(--color-border) bg-(--color-surface) p-2 shadow-(--shadow-soft)">
            {authenticatedUser ? (
              <>
                <div className="border-b border-(--color-border) px-4 py-3">
                  <p className="truncate text-sm font-extrabold text-(--color-ink)">
                    {authenticatedUser.name}
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

      <nav
        className="relative z-0 border-t border-(--color-border)"
        aria-label="Service categories"
      >
        <div className="relative mx-auto flex max-w-7xl items-center px-4 sm:px-6 lg:px-8">
          {canScrollLeft && (
            <button
              type="button"
              onClick={() => scrollCategories("left")}
              className="absolute left-2 z-10 grid h-9 w-9 place-items-center rounded-full border border-(--color-border) bg-(--color-surface) text-(--color-primary) shadow-md transition hover:bg-(--color-primary) hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(--color-primary) sm:left-4"
              aria-label="Show previous service categories"
            >
              <ArrowIcon className="h-4 w-4 rotate-180" />
            </button>
          )}

          <div
            ref={categoryRail}
            onScroll={() => {
              updateScrollButtons();
              setOpenCategory(null);
            }}
            className="scrollbar-none flex w-full snap-x gap-1 overflow-x-auto py-2"
          >
            {categoriesLoading && categories.length === 0 && (
              <span className="px-4 py-2.5 text-sm font-semibold text-(--color-muted)">
                Loading services...
              </span>
            )}
            {!categoriesLoading && categories.length === 0 && (
              <Link
                to="/services"
                className="rounded-lg px-4 py-2.5 text-sm font-semibold text-(--color-primary) hover:bg-(--color-background)"
              >
                Browse all services
              </Link>
            )}
            {categories.map(({ id, name, image }) => (
              <button
                key={id}
                type="button"
                data-service-menu
                onMouseEnter={(event) => openCategoryMenu(id, event.currentTarget)}
                onMouseLeave={scheduleSubmenuClose}
                onFocus={(event) => openCategoryMenu(id, event.currentTarget)}
                onClick={(event) => openCategoryMenu(id, event.currentTarget)}
                aria-expanded={openCategory?.id === id}
                aria-controls="service-submenu"
                className="flex shrink-0 snap-start items-center gap-2 whitespace-nowrap rounded-lg px-4 py-2.5 text-sm font-semibold text-(--color-ink) transition hover:bg-(--color-background) hover:text-(--color-primary) focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-(--color-primary)"
              >
                <MenuImage
                  src={image}
                  alt=""
                  className="h-7 w-7 shrink-0 rounded-md"
                />
                {name}
                <ChevronIcon
                  className={`h-3.5 w-3.5 transition-transform ${
                    openCategory?.id === id ? "rotate-180" : ""
                  }`}
                />
              </button>
            ))}
          </div>

          {canScrollRight && (
            <button
              type="button"
              onClick={() => scrollCategories("right")}
              className="absolute right-2 z-10 grid h-9 w-9 place-items-center rounded-full border border-(--color-border) bg-(--color-surface) text-(--color-primary) shadow-md transition hover:bg-(--color-primary) hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(--color-primary) sm:right-4"
              aria-label="Show more service categories"
            >
              <ArrowIcon className="h-4 w-4" />
            </button>
          )}
        </div>

        {openCategory && activeCategory && (
          <div
            id="service-submenu"
            data-service-menu
            onMouseEnter={keepSubmenuOpen}
            onMouseLeave={scheduleSubmenuClose}
            className="fixed inset-x-0 z-50 overflow-y-auto border-y border-(--color-border) bg-(--color-surface) shadow-[0_24px_50px_rgba(15,23,42,0.18)]"
            style={{
              top: openCategory.top,
              maxHeight: `calc(100vh - ${openCategory.top + 8}px)`,
            }}
          >
            <div className="mx-auto grid max-w-7xl gap-6 px-4 py-6 sm:px-6 lg:grid-cols-[minmax(240px,0.8fr)_2.2fr] lg:px-8 lg:py-8">
              <section className="overflow-hidden rounded-(--radius-medium) bg-(--color-background)">
                <MenuImage
                  src={activeCategory.image}
                  alt={activeCategory.name}
                  className="aspect-16/8 w-full lg:aspect-4/3"
                />
                <div className="p-5">
                  <p className="text-xs font-extrabold uppercase tracking-[0.14em] text-(--color-primary)">
                    Service category
                  </p>
                  <h2 className="mt-2 text-xl font-black text-(--color-ink)">
                    {activeCategory.name}
                  </h2>
                  <p className="mt-2 text-sm leading-6 text-(--color-muted)">
                    {activeCategory.description ||
                      `Explore trusted ${activeCategory.name.toLowerCase()} services.`}
                  </p>
                  <Link
                    to={`/services?category=${activeCategory.id}`}
                    onClick={() => setOpenCategory(null)}
                    className="mt-4 inline-flex items-center gap-2 text-sm font-extrabold text-(--color-primary) hover:underline"
                  >
                    View all services
                    <ArrowIcon className="h-4 w-4" />
                  </Link>
                </div>
              </section>

              <section aria-labelledby="subcategory-heading">
                <div className="mb-4 flex items-end justify-between gap-4">
                  <div>
                    <p className="text-xs font-extrabold uppercase tracking-[0.14em] text-(--color-muted)">
                      Explore
                    </p>
                    <h3 id="subcategory-heading" className="mt-1 text-lg font-black">
                      {activeCategory.name} services
                    </h3>
                  </div>
                  <span className="text-sm text-(--color-muted)">
                    {activeCategory.sub_categories.length} options
                  </span>
                </div>

                {activeCategory.sub_categories.length > 0 ? (
                  <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
                    {activeCategory.sub_categories.map((subCategory) => (
                      <Link
                        key={subCategory.id}
                        to={`/services/${activeCategory.id}/${subCategory.id}`}
                        onClick={() => setOpenCategory(null)}
                        className="group/card flex min-w-0 gap-3 rounded-(--radius-medium) border border-(--color-border) p-3 transition hover:-translate-y-0.5 hover:border-(--color-primary) hover:shadow-md focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(--color-primary)"
                      >
                        <MenuImage
                          src={subCategory.image}
                          alt={subCategory.name}
                          className="h-20 w-24 shrink-0 rounded-lg"
                        />
                        <span className="min-w-0 py-1">
                          <span className="flex items-start justify-between gap-2 font-extrabold text-(--color-ink) group-hover/card:text-(--color-primary)">
                            <span>{subCategory.name}</span>
                            <ArrowIcon className="mt-0.5 h-4 w-4 shrink-0 text-(--color-muted)" />
                          </span>
                          <span className="mt-1 line-clamp-2 text-xs leading-5 text-(--color-muted)">
                            {subCategory.description ||
                              `Learn more about ${subCategory.name.toLowerCase()}.`}
                          </span>
                        </span>
                      </Link>
                    ))}
                  </div>
                ) : (
                  <div className="rounded-(--radius-medium) border border-dashed border-(--color-border) px-5 py-10 text-center text-sm text-(--color-muted)">
                    Services for this category are coming soon.
                  </div>
                )}
              </section>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}

export default NavBar;
