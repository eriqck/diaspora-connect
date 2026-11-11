import { ArrowLeft, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import buildingConsultancyImage from "../assets/building-consultancy.jpg";
import buildingConsultancyHeroImage from "../assets/building-consultancy-hero-enhanced.jpg";
import buildingProjectAerialImage from "../assets/building-project-aerial.jpg";
import buildingProjectHomeImage from "../assets/building-project-home.jpg";
import buildingProjectPlanningImage from "../assets/building-project-planning.jpg";
import buildingProjectSupervisionImage from "../assets/building-project-supervision.jpg";
import buildingProjectSiteImage from "../assets/building-project-site.jpg";

const consultancyServices = [
  {
    title: "Architectural Design",
    description:
      "Turn your ideas into detailed plans for your future home.",
    image: buildingConsultancyImage,
    alt: "Construction workers building a home in Kenya",
    imagePosition: "center",
    imageScale: 1,
  },
  {
    title: "Structural Drawings",
    description:
      "Get clear structural drawings to guide safe construction.",
    image: buildingProjectHomeImage,
    alt: "A residential building under construction",
    imagePosition: "center",
    imageScale: 1,
  },
  {
    title: "Bill of Quantities",
    description:
      "Understand the materials and work required for your build.",
    image: buildingProjectPlanningImage,
    alt: "Construction professionals reviewing project plans",
    imagePosition: "center",
    imageScale: 1,
  },
  {
    title: "Feasibility Study",
    description:
      "Review your project options before making a commitment.",
    image: buildingProjectAerialImage,
    alt: "A home and its surrounding property viewed from above",
    imagePosition: "center",
    imageScale: 1,
  },
  {
    title: "Site Assessment",
    description:
      "Get a professional view of your site and its potential.",
    image: buildingProjectSiteImage,
    alt: "A construction professional working at a building site",
    imagePosition: "center",
    imageScale: 1,
  },
  {
    title: "Project Supervision",
    description:
      "Keep your project on track with experienced oversight.",
    image: buildingProjectSupervisionImage,
    alt: "A construction professional assessing a building project",
  },
];

function BuildingConsultancy() {
  return (
    <main className="min-h-screen bg-(--color-background) text-(--color-ink)">
      <section className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8 lg:py-10">
        <article
          className="overflow-hidden rounded-(--radius-medium) border border-(--color-border) bg-(--color-surface) shadow-(--shadow-soft)"
          aria-labelledby="building-consultancy-title"
        >
          <img
            src={buildingConsultancyHeroImage}
            alt="A construction worker building a home in Kenya"
            className="aspect-video w-full object-cover"
            fetchPriority="high"
          />
          <div className="p-6 sm:p-8">
            <Link
              to="/"
              className="inline-flex items-center gap-2 text-sm font-extrabold text-(--color-primary) hover:underline"
            >
              <ArrowLeft className="h-4 w-4" aria-hidden="true" />
              Back to all services
            </Link>
            <p className="mt-6 text-sm font-extrabold uppercase tracking-[0.16em] text-(--color-primary)">
              Building consultancy
            </p>
            <h1
              id="building-consultancy-title"
              className="mt-2 text-3xl font-black tracking-tight sm:text-4xl"
            >
              Know what you’re getting into before you build.
            </h1>
            <p className="mt-4 max-w-3xl text-base leading-7 text-(--color-muted)">
              Get the information you need to plan your project with confidence.
              Request drawings, a bill of quantities, or a feasibility study,
              each priced on its own and yours to take anywhere.
            </p>
            <a
              href="https://wa.me/254720554657?text=Hello%2C%20I%20would%20like%20to%20ask%20about%20building%20consultancy."
              target="_blank"
              rel="noreferrer"
              className="mt-6 inline-flex items-center gap-2 rounded-(--radius-small) bg-(--color-primary) px-5 py-3 font-extrabold text-white transition hover:bg-(--color-accent) focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(--color-accent)"
            >
              Request this service
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </a>
          </div>
        </article>
      </section>

      <section
        className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16"
        aria-labelledby="consultancy-services-heading"
      >
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-(--color-secondary)">
          Plan with clarity
        </p>
        <h2
          id="consultancy-services-heading"
          className="mt-3 text-3xl font-medium sm:text-4xl"
        >
          Choose the support you need
        </h2>
        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {consultancyServices.map(
            ({
              title,
              description,
              image,
              alt,
            }) => (
              <article
                key={title}
                className="group flex flex-col overflow-hidden rounded-(--radius-medium) border border-(--color-border) bg-(--color-surface) shadow-sm transition hover:-translate-y-1 hover:shadow-(--shadow-soft)"
              >
                <img
                  src={image}
                  alt={alt}
                  className="aspect-video w-full object-cover"
                  loading="lazy"
                />
                <div className="flex flex-1 flex-col p-5">
                  <h3 className="text-xl font-extrabold">{title}</h3>
                  <p className="mt-3 flex-1 text-sm leading-6 text-(--color-muted)">
                    {description}
                  </p>
                  <a
                    href={`https://wa.me/254720554657?text=${encodeURIComponent(`Hello, I would like to ask about ${title.toLowerCase()}.`)}`}
                    target="_blank"
                    rel="noreferrer"
                    className="mt-6 inline-flex items-center justify-center gap-2 rounded-(--radius-small) bg-(--color-primary) px-5 py-3 font-extrabold text-white transition hover:bg-(--color-accent) focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(--color-accent)"
                  >
                    <span>Ask about this service</span>
                    <ArrowRight className="h-4 w-4" aria-hidden="true" />
                  </a>
                </div>
              </article>
            ),
          )}
        </div>
        <Link
          to="/services"
          className="mt-8 inline-flex items-center gap-2 font-bold text-(--color-primary) hover:underline"
        >
          Explore all services
          <ArrowRight className="h-4 w-4" aria-hidden="true" />
        </Link>
      </section>
    </main>
  );
}

export default BuildingConsultancy;
