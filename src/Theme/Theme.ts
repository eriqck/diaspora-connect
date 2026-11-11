/**
 * Shared visual tokens for Diaspora Connect.
 *
 * Palette uses deep indigo, warm neutrals, and restrained brick-red accents.
 *
 * Components can use the exported values directly or reference the CSS custom
 * properties installed by `applyTheme` (for example: var(--color-primary)).
 */
export const theme = {
  colors: {
    primary: '#292b68',
    primaryDark: '#1d1f55',
    secondary: '#a52b36',
    accent: '#202158',
    ink: '#252640',
    muted: '#68697b',
    surface: '#FFFFFF',
    background: '#faf9f8',
    border: '#e2e1e9',
  },
  radius: {
    small: '0.5rem',
    medium: '0.875rem',
    pill: '9999px',
  },
  shadow: {
    soft: '0 16px 40px rgba(32, 33, 88, 0.12)',
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