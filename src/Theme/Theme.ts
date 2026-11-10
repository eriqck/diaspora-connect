/**
 * Shared visual tokens for Diaspora Connect.
 *
 * Palette is based on the Kenyan flag: black, red, and green, with white
 * (the flag's fringes) used for surfaces.
 *
 * Components can use the exported values directly or reference the CSS custom
 * properties installed by `applyTheme` (for example: var(--color-primary)).
 */
export const theme = {
  colors: {
    primary: '#006600',     // flag green
    primaryDark: '#004A00', // deep green for hover/pressed states
    secondary: '#BB0000',   // flag red
    accent: '#000000',      // flag black
    ink: '#111111',         // near-black body text
    muted: '#5F6B63',
    surface: '#FFFFFF',     // flag white
    background: '#F6F6F2',
    border: '#DCE3DD',
  },
  radius: {
    small: '0.5rem',
    medium: '0.875rem',
    pill: '9999px',
  },
  shadow: {
    soft: '0 10px 30px rgba(0, 74, 0, 0.10)',
  },
} as const

const cssVariables: Record<string, string> = {
  '--color-primary': theme.colors.primary,
  '--color-primary-dark': theme.colors.primaryDark,
  '--color-secondary': theme.colors.secondary,
  '--color-accent': theme.colors.accent,
  '--color-ink': theme.colors.ink,
  '--color-muted': theme.colors.muted,
  '--color-surface': theme.colors.surface,
  '--color-background': theme.colors.background,
  '--color-border': theme.colors.border,
  '--radius-small': theme.radius.small,
  '--radius-medium': theme.radius.medium,
  '--radius-pill': theme.radius.pill,
  '--shadow-soft': theme.shadow.soft,
}

export function applyTheme(root: HTMLElement = document.documentElement) {
  Object.entries(cssVariables).forEach(([property, value]) => {
    root.style.setProperty(property, value)
  })
}

export type AppTheme = typeof theme