import { Mail, MapPin, Phone } from "lucide-react";
import msaidiziLogo from "../../assets/msaidizi-diaspora-logo.png";

type SocialIconProps = {
  className?: string;
};

const FacebookIcon = ({ className }: SocialIconProps) => (
  <svg aria-hidden="true" className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M13.5 22v-9h3l.5-3.5h-3.5V7.25c0-1.02.28-1.71 1.75-1.71H17V2.41A23.6 23.6 0 0 0 14.45 2C11.93 2 10.2 3.54 10.2 6.38V9.5H7.35V13h2.85v9h3.3Z" />
  </svg>
);

const InstagramIcon = ({ className }: SocialIconProps) => (
  <svg aria-hidden="true" className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <rect x="3" y="3" width="18" height="18" rx="5" />
    <circle cx="12" cy="12" r="4" />
    <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
  </svg>
);

const LinkedInIcon = ({ className }: SocialIconProps) => (
  <svg aria-hidden="true" className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M6.5 8.25H3V21h3.5V8.25ZM4.75 3A2.05 2.05 0 1 0 4.75 7.1 2.05 2.05 0 0 0 4.75 3ZM21 13.7c0-3.84-2.05-5.63-4.79-5.63a4.13 4.13 0 0 0-3.73 2.05V8.25H9V21h3.48v-6.31c0-1.66.32-3.27 2.38-3.27 2.03 0 2.05 1.9 2.05 3.38V21H21v-7.3Z" />
  </svg>
);

const socialLinks = [
  { label: "Facebook", href: "https://www.facebook.com", Icon: FacebookIcon },
  { label: "Instagram", href: "https://www.instagram.com", Icon: InstagramIcon },
  { label: "LinkedIn", href: "https://www.linkedin.com", Icon: LinkedInIcon },
];

const currentYear = new Date().getFullYear();

const contactRowClass =
  "group flex items-center gap-3 text-white/85 transition-colors hover:text-white focus-visible:rounded focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white";

const contactChipClass =
  "grid h-8 w-8 shrink-0 place-items-center rounded-full bg-(--color-primary) text-white transition-colors group-hover:bg-(--color-secondary) group-focus-visible:bg-(--color-secondary)";

const socialLinkClass =
  "grid h-10 w-10 place-items-center rounded-full border border-white/25 text-white/85 transition-colors hover:border-(--color-secondary) hover:bg-(--color-secondary) hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white";

function Footer() {
  return (
    <footer className="bg-(--color-accent) text-white">
      {/* Flag stripes: red, white, green, sitting on the black footer */}
      <div aria-hidden="true" className="flex flex-col">
        <div className="h-1 bg-(--color-secondary)" />
        <div className="h-px bg-white" />
        <div className="h-1 bg-(--color-primary)" />
      </div>

      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-12 sm:px-6 md:grid-cols-2 lg:px-8">
        <div className="max-w-md">
          <a
            href="/"
            className="inline-flex items-center gap-3 rounded-lg focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white"
            aria-label="Msaidizi Diaspora home"
          >
            <img
              src={msaidiziLogo}
              alt=""
              className="h-16 w-16 shrink-0 object-contain"
            />
            <span className="text-2xl font-extrabold tracking-tight">
              Msaidizi Diaspora
            </span>
          </a>
          <p className="mt-4 text-sm leading-6 text-white/75">
            Trusted, practical support for Kenyans abroad handling important matters across Kenya.
          </p>
          <a
            href="https://developererik.me"
            target="_blank"
            rel="noreferrer"
            className="mt-3 inline-flex rounded-lg text-sm font-bold text-white/85 underline decoration-(--color-secondary) underline-offset-4 transition hover:text-white focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white"
          >
            Designed by Developer Erik
          </a>
        </div>

        <div className="md:justify-self-end">
          <h2 className="text-sm font-extrabold uppercase tracking-[0.18em] text-white">
            Contact us
            <span
              aria-hidden="true"
              className="mt-2 block h-0.5 w-10 rounded-full bg-(--color-secondary)"
            />
          </h2>

          <address className="mt-5 space-y-3 text-sm not-italic">
            <a className={contactRowClass} href="tel:+254720554657">
              <span className={contactChipClass}>
                <Phone className="h-4 w-4" aria-hidden="true" />
              </span>
              +254 720 554 657
            </a>
            <a className={contactRowClass} href="mailto:support@msaidizidiaspora.co.ke">
              <span className={contactChipClass}>
                <Mail className="h-4 w-4" aria-hidden="true" />
              </span>
              support@msaidizidiaspora.co.ke
            </a>
            <p className="flex items-center gap-3 text-white/85">
              <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-(--color-primary) text-white">
                <MapPin className="h-4 w-4" aria-hidden="true" />
              </span>
              Nairobi, Kenya
            </p>
          </address>

          <div className="mt-6 flex gap-3" aria-label="Social media links">
            {socialLinks.map(({ label, href, Icon }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noreferrer"
                aria-label={label}
                className={socialLinkClass}
              >
                <Icon className="h-5 w-5" />
              </a>
            ))}
          </div>
        </div>
      </div>

      <div className="border-t border-white/15">
        <div className="mx-auto flex max-w-7xl flex-col gap-2 px-4 py-5 text-xs text-white/70 sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8">
          <p>&copy; {currentYear} Msaidizi Diaspora. All rights reserved.</p>
          <div className="text-left sm:text-right">
            <p>
              Developed by{" "}
              <span className="font-bold text-white underline decoration-(--color-secondary) decoration-2 underline-offset-4">
                Munax Digital Solutions
              </span>
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;