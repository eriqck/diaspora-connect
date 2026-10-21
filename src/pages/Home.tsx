import {
  ArrowRight,
  CalendarDays,
  ClipboardCheck,
  HomeIcon,
  ListChecks,
  MapPin,
  MessageSquareText,
  Plane,
} from "lucide-react";
import { Link } from "react-router-dom";
import howItWorksPhones from "../assets/how-it-works-phones.png";

const steps = [
  {
    number: "01",
    title: "Describe what you need",
    description: "Share the task, location, budget range, and target date.",
    Icon: MessageSquareText,
  },
  {
    number: "02",
    title: "Confirm the request details",
    description: "Review the task scope, expected timeline, and budget.",
    Icon: ListChecks,
  },
  {
    number: "03",
    title: "Follow progress remotely",
    description: "Receive updates and confirm each agreed milestone.",
    Icon: ClipboardCheck,
  },
];

function Home() {
  return (
    <main className="min-h-screen bg-(--color-background) text-(--color-ink)">
      <section
        className="bg-(--color-background) px-4 py-5 sm:px-6 sm:py-7 lg:px-8"
        aria-labelledby="hero-heading"
      >
        <div className="relative mx-auto min-h-107.5 max-w-360 overflow-hidden rounded-[1.4rem] bg-[linear-gradient(115deg,var(--color-primary-dark),var(--color-primary)_72%)] text-white shadow-(--shadow-soft)">
          <div className="absolute inset-0 opacity-20" aria-hidden="true">
            <div className="absolute -left-20 -top-28 h-80 w-80 rounded-full border-60 border-white/20" />
            <div className="absolute -bottom-48 left-[42%] h-96 w-96 rounded-full bg-(--color-secondary)/40 blur-3xl" />
            <div className="absolute right-[18%] -top-36 h-72 w-72 rounded-full border-50 border-white/15" />
          </div>

          <div className="relative grid min-h-107.5 items-center gap-8 px-7 pb-16 pt-10 sm:px-10 lg:grid-cols-[1.05fr_0.72fr_0.9fr] lg:px-14 lg:py-10">
            <div className="max-w-xl">
              <h1
                id="hero-heading"
                className="text-4xl font-black leading-[1.02] tracking-tight sm:text-5xl xl:text-6xl"
              >
                Get things done
                <span className="block text-(--color-secondary)">
                  back home.
                </span>
              </h1>
              <p className="mt-5 max-w-md text-base leading-7 text-white/80 sm:text-lg">
                Practical support in Kenya for property, errands, events,
                travel, construction, and family needs.
              </p>
            </div>

            <div className="flex flex-col items-start lg:items-center">
              <p className="text-xl font-semibold text-white/85 sm:text-2xl">
                Wherever you are
              </p>
              <div className="mt-5 rounded-(--radius-pill) bg-(--color-secondary) px-5 py-2 text-xs font-black uppercase tracking-[0.14em] text-(--color-primary-dark)">
                One request is all it takes
              </div>
              <Link
                to="/services"
                className="mt-5 inline-flex items-center gap-2 rounded-(--radius-small) bg-white px-6 py-3.5 font-extrabold shadow-lg transition hover:-translate-y-0.5 hover:bg-(--color-background)"
                style={{ color: "var(--color-primary-dark)" }}
              >
                Request a service <ArrowRight className="h-4 w-4" />
              </Link>
              <a
                href="#how-it-works"
                className="mt-4 text-sm font-bold text-white/75 underline decoration-white/30 underline-offset-4 transition hover:text-white"
              >
                See how Diaspora Help works
              </a>
            </div>

            <div
              className="relative mx-auto hidden h-85 w-full max-w-sm lg:block"
              aria-label="Examples of services available"
            >
              <div className="absolute right-2 top-1 h-64 w-64 rounded-full bg-white/10 ring-1 ring-white/15" />
              <div className="absolute right-5 top-8 grid h-40 w-40 place-items-center rounded-4xl bg-white/95 text-(--color-primary-dark) shadow-2xl rotate-3">
                <HomeIcon className="h-20 w-20 stroke-[1.4]" />
                <span className="absolute bottom-4 text-xs font-black uppercase tracking-wider">
                  Property
                </span>
              </div>
              <div className="absolute bottom-8 left-2 grid h-28 w-28 -rotate-6 place-items-center rounded-3xl bg-(--color-secondary) text-(--color-primary-dark) shadow-2xl">
                <Plane className="h-12 w-12 stroke-[1.6]" />
                <span className="absolute bottom-3 text-[10px] font-black uppercase tracking-wider">
                  Travel
                </span>
              </div>
              <div className="absolute bottom-1 right-0 w-48 rotate-2 rounded-(--radius-medium) border border-white/60 bg-white p-4 text-(--color-ink) shadow-2xl">
                <div className="flex items-center gap-3">
                  <span className="grid h-10 w-10 place-items-center rounded-(--radius-small) bg-(--color-primary)/10 text-(--color-primary)">
                    <CalendarDays className="h-5 w-5" />
                  </span>
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-wider text-(--color-muted)">
                      Event support
                    </p>
                    <p className="text-sm font-black">Plans on track</p>
                  </div>
                </div>
                <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-(--color-border)">
                  <div className="h-full w-3/4 rounded-full bg-(--color-primary)" />
                </div>
              </div>
              <div className="absolute left-8 top-12 rounded-(--radius-pill) border border-white/40 bg-(--color-primary-dark)/80 px-3 py-2 text-xs font-bold shadow-lg backdrop-blur">
                <MapPin className="mr-1 inline h-3.5 w-3.5 text-(--color-secondary)" />{" "}
                Across Kenya
              </div>
            </div>
          </div>
        </div>
      </section>

      <section
        id="how-it-works"
        className="bg-white text-(--color-foreground)"
        aria-labelledby="process-heading"
      >
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
          <div className="text-center">
            <p className="text-sm font-extrabold uppercase tracking-[0.16em] text-(--color-primary)">
              How it works
            </p>
            <h2
              id="process-heading"
              className="mx-auto mt-2 max-w-2xl text-3xl font-black tracking-tight sm:text-4xl"
            >
              From request to result in three clear steps
            </h2>
            <p className="mx-auto mt-4 max-w-2xl leading-7 text-(--color-muted)">
              Make a request from wherever you are, agree on the details, and
              stay connected as the work gets done back home.
            </p>
          </div>

          <figure className="relative mt-9 overflow-hidden rounded-(--radius-medium) bg-(--color-primary-dark) shadow-(--shadow-soft)">
            <img
              src={howItWorksPhones}
              alt="People using their phones to create, review, and track service requests"
              className="aspect-16/7 w-full object-cover"
              loading="lazy"
            />
            <figcaption className="absolute inset-x-0 bottom-0 bg-linear-to-t from-(--color-primary-dark)/90 to-transparent px-5 pb-5 pt-14 text-sm font-extrabold text-white sm:px-7 sm:pb-7 sm:text-base">
              Request <span className="mx-2 text-(--color-secondary)">•</span>
              Review <span className="mx-2 text-(--color-secondary)">•</span>
              Track progress
            </figcaption>
          </figure>

          <div className="mt-6 grid gap-5 lg:grid-cols-3">
            {steps.map(({ number, title, description, Icon }) => (
              <article
                key={number}
                className="rounded-(--radius-medium) border border-(--color-border) bg-(--color-surface) p-6 shadow-sm"
              >
                <div className="flex items-center justify-between">
                  <span className="text-sm font-black text-(--color-primary)">
                    {number}
                  </span>
                  <Icon className="h-6 w-6 text-(--color-primary)" />
                </div>
                <h3 className="mt-10 text-xl font-extrabold">{title}</h3>
                <p className="mt-3 leading-7 text-(--color-muted)">
                  {description}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-8 rounded-(--radius-medium) bg-(--color-secondary) px-6 py-12 text-center sm:px-10 lg:flex-row lg:text-left">
          <div>
            <p className="text-sm font-extrabold uppercase tracking-[0.16em] text-(--color-primary-dark)">
              Ready when you are
            </p>
            <h2 className="mt-2 max-w-2xl text-3xl font-black tracking-tight sm:text-4xl">
              What can we help you handle in Kenya?
            </h2>
          </div>
          <Link
            to="/services"
            className="mt-5 inline-flex items-center gap-2 rounded-(--radius-small) bg-white px-6 py-3.5 font-extrabold shadow-lg transition hover:-translate-y-0.5 hover:bg-(--color-background)"
            style={{ color: "var(--color-primary-dark)" }}
          >
            Request a service <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>
    </main>
  );
}

export default Home;
