// constants/tokens.ts
// Single source of truth for all design values.
// Authority: This file is authoritative. tailwind.config.js defines the palette,
// but this file defines all semantic mappings consumed by components.

// --- Semantic Colors ---
// Each has a className (for NativeWind) and raw hex (for RN props like FontAwesome color).

export const colors = {
  text: {
    primary:   { className: 'text-gray-900 dark:text-white',        light: '#111827', dark: '#ffffff' },
    secondary: { className: 'text-gray-600 dark:text-gray-400',     light: '#4b5563', dark: '#9ca3af' },
    muted:     { className: 'text-gray-500 dark:text-gray-400',     light: '#6b7280', dark: '#9ca3af' },
    accent:    { className: 'text-sakura-600 dark:text-sakura-400',  light: '#db2777', dark: '#f472b6' },
  },
  bg: {
    primary: { className: 'bg-white dark:bg-gray-900' },
    card:    { className: 'bg-white dark:bg-gray-800' },
    muted:   { className: 'bg-gray-50 dark:bg-gray-800' },
    accent:  { className: 'bg-sakura-500' },
  },
  border: {
    default: { className: 'border-gray-200 dark:border-gray-700' },
    divider: { className: 'border-gray-200 dark:border-gray-800' },
  },
} as const;

// --- Status Colors ---

export const status = {
  success: { base: '#22c55e', bg: 'bg-green-100 dark:bg-green-900/30', text: 'text-green-700 dark:text-green-400' },
  warning: { base: '#d97706', bg: 'bg-amber-100 dark:bg-amber-900/30', text: 'text-amber-700 dark:text-amber-400' },
  error:   { base: '#ef4444', bg: 'bg-red-100 dark:bg-red-900/30',     text: 'text-red-700 dark:text-red-400' },
  info:    { base: '#3b82f6', bg: 'bg-blue-100 dark:bg-blue-900/30',   text: 'text-blue-700 dark:text-blue-400' },
} as const;

// --- Typography Scale ---

export const typography = {
  heading1: 'text-2xl font-bold',
  heading2: 'text-lg font-semibold',
  heading3: 'text-base font-semibold',
  body:     'text-base',
  caption:  'text-sm',
  label:    'text-xs font-medium uppercase tracking-wide',
  japanese: 'font-japanese',
} as const;

// --- Spacing ---

export const spacing = {
  cardPadding:   'p-4',
  sectionGap:    'gap-4',
  screenPadding: 'px-4',
} as const;

// --- Border Radii ---

export const radii = {
  card:   'rounded-2xl',
  button: 'rounded-xl',
  input:  'rounded-xl',
  badge:  'rounded-full',
  chip:   'rounded-full',
} as const;

// --- Icon Sizes ---

export const iconSize = {
  sm:  12,
  md:  16,
  lg:  20,
  xl:  24,
  xxl: 32,
} as const;

// --- Raw Colors ---
// For RN props that require hex strings (FontAwesome color, ActivityIndicator, style objects).

export const rawColors = {
  sakura500: '#ec4899',
  sakura600: '#db2777',
  gray400:   '#9ca3af',
  gray500:   '#6b7280',
  green500:  '#22c55e',
  amber600:  '#d97706',
  red500:    '#ef4444',
  blue500:   '#3b82f6',
  white:     '#ffffff',
  orange500: '#f97316',
  yellow500: '#eab308',
} as const;
