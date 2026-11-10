import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Check, ImageIcon } from "lucide-react";
import {
  fetchCategories,
  type HomeCategory,
} from "../../apiservices/HomeService";

function Services() {

  const [categories, setCategories] = useState<HomeCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isCurrent = true;

    const loadCategories = async () => {
      try {
        const result = await fetchCategories();

        if (!result.success) {
          throw new Error(result.message || "Unable to load services.");
        }

        if (isCurrent) setCategories(result.categories);
      } catch (loadError) {
        if (isCurrent) {
          setError(
            loadError instanceof Error
              ? loadError.message
              : "Unable to load services.",
          );
        }
      } finally {
        if (isCurrent) setLoading(false);
      }
    };

    void loadCategories();

    return () => {
      isCurrent = false;
    };
  }, []);

    return (
    <section
      className="bg-(--color-background) text-(--color-ink)"
      aria-labelledby="services-heading"
    >
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8 lg:py-14">
        <div className="max-w-2xl">

          <h1
            id="services-heading"
            className="mt-1 text-3xl font-black tracking-tight sm:text-4xl"
          >
            Our Services
          </h1>

        </div>

        {/* Cards */}
        {loading ? (
          <p className="mt-8 text-(--color-muted)" role="status">
            Loading services...
          </p>
        ) : error ? (
          <p className="mt-8 text-(--color-muted)" role="alert">
            {error}
          </p>
        ) : (
          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {categories.map((category) => (
              <article
                key={category.id}
                className="group flex flex-col overflow-hidden rounded-(--radius-medium) border border-(--color-border) bg-(--color-surface) shadow-sm transition hover:-translate-y-1 hover:shadow-(--shadow-soft)"
              >
                <div className="relative">
                  {category.image ? (
                    <img
                      src={category.image}
                      alt={`${category.name} services`}
                      loading="lazy"
                      className="aspect-video w-full object-cover"
                    />
                  ) : (
                    <div
                      className="grid aspect-video place-items-center bg-(--color-primary)/8 text-(--color-primary)"
                      aria-hidden="true"
                    >
                      <ImageIcon className="h-8 w-8" />
                    </div>
                  )}
                </div>

                <div className="flex flex-1 flex-col p-5">
                  <h2 className="text-xl font-extrabold">{category.name}</h2>

                  <ul className="mt-4 flex-1 space-y-2.5">
                    {(category.services ?? []).map((service) => (
                      <li
                        key={service}
                        className="flex items-start gap-2.5 text-sm leading-6 text-(--color-muted)"
                      >
                        <span className="mt-1 grid h-4 w-4 shrink-0 place-items-center rounded-full bg-(--color-primary) text-white">
                          <Check
                            className="h-3 w-3 stroke-3"
                            aria-hidden="true"
                          />
                        </span>
                        <span>{service}</span>
                      </li>
                    ))}
                  </ul>

                  <Link
                    to={`/services/${category.id}`}
                    className="mt-6 inline-flex items-center justify-center gap-2 rounded-(--radius-small) bg-(--color-primary) px-5 py-3 font-extrabold text-white transition hover:bg-(--color-accent) focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(--color-accent)"
                  >
                    <span className="text-white">Request this service</span>
                    <ArrowRight
                      className="h-4 w-4 text-white"
                      aria-hidden="true"
                    />
                  </Link>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

export default Services;