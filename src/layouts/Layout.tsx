import { useEffect, useRef, useState } from "react";
import { Mail, MessageCircle, Phone, X } from "lucide-react";
import { Outlet } from "react-router-dom";
import Footer from "../pages/components/Footer";
import NavBar from "../pages/components/NavBar";
import RequestServiceNow from "../pages/components/RequestServiceNow";
import TopBar from "../pages/components/TopBar";

function Layout() {
  const [isContactOpen, setIsContactOpen] = useState(false);
  const contactMenu = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const closeContactMenu = (event: PointerEvent) => {
      if (!contactMenu.current?.contains(event.target as Node)) {
        setIsContactOpen(false);
      }
    };

    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setIsContactOpen(false);
    };

    document.addEventListener("pointerdown", closeContactMenu);
    document.addEventListener("keydown", closeOnEscape);

    return () => {
      document.removeEventListener("pointerdown", closeContactMenu);
      document.removeEventListener("keydown", closeOnEscape);
    };
  }, []);

  return (
    <>
      <TopBar />
      <NavBar />
      <Outlet />
      <Footer />

      <div className="fixed bottom-24 right-4 z-50 sm:bottom-28 sm:right-7">
        <RequestServiceNow />
      </div>

      <div
        ref={contactMenu}
        className="fixed bottom-5 right-4 z-50 flex flex-col items-end sm:bottom-7 sm:right-7"
      >
        {isContactOpen && (
          <div
            id="alfred-contact-options"
            className="mb-3 w-64 rounded-(--radius-medium) border border-(--color-border) bg-(--color-surface) p-3 shadow-2xl"
          >
            <div className="mb-3 flex items-center gap-3 px-2 py-1">
              <img
                src="/images/alf.jpeg"
                alt="Alfred"
                className="h-16 w-16 shrink-0 rounded-full border-2 border-(--color-primary)/15 object-cover object-top"
              />
              <div>
                <p className="font-extrabold text-(--color-ink)">Talk to Alfred</p>
                <p className="text-xs text-(--color-muted)">How would you like to connect?</p>
              </div>
            </div>

            <div className="space-y-2">
              <a
                href="https://wa.me/254720554657?text=Hello%20Alfred%2C%20I%20would%20like%20to%20inquire%20about%20your%20services."
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-3 rounded-(--radius-small) bg-[#25D366]/10 px-3 py-3 font-bold text-[#128C4A] transition hover:bg-[#25D366] hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#25D366]"
              >
                <MessageCircle className="h-5 w-5" />
                WhatsApp
              </a>
              <a
                href="tel:+254720554657"
                className="flex items-center gap-3 rounded-(--radius-small) bg-(--color-primary)/10 px-3 py-3 font-bold text-(--color-primary) transition hover:bg-(--color-primary) hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(--color-primary)"
              >
                <Phone className="h-5 w-5" />
                Call
              </a>
              <a
                href="mailto:support@msaidizidiaspora.co.ke?subject=Enquiry%20for%20Alfred"
                className="flex items-center gap-3 rounded-(--radius-small) bg-(--color-background) px-3 py-3 font-bold text-(--color-ink) transition hover:text-(--color-primary) focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(--color-primary)"
              >
                <Mail className="h-5 w-5" />
                Email
              </a>
            </div>
          </div>
        )}

        <button
          type="button"
          onClick={() => setIsContactOpen((isOpen) => !isOpen)}
          className="inline-flex items-center gap-3 rounded-full bg-(--color-primary-dark) py-2.5 pl-2.5 pr-5 font-extrabold text-white shadow-xl transition hover:-translate-y-0.5 hover:bg-(--color-primary) focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-(--color-primary)"
          aria-expanded={isContactOpen}
          aria-controls="alfred-contact-options"
        >
          {isContactOpen ? (
            <span className="grid h-10 w-10 place-items-center rounded-full bg-(--color-secondary) text-(--color-primary-dark)">
              <X className="h-5 w-5" />
            </span>
          ) : (
            <img
              src="/images/alf.jpeg"
              alt=""
              className="h-10 w-10 rounded-full border-2 border-white/30 object-cover object-top"
            />
          )}
          Talk to Alfred
        </button>
      </div>
    </>
  );
}

export default Layout;
