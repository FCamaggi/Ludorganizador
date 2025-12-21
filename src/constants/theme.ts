/**
 * @file Configuración de temas (claro y oscuro)
 * @module constants/theme
 */

import { COLORS } from './colors';

/**
 * Tema claro
 */
export const LIGHT_THEME = {
  // Colores de la paleta
  primary: COLORS.primary, // Amber Flame
  secondary: COLORS.secondary, // Tiger Orange
  accent: COLORS.accent, // Scarlet Fire
  interaction: COLORS.interaction, // Razzmatazz
  community: COLORS.community, // Hyper Magenta
  // Fondos - tonos más suaves y cálidos
  bg: {
    primary: '#F5F3F0', // Beige muy claro
    secondary: '#EBE8E3', // Beige claro
    tertiary: '#E0DCD5', // Beige medio
    elevated: '#FDFCFB', // Casi blanco con tono cálido
  },

  // Textos - más contraste
  text: {
    primary: '#1C1917', // stone-900 - casi negro cálido
    secondary: '#44403C', // stone-700 - gris oscuro cálido
    tertiary: '#78716C', // stone-500 - gris medio
    inverse: '#FDFCFB',
  },

  // Bordes - más visibles
  border: {
    light: '#D6D3D1', // stone-300
    medium: '#A8A29E', // stone-400
    heavy: '#78716C', // stone-500
  },

  // Estados
  state: {
    hover: 'rgba(28, 25, 23, 0.06)',
    pressed: 'rgba(28, 25, 23, 0.10)',
    disabled: 'rgba(28, 25, 23, 0.14)',
    error: '#DC2626', // red-600
  },

  // Sombras - más suaves
  shadow: {
    sm: '0 1px 2px 0 rgba(0, 0, 0, 0.08)',
    md: '0 4px 6px -1px rgba(0, 0, 0, 0.12)',
    lg: '0 10px 15px -3px rgba(0, 0, 0, 0.15)',
  },
} as const;

/**
 * Tema oscuro
 */
export const DARK_THEME = {
  // Colores de la paleta (más vibrantes en modo oscuro)
  primary: COLORS.primary, // Amber Flame
  secondary: COLORS.secondary, // Tiger Orange
  accent: COLORS.accent, // Scarlet Fire
  interaction: COLORS.interaction, // Razzmatazz
  community: COLORS.community, // Hyper Magenta
  // Fondos
  bg: {
    primary: '#0F172A', // slate-900
    secondary: '#1E293B', // slate-800
    tertiary: '#334155', // slate-700
    elevated: '#1E293B',
  },

  // Textos
  text: {
    primary: '#F1F5F9', // slate-100
    secondary: '#CBD5E1', // slate-300
    tertiary: '#94A3B8', // slate-400
    inverse: '#0F172A',
  },

  // Bordes
  border: {
    light: '#334155', // slate-700
    medium: '#475569', // slate-600
    heavy: '#64748B', // slate-500
  },

  // Estados
  state: {
    hover: 'rgba(255, 255, 255, 0.08)',
    pressed: 'rgba(255, 255, 255, 0.12)',
    disabled: 'rgba(255, 255, 255, 0.18)',
    error: '#EF4444', // red-500
  },

  // Sombras
  shadow: {
    sm: '0 1px 2px 0 rgba(0, 0, 0, 0.5)',
    md: '0 4px 6px -1px rgba(0, 0, 0, 0.6)',
    lg: '0 10px 15px -3px rgba(0, 0, 0, 0.7)',
  },
} as const;

/**
 * Obtiene el tema según el modo
 */
export const getTheme = (isDark: boolean) =>
  isDark ? DARK_THEME : LIGHT_THEME;

export type Theme = typeof LIGHT_THEME;
