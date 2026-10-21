/**
 * Shared visual tokens for Diaspora Connect.
 *
 * Components can use the exported values directly or reference the CSS custom
 * properties installed by `applyTheme` (for example: var(--color-primary)).
 */
export const theme = {
  colors: {
    primary: '#2563EB',
    primaryDark: '#1E3A8A',
    secondary: '#F2B84B',
    accent: '#C83E4D',
    ink: '#162A26',
    muted: '#62706C',
    surface: '#FFFFFF',
    background: '#F7F5EF',
    border: '#DDE4E0',
  },
  radius: {
    small: '0.5rem',
    medium: '0.875rem',
    pill: '9999px',
  },
  shadow: {
    soft: '0 10px 30px rgba(30, 58, 138, 0.10)',
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
