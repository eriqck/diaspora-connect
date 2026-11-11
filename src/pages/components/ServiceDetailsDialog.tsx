import { ArrowRight, Check, X } from "lucide-react";
import { useEffect, useRef } from "react";
import { Link } from "react-router-dom";

const serviceInformation: Record<
  string,
  { introduction: string; details: string[] }
> = {
  dowry: {
    introduction:
      "Coordinate traditional dowry requirements with trusted support on the ground, while keeping the couple and family abroad informed.",
    details: [
      "A virtual cultural liaison coordinates with local elders and the couple or family abroad.",
      "Guidance on traditional requirements, step-by-step rituals, and gift guidelines.",
      "Traditional decor—custom fabrics, seating, and cultural props—blended with modern styling, floral arches, ambient lighting, and refined tableware.",
    ],
  },
  weddings: {
    introduction:
      "Plan your wedding remotely with clear communication and end-to-end coordination from trusted local support.",
    details: [
      "Shared digital timelines, budget tracking, mood boards, and regular video check-ins.",
      "Vetting and coordination of venues, caterers, photographers, sound and lighting teams, and entertainment.",
      "Guest support including airport transfers, accommodation, local transport, and welcome hampers.",
      "Coordination of rehearsal dinners, welcome events, and post-wedding excursions.",
      "Guidance on marriage licensing, documentation, and officiant arrangements in Kenya.",
    ],
  },
  birthdays: {
    introduction:
      "Create a memorable birthday celebration in Kenya, including surprise events planned from abroad for loved ones at home.",
    details: [
      "Bespoke themes, event styling, custom backdrops, photo booths, stage setups, and personalized branding.",
      "Booking of local DJs, live bands, traditional performers, and MCs.",
      "VIP hospitality options including mixologists, curated cocktail bars, private chefs, and guest hosts.",
      "On-the-ground coordination for surprise birthday celebrations.",
    ],
  },
  "hotel bookings": {
    introduction:
      "Find a comfortable stay in Kenya, from boutique safari lodges and beachfront villas to accommodation for special family events.",
    details: [
      "Curated luxury resorts, boutique safari lodges, and beachfront villas.",
      "Pre-arrival video walkthroughs of rooms and properties to help you choose with confidence.",
      "Group room blocks and negotiated rates for reunions, weddings, and traditional homecomings.",
    ],
  },
  destinations: {
    introduction:
      "Plan a smooth journey around Kenya with connected destinations and dependable local transport options.",
    details: [
      "Help planning routes between international hubs, local airports, and safari or coastal destinations.",
      "Connections to domestic airstrips including Ukunda, the Mara, Malindi, and Wilson Airport.",
      "SGR reservations, airport pickups, private 4x4 transfers, and city transport.",
    ],
  },
  ticketing: {
    introduction:
      "Coordinate international and local travel arrangements for your visit to Kenya, with guidance for changes and travel requirements.",
    details: [
      "International and multi-city flight options, including group fares and flexible changes where available.",
      "Domestic flight connections between major hubs and coastal or safari airstrips.",
      "Guidance on entry permissions, Kenya eTA requirements, and travel or medical insurance.",
    ],
  },
  "airport pickup": {
    introduction: "Airport Transfers",
    details: [
      "Meet & Greet Service: A professional driver will meet you at the arrivals exit holding a personalized name board.",
    ],
  },
  property: {
    introduction: "Airport Transfers",
    details: [
      "Meet & Greet Service: A professional driver will meet you at the arrivals exit holding a personalized name board.",
    ],
  },
  "shares & stocks": {
    introduction:
      "Invest in shares and stocks listed on the market, with guidance on liquidity, risk, and your investment goals.",
    details: [
      "High liquidity and low risk, ideal for parking capital while evaluating deals.",
    ],
  },
  "bonds & interests": {
    introduction:
      "Explore bond investment options for income and long-term financial planning.",
    details: [
      "Tangible wealth, land banking, rental yields, and long-term hedging.",
    ],
  },
  "money market funds": {
    introduction:
      "Explore professionally managed money market funds as part of your investment plans.",
    details: [
      "Dividend income and exposure to domestic growth sectors, including banking and telecom.",
    ],
  },
};

type ServiceDetailsDialogProps = {
  category: string;
  service: string;
  requestHref: string;
  onClose: () => void;
};

function ServiceDetailsDialog({
  category,
  service,
  requestHref,
  onClose,
}: ServiceDetailsDialogProps) {
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const information = serviceInformation[service.toLowerCase()];

  useEffect(() => {
    const previousFocus = document.activeElement;
    const previousOverflow = document.body.style.overflow;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };

    document.body.style.overflow = "hidden";
    document.addEventListener("keydown", handleKeyDown);
    closeButtonRef.current?.focus();
    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", handleKeyDown);
      if (previousFocus instanceof HTMLElement) previousFocus.focus();
    };
  }, [onClose]);

  return (
    <div
      role="presentation"
      onClick={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
      className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/70 p-4 backdrop-blur-sm"
    >
      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby="service-details-title"
        tabIndex={-1}
        className="max-h-[90vh] w-full max-w-xl overflow-y-auto rounded-(--radius-medium) border border-(--color-border) bg-(--color-surface) text-(--color-ink) shadow-2xl"
      >
        <div className="flex items-start justify-between gap-5 bg-[#f5b313] px-6 py-6 text-slate-950">
          <div>
            <p className="text-xs font-extrabold uppercase tracking-[0.14em] text-slate-800">
              {category}
            </p>
            <h2 id="service-details-title" className="mt-2 text-2xl font-black">
              {service}
            </h2>
          </div>
          <button
            ref={closeButtonRef}
            type="button"
            onClick={onClose}
            aria-label="Close service details"
            className="grid h-10 w-10 shrink-0 place-items-center rounded-full text-slate-900/75 transition hover:bg-black/10 hover:text-slate-950 focus-visible:outline-2 focus-visible:outline-slate-950"
          >
            <X className="h-5 w-5" aria-hidden="true" />
          </button>
        </div>

        <div className="px-6 py-7">
          <h3 className="text-sm font-black uppercase tracking-wide">
            Service details
          </h3>
          <p className="mt-3 text-base leading-7 text-(--color-muted)">
            {information?.introduction ??
              `Tell us what you need for ${service.toLowerCase()}. We’ll review your request and confirm the scope, requirements, and timing with you before proceeding.`}
          </p>
          {information && (
            <ul className="mt-5 space-y-3">
              {information.details.map((detail) => (
                <li
                  key={detail}
                  className="flex items-start gap-3 text-sm leading-6 text-(--color-ink)"
                >
                  <span className="mt-1 grid h-5 w-5 shrink-0 place-items-center rounded-full bg-[#f5b313] text-slate-950">
                    <Check className="h-3 w-3 stroke-[3]" aria-hidden="true" />
                  </span>
                  <span>{detail}</span>
                </li>
              ))}
            </ul>
          )}
          <p className="mt-4 rounded-(--radius-small) border border-(--color-border) bg-(--color-background) px-4 py-3 text-sm leading-6 text-(--color-muted)">
            Service arrangements are confirmed with you based on your specific
            request.
          </p>
        </div>

        <div className="border-t border-(--color-border) bg-(--color-background) px-6 py-5">
          <Link
            to={requestHref}
            onClick={onClose}
            className="inline-flex w-full items-center justify-center gap-2 rounded-(--radius-small) bg-[#f5b313] px-5 py-3 font-extrabold text-slate-950 transition hover:bg-[#ffc533] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#f5b313]"
          >
            Request this service
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </Link>
        </div>
      </section>
    </div>
  );
}

export default ServiceDetailsDialog;
