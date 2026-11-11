import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  MessageCircle,
  Phone,
} from "lucide-react";
import { Link } from "react-router-dom";

type ServiceLandingPageProps = {
  title: string;
  description?: string;
  includedDetails?: string[];
  whatsappMessage: string;
  image: string;
  imageAlt: string;
};

function ServiceLandingPage({
  title,
  description,
  includedDetails,
  whatsappMessage,
  image,
  imageAlt,
}: ServiceLandingPageProps) {
  const whatsappUrl = `https://wa.me/254720554657?text=${encodeURIComponent(whatsappMessage)}`;

  return (
    <main className="min-h-[65vh] bg-(--color-background) px-4 py-8 text-(--color-ink) sm:px-6 lg:px-8 lg:py-10">
      <div className="mx-auto grid max-w-6xl items-start gap-6 lg:grid-cols-[minmax(0,1.25fr)_minmax(340px,0.85fr)]">
        <article className="overflow-hidden rounded-(--radius-medium) border border-(--color-border) bg-(--color-surface) shadow-(--shadow-soft)">
          <img
            src={image}
            alt={imageAlt}
            className="aspect-video w-full object-cover"
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
              Services for Kenyans abroad
            </p>
            <h1 className="mt-2 text-3xl font-black tracking-tight sm:text-4xl">
              {title}
            </h1>
            {includedDetails?.length ? (
              <ul className="mt-5 space-y-3">
                {includedDetails.map((detail) => (
                  <li
                    key={detail}
                    className="flex items-start gap-3 text-base leading-7 text-(--color-ink)"
                  >
                    <CheckCircle2
                      className="mt-1 h-5 w-5 shrink-0 text-green-700"
                      aria-hidden="true"
                    />
                    <span>{detail}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <>
                <p className="mt-4 max-w-3xl text-base leading-7 text-(--color-muted)">
                  {description}
                </p>
                <p className="mt-5 text-sm leading-6 text-(--color-muted)">
                  Tell us what you need and where in Kenya you need support. We’ll
                  discuss the available options and confirm the next steps with you.
                </p>
              </>
            )}
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noreferrer"
              className="mt-6 inline-flex items-center justify-center gap-2 rounded-(--radius-small) bg-(--color-primary) px-5 py-3 font-extrabold text-white transition hover:bg-(--color-accent) focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(--color-accent)"
            >
              <span>Request this service</span>
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </a>
          </div>
        </article>

        <aside className="rounded-(--radius-medium) border border-(--color-border) bg-(--color-surface) shadow-(--shadow-soft) lg:sticky lg:top-6">
          <div className="border-b border-(--color-border) px-6 py-5">
            <p className="text-xs font-extrabold uppercase tracking-[0.14em] text-(--color-primary)">
              Need a hand?
            </p>
            <h2 className="mt-1 text-xl font-black">Talk to Alfred</h2>
          </div>
          <div className="p-6">
            <div className="flex items-center gap-3">
              <img
                src="/images/alf.jpeg"
                alt="Alfred"
                className="h-16 w-16 shrink-0 rounded-full border-2 border-(--color-primary)/15 object-cover object-top"
              />
              <p className="text-sm leading-6 text-(--color-muted)">
                Choose how you would like to discuss your {title.toLowerCase()} request.
              </p>
            </div>
            <div className="mt-5 grid gap-3">
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noreferrer"
                className="flex items-center justify-center gap-2 rounded-(--radius-small) bg-[#25D366]/12 px-4 py-3 text-sm font-bold text-[#128C4A] transition hover:bg-[#25D366] hover:text-white"
              >
                <MessageCircle className="h-5 w-5" aria-hidden="true" />
                WhatsApp
              </a>
              <a
                href="tel:+254720554657"
                className="flex items-center justify-center gap-2 rounded-(--radius-small) bg-(--color-primary)/10 px-4 py-3 text-sm font-bold text-(--color-primary) transition hover:bg-(--color-primary) hover:text-white"
              >
                <Phone className="h-5 w-5" aria-hidden="true" />
                Call +254 720 554 657
              </a>
            </div>
          </div>
        </aside>
      </div>
    </main>
  );
}

export default ServiceLandingPage;
