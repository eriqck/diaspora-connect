type IconProps = {
  className?: string;
};

const PhoneIcon = ({ className }: IconProps) => (
  <svg
    aria-hidden="true"
    className={className}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M2.25 4.5A2.25 2.25 0 0 1 4.5 2.25h2.1c.52 0 .97.35 1.1.85l.87 3.48a1.13 1.13 0 0 1-.39 1.14l-1.56 1.2a15.75 15.75 0 0 0 8.46 8.46l1.2-1.56a1.13 1.13 0 0 1 1.14-.39l3.48.87c.5.13.85.58.85 1.1v2.1a2.25 2.25 0 0 1-2.25 2.25h-1.13C9.47 21.75 2.25 14.53 2.25 5.63V4.5Z"
    />
  </svg>
);

const MailIcon = ({ className }: IconProps) => (
  <svg
    aria-hidden="true"
    className={className}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M3.75 5.25h16.5c.83 0 1.5.67 1.5 1.5v10.5c0 .83-.67 1.5-1.5 1.5H3.75c-.83 0-1.5-.67-1.5-1.5V6.75c0-.83.67-1.5 1.5-1.5Z"
    />
    <path strokeLinecap="round" strokeLinejoin="round" d="m3 6 9 6 9-6" />
  </svg>
);

const FacebookIcon = ({ className }: IconProps) => (
  <svg
    aria-hidden="true"
    className={className}
    viewBox="0 0 24 24"
    fill="currentColor"
  >
    <path d="M24 12.07C24 5.4 18.63 0 12 0S0 5.4 0 12.07C0 18.1 4.39 23.1 10.13 24v-8.44H7.08v-3.49h3.05V9.41c0-3.03 1.79-4.7 4.53-4.7 1.31 0 2.69.24 2.69.24v2.97h-1.51c-1.49 0-1.96.93-1.96 1.89v2.26h3.33l-.53 3.49h-2.8V24C19.61 23.1 24 18.1 24 12.07Z" />
  </svg>
);

const InstagramIcon = ({ className }: IconProps) => (
  <svg
    aria-hidden="true"
    className={className}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
  >
    <rect x="3" y="3" width="18" height="18" rx="5" />
    <circle cx="12" cy="12" r="4" />
    <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
  </svg>
);

const LinkedInIcon = ({ className }: IconProps) => (
  <svg
    aria-hidden="true"
    className={className}
    viewBox="0 0 24 24"
    fill="currentColor"
  >
    <path d="M5.34 7.5A2.17 2.17 0 1 0 5.34 3.16a2.17 2.17 0 0 0 0 4.34ZM3.5 20.5h3.68V9H3.5v11.5ZM9.4 9h3.53v1.57h.05c.49-.93 1.69-1.91 3.48-1.91 3.72 0 4.41 2.45 4.41 5.64v6.2h-3.68V15c0-1.31-.02-3-1.83-3-1.83 0-2.11 1.43-2.11 2.91v5.59H9.4V9Z" />
  </svg>
);

const XIcon = ({ className }: IconProps) => (
  <svg
    aria-hidden="true"
    className={className}
    viewBox="0 0 24 24"
    fill="currentColor"
  >
    <path d="M18.9 2H22l-6.77 7.74L23.2 22h-6.24l-4.89-6.39L6.48 22H3.36l7.26-8.3L2.97 2h6.4l4.42 5.84L18.9 2Zm-1.1 17.84h1.72L8.43 4.05H6.58L17.8 19.84Z" />
  </svg>
);

const socialLinks = [
  { label: "Facebook", href: "https://www.facebook.com", Icon: FacebookIcon },
  {
    label: "Instagram",
    href: "https://www.instagram.com",
    Icon: InstagramIcon,
  },
  { label: "LinkedIn", href: "https://www.linkedin.com", Icon: LinkedInIcon },
  { label: "X", href: "https://x.com", Icon: XIcon },
];

const contactLinkClass =
  "group inline-flex items-center gap-2 text-xs font-semibold text-white/95 transition-colors hover:text-white hover:underline hover:underline-offset-4 focus-visible:rounded focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white";

const contactChipClass =
  "grid h-6 w-6 place-items-center rounded-full bg-[#00845a] text-white transition-colors group-hover:bg-(--color-secondary) group-focus-visible:bg-(--color-secondary)";

const socialLinkClass =
  "grid h-7 w-7 place-items-center rounded-full border border-white/45 text-white/80 transition-colors hover:border-[#00845a] hover:bg-[#00845a] hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white";

function TopBar() {
  return (
    <aside
      className="bg-black text-white"
      aria-label="Contact information"
    >
      <div className="mx-auto flex min-h-11 max-w-7xl flex-col items-center justify-between gap-2 px-4 py-1.5 sm:flex-row sm:px-6 lg:px-8">
        <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-1 sm:justify-start">
          <a className={contactLinkClass} href="tel:+254720554657">
            <span className={contactChipClass}>
              <PhoneIcon className="h-3.5 w-3.5" />
            </span>
            <span>+254 720 554 657</span>
          </a>
          <a
            className={contactLinkClass}
            href="mailto:support@msaidizidiaspora.co.ke"
          >
            <span className={contactChipClass}>
              <MailIcon className="h-3.5 w-3.5" />
            </span>
            <span>support@msaidizidiaspora.co.ke</span>
          </a>
        </div>

        <div
          className="flex items-center gap-2"
          aria-label="Follow Diaspora Connect"
        >
          <span className="mr-1 hidden text-xs font-medium tracking-wide text-white/90 md:inline">
            Follow us
          </span>
          {socialLinks.map(({ label, href, Icon }) => (
            <a
              key={label}
              className={socialLinkClass}
              href={href}
              target="_blank"
              rel="noreferrer"
              aria-label={`Follow us on ${label}`}
            >
              <Icon className="h-4 w-4" />
            </a>
          ))}
        </div>
      </div>
      <div aria-hidden="true" className="flex flex-col">
        <span className="h-1 bg-[#b3132b]" />
        <span className="h-1 bg-white" />
        <span className="h-1 bg-[#00845a]" />
      </div>
    </aside>
  );
}

export default TopBar;