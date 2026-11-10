import { useState } from "react";
import { ChevronLeft, ChevronRight, Quote, Star } from "lucide-react";

const testimonials = [
  {
    name: "Wanjiku N.",
    location: "London, United Kingdom",
    initials: "WN",
    service: "Home renovation",
    quote:
      "I was able to coordinate my parents' home renovation from London without the usual back-and-forth. I got clear updates at every step and the work was done exactly as agreed.",
  },
  {
    name: "Brian M.",
    location: "Toronto, Canada",
    initials: "BM",
    service: "Property support",
    quote:
      "Finding reliable help for my property in Nairobi used to be stressful. Diaspora Help made the process straightforward, and I always knew what was happening.",
  },
  {
    name: "Achieng O.",
    location: "Atlanta, United States",
    initials: "AO",
    service: "Family assistance",
    quote:
      "I needed someone dependable to help my family back home. The team listened, followed through, and kept me in the loop. I finally feel connected even from far away.",
  },
];

function Testimonials() {
  const [index, setIndex] = useState(0);
  const total = testimonials.length;

  const goTo = (nextIndex: number) => {
    setIndex((nextIndex + total) % total);
  };

  return (
    <section
      className="bg-(--color-background) text-(--color-ink)"
      aria-labelledby="testimonials-heading"
    >
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
        <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
          <div className="max-w-2xl">
            <p className="text-xs font-extrabold uppercase tracking-[0.16em] text-(--color-primary)">
              Stories from our community
            </p>
            <h2
              id="testimonials-heading"
              className="mt-2 text-3xl font-black tracking-tight sm:text-4xl"
            >
              Trusted from miles away
            </h2>
            <p className="mt-3 text-sm leading-6 text-(--color-muted)">
              See how we help Kenyans abroad take care of what matters back
              home.
            </p>
          </div>

          <div className="flex items-center gap-2 self-end sm:self-auto">
            <button
              type="button"
              onClick={() => goTo(index - 1)}
              aria-label="Previous testimonial"
              className="grid h-11 w-11 place-items-center rounded-full border border-(--color-border) bg-(--color-surface) text-(--color-primary) transition hover:border-(--color-primary) hover:bg-(--color-primary) hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(--color-primary)"
            >
              <ChevronLeft className="h-5 w-5" aria-hidden="true" />
            </button>
            <button
              type="button"
              onClick={() => goTo(index + 1)}
              aria-label="Next testimonial"
              className="grid h-11 w-11 place-items-center rounded-full border border-(--color-border) bg-(--color-surface) text-(--color-primary) transition hover:border-(--color-primary) hover:bg-(--color-primary) hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(--color-primary)"
            >
              <ChevronRight className="h-5 w-5" aria-hidden="true" />
            </button>
          </div>
        </div>

        <div
          className="mt-7 overflow-hidden rounded-(--radius-medium) border border-(--color-border) bg-(--color-surface) shadow-(--shadow-soft)"
          role="region"
          aria-roledescription="carousel"
          aria-label="Customer testimonials"
          onKeyDown={(event) => {
            if (event.key === "ArrowRight") goTo(index + 1);
            if (event.key === "ArrowLeft") goTo(index - 1);
          }}
        >
          <div
            className="flex transition-transform duration-500 ease-out motion-reduce:transition-none"
            style={{ transform: `translateX(-${index * 100}%)` }}
            aria-live="polite"
          >
            {testimonials.map((testimonial, slideIndex) => {
              const active = slideIndex === index;

              return (
                <article
                  key={testimonial.name}
                  role="group"
                  aria-roledescription="slide"
                  aria-label={`${slideIndex + 1} of ${total}`}
                  aria-hidden={!active}
                  className="grid w-full shrink-0 gap-8 p-6 sm:p-9 lg:grid-cols-[1fr_auto] lg:items-center lg:gap-12 lg:p-12"
                >
                  <div>
                    <div
                      className="flex gap-1 text-(--color-primary)"
                      aria-label="5 out of 5 stars"
                      role="img"
                    >
                      {Array.from({ length: 5 }, (_, starIndex) => (
                        <Star
                          key={starIndex}
                          className="h-4 w-4 fill-current"
                          aria-hidden="true"
                        />
                      ))}
                    </div>
                    <blockquote className="mt-5">
                      <Quote
                        className="mb-3 h-8 w-8 text-(--color-secondary)"
                        aria-hidden="true"
                      />
                      <p className="text-md font-semibold text-(--color-ink) sm:text-md">
                        “{testimonial.quote}”
                      </p>
                    </blockquote>
                  </div>

                  <div className="flex items-center gap-4 border-t border-(--color-border) pt-5 lg:min-w-64 lg:border-l lg:border-t-0 lg:pl-8 lg:pt-0">
                    <div
                      className="grid h-14 w-14 shrink-0 place-items-center rounded-full bg-(--color-primary) text-lg font-black text-white"
                      aria-hidden="true"
                    >
                      {testimonial.initials}
                    </div>
                    <div>
                      <p className="font-extrabold">{testimonial.name}</p>
                      <p className="mt-1 text-sm text-(--color-muted)">
                        {testimonial.location}
                      </p>
                      <p className="mt-2 inline-flex rounded-(--radius-pill) bg-(--color-primary)/8 px-3 py-1 text-xs font-bold text-(--color-primary)">
                        {testimonial.service}
                      </p>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        </div>

        <div
          className="mt-5 flex justify-center gap-2"
          role="group"
          aria-label="Choose a testimonial"
        >
          {testimonials.map((testimonial, slideIndex) => (
            <button
              key={testimonial.name}
              type="button"
              onClick={() => goTo(slideIndex)}
              aria-label={`Show testimonial ${slideIndex + 1}`}
              aria-current={slideIndex === index ? "true" : undefined}
              className={`h-2.5 rounded-full transition-all focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(--color-primary) ${
                slideIndex === index
                  ? "w-8 bg-(--color-primary)"
                  : "w-2.5 bg-(--color-border) hover:bg-(--color-primary)/50"
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

export default Testimonials;
