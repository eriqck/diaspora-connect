import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  Pause,
  Play,
} from "lucide-react";
import {
  fetchCategories,
  type HomeCategory,
} from "../../apiservices/HomeService";
import welcomeHeroImage from "../../assets/welcome-hero.png";
import ServiceDetailsDialog from "./ServiceDetailsDialog";

const AUTOPLAY_MS = 7000;

function Hero() {
  const [categories, setCategories] = useState<HomeCategory[]>([]);
  const [categoriesLoading, setCategoriesLoading] = useState(true);
  const [categoriesError, setCategoriesError] = useState<string | null>(null);
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const [userPaused, setUserPaused] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [serviceDetails, setServiceDetails] = useState<{
    category: HomeCategory;
    service: string;
  } | null>(null);

  const total = categories.length + 1;

  const goTo = useCallback(
    (i: number) => {
      if (total > 0) setIndex((i + total) % total);
    },
    [total],
  );
  const next = useCallback(() => goTo(index + 1), [goTo, index]);
  const prev = useCallback(() => goTo(index - 1), [goTo, index]);

  useEffect(() => {
    let isCurrent = true;

    const loadCategories = async () => {
      try {
        const result = await fetchCategories();

        if (!result.success) {
          throw new Error(result.message || "Unable to load service categories.");
        }

        if (isCurrent) setCategories(result.categories);
      } catch (loadError) {
        if (isCurrent) {
          setCategoriesError(
            loadError instanceof Error
              ? loadError.message
              : "Unable to load service categories.",
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

  // Respect the visitor's reduced-motion setting: no autoplay in that case.
  useEffect(() => {
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReducedMotion(query.matches);
    const onChange = (e: MediaQueryListEvent) => setReducedMotion(e.matches);
    query.addEventListener("change", onChange);
    return () => query.removeEventListener("change", onChange);
  }, []);

  const autoplay = !paused && !userPaused && !reducedMotion;

  useEffect(() => {
    if (!autoplay) return;
    const timer = window.setTimeout(next, AUTOPLAY_MS);
    return () => window.clearTimeout(timer);
  }, [autoplay, next]);

  return (
    <section
      className="bg-(--color-background)"
      aria-labelledby="hero-heading"
    >
      <h1 id="hero-heading" className="sr-only">
        Welcome to Msaidizi Diaspora
      </h1>

      <div
        role="region"
        aria-roledescription="carousel"
        aria-label="Msaidizi Diaspora introduction and services"
        className="relative overflow-hidden bg-(--color-accent) text-white"
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
        onFocus={() => setPaused(true)}
        onBlur={() => setPaused(false)}
        onKeyDown={(e) => {
          if (e.key === "ArrowRight") next();
          if (e.key === "ArrowLeft") prev();
        }}
      >

        {/* Slide track */}
        <div
          className="flex transition-transform duration-700 ease-out motion-reduce:transition-none"
          style={{ transform: `translateX(-${index * 100}%)` }}
          aria-live={autoplay ? "off" : "polite"}
        >
          <div
            role="group"
            aria-roledescription="slide"
            aria-label={`1 of ${total}: Welcome to Msaidizi Diaspora`}
            aria-hidden={index !== 0}
            className="relative flex min-h-[min(760px,85svh)] w-full shrink-0 items-center overflow-hidden px-7 pb-28 pt-16 sm:px-10 lg:px-14 lg:pb-32"
          >
            <img
              src={welcomeHeroImage}
              alt=""
              aria-hidden="true"
              fetchPriority="high"
              className="absolute inset-0 h-full w-full object-cover"
            />
            <div
              aria-hidden="true"
              className="absolute inset-0 bg-[linear-gradient(90deg,rgba(25,26,75,0.88)_0%,rgba(31,32,89,0.7)_52%,rgba(31,32,89,0.35)_100%)]"
            />
            <div className="relative z-10 w-full max-w-4xl">
              <h2 className="max-w-3xl text-4xl font-medium leading-[1.08] tracking-tight sm:text-5xl lg:text-7xl">
                Welcome to Msaidizi Diaspora
              </h2>
              <h3 className="mt-6 max-w-3xl text-xl font-bold leading-tight tracking-tight sm:text-2xl lg:text-3xl">
                Your Trusted On-Ground Partner Back Home
              </h3>
              <p className="mt-4 max-w-3xl text-base leading-7 text-white/85 sm:text-lg sm:leading-8">
                We deliver total peace of mind so you can focus on your life
                abroad while your investments, projects, and affairs are
                managed seamlessly at home. True to our name, we are dedicated
                to handling your every need with absolute integrity,
                uncompromising transparency, and on-time execution. Count on us
                for dependable, seamless service and results you can count on
                every step of the way.
              </p>
              {categoriesLoading && (
                <p className="mt-4 text-sm text-white/70" role="status">
                  Loading service categories...
                </p>
              )}
              {categoriesError && (
                <p className="mt-4 text-sm text-white" role="alert">
                  {categoriesError}
                </p>
              )}
              {!categoriesLoading && !categoriesError && categories.length === 0 && (
                <p className="mt-4 text-sm text-white/70">
                  No service categories are available.
                </p>
              )}
              <div className="mt-8 flex flex-wrap items-center gap-x-10 gap-y-4">
                <Link
                  to="/services"
                  tabIndex={index === 0 ? 0 : -1}
                  className="inline-flex items-center gap-2 rounded-full border-2 border-white bg-(--color-secondary) px-7 py-4 font-bold text-white shadow-[0_8px_24px_rgba(0,0,0,0.3)] transition hover:-translate-y-0.5 hover:bg-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
                >
                  Browse our services
                  <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </Link>
                <Link
                  to="/how-it-works"
                  tabIndex={index === 0 ? 0 : -1}
                  className="inline-flex items-center gap-2 rounded-full border-2 border-white bg-white px-7 py-4 font-bold text-black shadow-[0_8px_24px_rgba(0,0,0,0.3)] transition hover:-translate-y-0.5 hover:bg-white/90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
                  style={{ color: "#000000" }}
                >
                  How It Works
                </Link>
              </div>
            </div>
          </div>
          {categories.map((category, i) => {
            const active = i + 1 === index;
            return (
              <div
                key={category.id}
                role="group"
                aria-roledescription="slide"
                aria-label={`${i + 2} of ${total}: ${category.name}`}
                aria-hidden={!active}
                className="relative flex min-h-[min(760px,85svh)] w-full shrink-0 items-center px-7 pb-28 pt-16 sm:px-10 lg:px-14 lg:pb-32"
              >
                {category.image && (
                  <img
                    src={category.image}
                    alt=""
                    aria-hidden="true"
                    loading={i === 0 ? "eager" : "lazy"}
                    className="absolute inset-0 h-full w-full object-cover"
                  />
                )}
                <div
                  aria-hidden="true"
                  className="absolute inset-0 bg-[linear-gradient(90deg,rgba(25,26,75,0.94)_0%,rgba(31,32,89,0.82)_52%,rgba(31,32,89,0.36)_100%)]"
                />
                <div className="relative z-10 w-full max-w-4xl">
                  <p className="text-xs font-bold uppercase tracking-[0.22em] text-white/75 sm:text-sm">
                    Trusted support for your life back home
                  </p>
                  <h2 className="mt-5 max-w-3xl text-4xl font-medium leading-[1.08] tracking-tight sm:text-5xl lg:text-7xl">
                    {category.name}, handled with care.
                  </h2>

                  <div className="mt-7 flex flex-wrap gap-3">
                    {(category.services ?? []).map((service) => (
                      <div
                        key={service}
                        className="inline-flex items-center gap-3 rounded-full border border-white/35 bg-white/5 py-1.5 pl-3 pr-1.5"
                      >
                        <span className="text-sm font-semibold text-white/90 sm:text-base">
                          {service}
                        </span>
                        <button
                          type="button"
                          tabIndex={active ? 0 : -1}
                          onClick={() => setServiceDetails({ category, service })}
                          className="rounded-full bg-white px-3 py-1 text-xs font-extrabold text-(--color-primary-dark) transition hover:bg-(--color-secondary) hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
                        >
                          Details
                        </button>
                      </div>
                    ))}
                  </div>

                  <div className="mt-9 flex flex-wrap items-center gap-x-10 gap-y-4">
                    <Link
                      to={`/services/${category.id}`}
                      tabIndex={active ? 0 : -1}
                      className="inline-flex items-center gap-2 rounded-full border-2 border-white bg-(--color-secondary) px-7 py-4 font-bold text-white shadow-[0_8px_24px_rgba(0,0,0,0.3)] transition hover:-translate-y-0.5 hover:bg-white hover:text-(--color-secondary) focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
                    >
                      Request this service
                      <ArrowRight className="h-4 w-4" aria-hidden="true" />
                    </Link>
                    <Link
                      to="/how-it-works"
                      tabIndex={active ? 0 : -1}
                      className="inline-flex items-center gap-2 rounded-full border-2 border-white bg-white px-7 py-4 font-bold text-black shadow-[0_8px_24px_rgba(0,0,0,0.3)] transition hover:-translate-y-0.5 hover:bg-white/90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
                      style={{ color: "#000000" }}
                    >
                      How It Works
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Controls */}
        <div className="absolute inset-x-0 bottom-0 z-10 flex items-center justify-between gap-4 px-7 pb-6 sm:px-10 lg:px-14">
          <div className="flex items-center gap-2" role="tablist" aria-label="Choose a hero slide">
            <button
              type="button"
              role="tab"
              aria-selected={index === 0}
              aria-label="Show Welcome to Msaidizi Diaspora"
              onClick={() => goTo(0)}
              className={`h-2.5 rounded-full transition-all focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white ${
                index === 0 ? "w-8 bg-(--color-secondary)" : "w-2.5 bg-white/50 hover:bg-white"
              }`}
            />
            {categories.map((category, i) => (
              <button
                key={category.id}
                type="button"
                role="tab"
                aria-selected={i + 1 === index}
                aria-label={`Show ${category.name}`}
                onClick={() => goTo(i + 1)}
                className={`h-2.5 rounded-full transition-all focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white ${
                  i + 1 === index ? "w-8 bg-(--color-secondary)" : "w-2.5 bg-white/50 hover:bg-white"
                }`}
              />
            ))}
          </div>

          <div className="flex items-center gap-2">
            {!reducedMotion && (
              <button
                type="button"
                onClick={() => setUserPaused((p) => !p)}
                aria-label={userPaused ? "Start slideshow" : "Pause slideshow"}
                className="grid h-10 w-10 place-items-center rounded-full border border-white/30 text-white transition hover:border-white hover:bg-white hover:text-(--color-accent) focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
              >
                {userPaused ? (
                  <Play className="h-4 w-4" aria-hidden="true" />
                ) : (
                  <Pause className="h-4 w-4" aria-hidden="true" />
                )}
              </button>
            )}
            <button
              type="button"
              onClick={prev}
              aria-label="Previous slide"
              className="grid h-10 w-10 place-items-center rounded-full border border-white/30 text-white transition hover:border-(--color-secondary) hover:bg-(--color-secondary) focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
            >
              <ChevronLeft className="h-5 w-5" aria-hidden="true" />
            </button>
            <button
              type="button"
              onClick={next}
              aria-label="Next slide"
              className="grid h-10 w-10 place-items-center rounded-full border border-white/30 text-white transition hover:border-(--color-secondary) hover:bg-(--color-secondary) focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
            >
              <ChevronRight className="h-5 w-5" aria-hidden="true" />
            </button>
          </div>
        </div>
      </div>
      {serviceDetails && (
        <ServiceDetailsDialog
          category={serviceDetails.category.name}
          service={serviceDetails.service}
          requestHref={`/services/${serviceDetails.category.id}?service=${encodeURIComponent(serviceDetails.service)}`}
          onClose={() => setServiceDetails(null)}
        />
      )}
    </section>
  );
}

export default Hero;