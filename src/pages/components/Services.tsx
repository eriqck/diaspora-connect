import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  ImageIcon,
  type LucideIcon,
} from "lucide-react";
import buildingConsultancyCardImage from "../../assets/building-consultancy-card.png";
import familyErrandsImage from "../../assets/family-errands-concierge.png";
import governmentServicesImage from "../../assets/government-services.png";
import investmentImage from "../../assets/investment-types.png";
import landPropertyPurchaseImage from "../../assets/land-property-purchase.png";
import {
  fetchCategories,
  type HomeCategory,
} from "../../apiservices/HomeService";
import ServiceDetailsDialog from "./ServiceDetailsDialog";

const featuredServices: {
  name: string;
  description: string;
  to: string;
  image?: string;
  alt?: string;
  Icon?: LucideIcon;
  imageFit?: string;
}[] = [
  {
    name: "Building & Consultancy",
    description:
      "Plan your build with drawings, cost guidance, and practical project support.",
    to: "/building-consultancy",
    image: buildingConsultancyCardImage,
    alt: "Building consultancy expert sharing construction and home-building guidance",
  },
  {
    name: "Land & Property",
    description:
      "Get local support as you explore and coordinate a land or property purchase.",
    to: "/land-property-purchase",
    image: landPropertyPurchaseImage,
    alt: "A modern house and undeveloped land in Nairobi",
    imageFit: "object-cover",
  },
  {
    name: "Family Errands",
    description:
      "Arrange trusted help with everyday errands and practical needs for family back home.",
    to: "/family-errands-concierge",
    image: familyErrandsImage,
    alt: "A person carrying shopping bags from a car",
    imageFit: "object-cover",
  },
  {
    name: "Government Services",
    description:
      "Get help understanding and coordinating government-related requests in Kenya.",
    to: "/government-services",
    image: governmentServicesImage,
    alt: "Kenyan national identity cards and a Huduma Kenya service centre",
    imageFit: "object-cover",
  },
];

function Services() {
  const [categories, setCategories] = useState<HomeCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [serviceDetails, setServiceDetails] = useState<{
    category: HomeCategory;
    service: string;
  } | null>(null);

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
            Services Tailored For Kenyans Abroad
          </h1>
        </div>

        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {featuredServices.map(
            ({ name, description, to, image, alt, Icon, imageFit }) => (
            <article
              key={name}
              className="group flex flex-col overflow-hidden rounded-(--radius-medium) border border-(--color-border) bg-(--color-surface) shadow-sm transition hover:-translate-y-1 hover:shadow-(--shadow-soft)"
            >
              {image ? (
                <img
                  src={image}
                  alt={alt}
                  className={`aspect-video w-full ${imageFit ?? "object-contain bg-(--color-accent)"}`}
                />
              ) : (
                <div
                  className="grid aspect-video place-items-center bg-(--color-primary)/8 text-(--color-primary)"
                  aria-hidden="true"
                >
                  {Icon && <Icon className="h-12 w-12" />}
                </div>
              )}
              <div className="flex flex-1 flex-col p-5">
                <h2 className="text-xl font-extrabold">{name}</h2>
                <p className="mt-3 flex-1 text-sm leading-6 text-(--color-muted)">
                  {description}
                </p>
                <Link
                  to={to}
                  className="mt-6 inline-flex items-center justify-center gap-2 rounded-(--radius-small) bg-(--color-primary) px-5 py-3 font-extrabold text-white transition hover:bg-(--color-accent) focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(--color-accent)"
                >
                  <span>Explore service</span>
                  <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </Link>
              </div>
            </article>
            ),
          )}
        </div>

        <div className="mt-12">
          <h2 className="text-2xl font-black">More services</h2>
          {loading && (
            <p className="mt-4 text-(--color-muted)" role="status">
              Loading services...
            </p>
          )}
          {error && (
            <p className="mt-4 text-(--color-muted)" role="alert">
              {error}
            </p>
          )}
          <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {!loading &&
              !error &&
              categories.map((category) => (
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

                    <div className="mt-4 flex-1 space-y-2">
                      {(category.services ?? []).map((service) => (
                        <div
                          key={service}
                          className="flex items-center justify-between gap-3"
                        >
                          <span className="text-sm leading-6 text-(--color-muted)">
                            {service}
                          </span>
                          <button
                            type="button"
                            onClick={() => setServiceDetails({ category, service })}
                            className="shrink-0 rounded-full border border-(--color-primary)/30 px-3 py-1 text-xs font-extrabold text-(--color-primary) transition hover:bg-(--color-primary) hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(--color-primary)"
                          >
                            Details
                          </button>
                        </div>
                      ))}
                    </div>

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

            <article className="group flex flex-col overflow-hidden rounded-(--radius-medium) border border-(--color-border) bg-(--color-surface) shadow-sm transition hover:-translate-y-1 hover:shadow-(--shadow-soft)">
              <img
                src={investmentImage}
                alt="Illustration of property, stocks, bonds, business equipment, and savings investments"
                loading="lazy"
                className="aspect-video w-full object-cover"
              />
              <div className="flex flex-1 flex-col p-5">
                <h2 className="text-xl font-extrabold">Investment</h2>
                <p className="mt-3 flex-1 text-sm leading-6 text-(--color-muted)">
                  Explore opportunities and get local guidance for investment
                  projects in Kenya.
                </p>
                <Link
                  to="/investment"
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

export default Services;