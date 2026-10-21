import { Mail, MapPin, Phone } from "lucide-react";

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

function Footer() {
  return (
    <footer className="bg-(--color-primary-dark) text-white">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-12 sm:px-6 md:grid-cols-2 lg:px-8">
        <div className="max-w-md">
          <a
            href="/"
            className="inline-block rounded-lg text-2xl font-extrabold tracking-tight focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-(--color-secondary)"
            aria-label="Diaspora Help home"
          >
            Diaspora <span className="text-(--color-secondary)">Help</span>
          </a>
          <p className="mt-4 text-sm leading-6 text-white/75">
            Trusted, practical support for the diaspora handling important matters across Kenya.
          </p>
        </div>

        <div className="md:justify-self-end">
          <h2 className="text-sm font-extrabold uppercase tracking-[0.18em] text-(--color-secondary)">
            Contact us
          </h2>
          <address className="mt-4 space-y-3 text-sm not-italic text-white/80">
            <a className="flex items-center gap-3 transition hover:text-white" href="tel:+254720554657">
              <Phone className="h-4 w-4 shrink-0 text-(--color-secondary)" />
              +254 720 554 657
            </a>
            <a className="flex items-center gap-3 transition hover:text-white" href="mailto:support@diasporahelp.co.ke">
              <Mail className="h-4 w-4 shrink-0 text-(--color-secondary)" />
              support@diasporahelp.co.ke
            </a>
            <p className="flex items-center gap-3">
              <MapPin className="h-4 w-4 shrink-0 text-(--color-secondary)" />
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
                className="grid h-10 w-10 place-items-center rounded-full border border-white/20 text-white/80 transition hover:border-(--color-secondary) hover:bg-(--color-secondary) hover:text-(--color-primary-dark) focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(--color-secondary)"
              >
                <Icon className="h-5 w-5" />
              </a>
            ))}
          </div>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="mx-auto flex max-w-7xl flex-col gap-2 px-4 py-5 text-xs text-white/65 sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8">
          <p>&copy; {currentYear} Diaspora Help. All rights reserved.</p>
          <p>
            Developed by <span className="font-bold text-(--color-secondary)">Munax Digital Solutions</span>
          </p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
