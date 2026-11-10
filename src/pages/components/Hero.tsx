import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  Check,
  ChevronLeft,
  ChevronRight,
  ImageIcon,
  Pause,
  Play,
} from "lucide-react";
import {
  fetchCategories,
  type HomeCategory,
} from "../../apiservices/HomeService";

const AUTOPLAY_MS = 7000;

function Hero() {
  const [categories, setCategories] = useState<HomeCategory[]>([]);
  const [categoriesLoading, setCategoriesLoading] = useState(true);
  const [categoriesError, setCategoriesError] = useState<string | null>(null);
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const [userPaused, setUserPaused] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);

  const total = categories.length;

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
      className="bg-(--color-background) px-4 py-5 sm:px-6 sm:py-7 lg:px-8"
      aria-labelledby="hero-heading"
    >
      <h1 id="hero-heading" className="sr-only">
        Services in Kenya, handled for you
      </h1>

      {categoriesLoading || categoriesError || categories.length === 0 ? (
        <div className="mx-auto max-w-360 rounded-[1.4rem] bg-[linear-gradient(115deg,var(--color-accent),var(--color-primary-dark)_75%)] px-7 py-12 text-white shadow-(--shadow-soft) sm:px-10 lg:px-14">
          <p role={categoriesError ? "alert" : "status"}>
            {categoriesLoading
              ? "Loading service categories..."
              : categoriesError || "No service categories are available."}
          </p>
        </div>
      ) : (
      <div
        role="region"
        aria-roledescription="carousel"
        aria-label="Service categories"
        className="relative mx-auto max-w-360 overflow-hidden rounded-[1.4rem] bg-[linear-gradient(115deg,var(--color-accent),var(--color-primary-dark)_75%)] text-white shadow-(--shadow-soft)"
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
        onFocus={() => setPaused(true)}
        onBlur={() => setPaused(false)}
        onKeyDown={(e) => {
          if (e.key === "ArrowRight") next();
          if (e.key === "ArrowLeft") prev();
        }}
      >

        {/* Decorative circles */}
        <div className="pointer-events-none absolute inset-0 opacity-20" aria-hidden="true">
          <div className="absolute -left-20 -top-28 h-80 w-80 rounded-full border-60 border-white/20" />
          <div className="absolute right-[18%] -top-36 h-72 w-72 rounded-full border-50 border-white/15" />
        </div>

        {/* Slide track */}
        <div
          className="flex transition-transform duration-700 ease-out motion-reduce:transition-none"
          style={{ transform: `translateX(-${index * 100}%)` }}
          aria-live={autoplay ? "off" : "polite"}
        >
          {categories.map((category, i) => {
            const active = i === index;
            return (
              <div
                key={category.id}
                role="group"
                aria-roledescription="slide"
                aria-label={`${i + 1} of ${total}: ${category.name}`}
                aria-hidden={!active}
                className="relative grid w-full shrink-0 items-center gap-8 px-7 pb-24 pt-12 sm:px-10 lg:min-h-130 lg:grid-cols-[1.05fr_0.95fr] lg:gap-14 lg:px-14 lg:pb-20 lg:pt-14"
              >
                {/* Text */}
                <div className="max-w-xl">
                  <span className="inline-block rounded-(--radius-pill) bg-(--color-secondary) px-4 py-1.5 text-xs font-black uppercase tracking-[0.14em] text-white">
                    Our services
                  </span>

                  <h2 className="mt-5 text-4xl font-black leading-[1.05] tracking-tight sm:text-5xl">
                    {category.name}
                  </h2>

                  <ul className="mt-6 space-y-3">
                    {(category.services ?? []).map((service) => (
                      <li key={service} className="flex items-start gap-3 text-base text-white/90 sm:text-lg">
                        <span className="mt-1 grid h-5 w-5 shrink-0 place-items-center rounded-full bg-white text-(--color-primary)">
                          <Check className="h-3.5 w-3.5 stroke-3" aria-hidden="true" />
                        </span>
                        <span>{service}</span>
                      </li>
                    ))}
                  </ul>

                  <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-3">
                    <Link
                      to={`/services/${category.id}`}
                      tabIndex={active ? 0 : -1}
                      className="inline-flex items-center gap-2 rounded-(--radius-small) bg-(--color-secondary) px-6 py-3.5 font-extrabold text-white shadow-lg transition hover:-translate-y-0.5 hover:bg-white hover:text-(--color-secondary) focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
                    >
                      Request this service <ArrowRight className="h-4 w-4" aria-hidden="true" />
                    </Link>
                    <a
                      href="#how-it-works"
                      tabIndex={active ? 0 : -1}
                      className="text-sm font-bold text-white/80 underline decoration-white/30 underline-offset-4 transition hover:text-white"
                    >
                      See how Diaspora Help works
                    </a>
                  </div>
                </div>

                {/* Image */}
                <div className="order-first lg:order-last">
                  <div className="relative mx-auto w-full max-w-md lg:max-w-none">
                    <div
                      aria-hidden="true"
                      className="absolute -inset-2 rotate-2 rounded-4xl bg-(--color-secondary)/80"
                    />
                    <div
                      aria-hidden="true"
                      className="absolute -inset-2 -rotate-2 rounded-4xl bg-(--color-primary)/80"
                    />
                    {category.image ? (
                      <img
                        src={category.image}
                        alt={`${category.name} services`}
                        loading={i === 0 ? "eager" : "lazy"}
                        className="relative h-56 w-full rounded-3xl border-4 border-white object-cover shadow-2xl sm:h-72 lg:h-96"
                      />
                    ) : (
                      <div
                        className="relative grid h-56 w-full place-items-center rounded-3xl border-4 border-white bg-white/10 text-white shadow-2xl sm:h-72 lg:h-96"
                        aria-hidden="true"
                      >
                        <ImageIcon className="h-12 w-12" />
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Controls */}
        <div className="absolute inset-x-0 bottom-0 z-10 flex items-center justify-between gap-4 px-7 pb-6 sm:px-10 lg:px-14">
          <div className="flex items-center gap-2" role="tablist" aria-label="Choose a category">
            {categories.map((category, i) => (
              <button
                key={category.id}
                type="button"
                role="tab"
                aria-selected={i === index}
                aria-label={`Show ${category.name}`}
                onClick={() => goTo(i)}
                className={`h-2.5 rounded-full transition-all focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white ${
                  i === index ? "w-8 bg-(--color-secondary)" : "w-2.5 bg-white/50 hover:bg-white"
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
              aria-label="Previous category"
              className="grid h-10 w-10 place-items-center rounded-full border border-white/30 text-white transition hover:border-(--color-secondary) hover:bg-(--color-secondary) focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
            >
              <ChevronLeft className="h-5 w-5" aria-hidden="true" />
            </button>
            <button
              type="button"
              onClick={next}
              aria-label="Next category"
              className="grid h-10 w-10 place-items-center rounded-full border border-white/30 text-white transition hover:border-(--color-secondary) hover:bg-(--color-secondary) focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
            >
              <ChevronRight className="h-5 w-5" aria-hidden="true" />
            </button>
          </div>
        </div>
      </div>
      )}
    </section>
  );
}

export default Hero;