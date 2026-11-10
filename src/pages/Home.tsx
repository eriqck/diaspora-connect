import {
  ClipboardCheck,
  ListChecks,
  MessageSquareText,
} from "lucide-react";

import howItWorksPhones from "../assets/how-it-works-phones.png";
import Hero from "./components/Hero";
import Services from "./components/Services";
import Testimonials from "./components/Testimonials";

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
      <Hero />

      <section
        id="how-it-works"
        className="bg-white text-(--color-ink)"
        aria-labelledby="process-heading"
      >
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 lg:py-10">
          <div className="max-w-2xl">
            <p className="text-xs font-extrabold uppercase tracking-[0.16em] text-(--color-primary)">
              How it works
            </p>
            <h2
              id="process-heading"
              className="mt-1 text-2xl font-black tracking-tight sm:text-3xl"
            >
              From request to result in three clear steps
            </h2>
            <p className="mt-2 text-sm leading-6 text-(--color-muted)">
              Make a request from wherever you are, agree on the details, and
              stay connected as the work gets done back home.
            </p>
          </div>

          <div className="mt-6 grid gap-4 lg:grid-cols-[0.85fr_1.15fr] lg:items-stretch">
            <figure className="relative overflow-hidden rounded-(--radius-medium) bg-(--color-accent) shadow-(--shadow-soft)">
              <img
                src={howItWorksPhones}
                alt="People using their phones to create, review, and track service requests"
                className="aspect-video w-full object-cover lg:absolute lg:inset-0 lg:aspect-auto lg:h-full"
                loading="lazy"
              />
              <figcaption className="absolute inset-x-0 bottom-0 bg-linear-to-t from-black/80 to-transparent px-4 pb-3 pt-10 text-sm font-extrabold text-white">
                Request <span className="mx-1.5 text-white/60">•</span>
                Review <span className="mx-1.5 text-white/60">•</span>
                Track progress
              </figcaption>
             
            </figure>

            <ol className="grid gap-3">
              {steps.map(({ number, title, description, Icon }) => (
                <li key={number}>
                  <article className="flex items-start gap-4 rounded-(--radius-medium) border border-(--color-border) bg-(--color-surface) p-4 shadow-sm">
                    <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-(--color-primary) text-sm font-black text-white">
                      {number}
                    </span>
                    <div className="min-w-0 flex-1">
                      <h3 className="text-base font-extrabold">{title}</h3>
                      <p className="mt-1 text-sm leading-6 text-(--color-muted)">
                        {description}
                      </p>
                    </div>
                    <Icon
                      className="hidden h-6 w-6 shrink-0 text-(--color-primary) sm:block"
                      aria-hidden="true"
                    />
                  </article>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </section>

      <Services />
      <Testimonials />

    </main>
  );
}

export default Home;
