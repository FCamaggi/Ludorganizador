/**
 * @file Paleta de colores basada en la comunidad de juegos de mesa
 * @module constants/colors
 */

/**
 * Paleta de colores principal
 */
export const COLORS = {
  // Primario - Identidad
  primary: {
    DEFAULT: '#FFBC0A', // Amber Flame
    hover: '#E6A909',
    light: '#FFD966',
    dark: '#CC9608',
  },

  // Secundario - Navegación
  secondary: {
    DEFAULT: '#EC7D10', // Tiger Orange
    hover: '#D47010',
    light: '#F39C42',
    dark: '#BC640D',
  },

  // Acento A - Acción
  accent: {
    DEFAULT: '#FC2F00', // Scarlet Fire
    hover: '#D42800',
    light: '#FD5C3A',
    dark: '#C42600',
  },

  // Acento B - Interacción
  interaction: {
    DEFAULT: '#EC0868', // Razzmatazz
    hover: '#C8065A',
    light: '#F23C8B',
    dark: '#B40551',
  },

  // Destacado - Comunidad
  community: {
    DEFAULT: '#C200FB', // Hyper Magenta
    hover: '#A000D4',
    light: '#D433FC',
    dark: '#9A00C8',
  },

  // Base Neutra
  neutral: {
    white: '#FFFFFF',
    offWhite: '#F9FAFB',
    gray: {
      50: '#F9FAFB',
      100: '#F3F4F6',
      200: '#E5E7EB',
      300: '#D1D5DB',
      400: '#9CA3AF',
      500: '#6B7280',
      600: '#4B5563',
      700: '#374151',
      800: '#1F2937',
      900: '#111827',
    },
    dark: '#1A1A1A',
  },
} as const;

/**
 * Badges colors
 */
export const BADGE_COLORS = {
  veterano: 'bg-purple-100 text-purple-800',
  vip: 'bg-yellow-100 text-yellow-800',
  organizador: 'bg-blue-100 text-blue-800',
  fundador: 'bg-pink-100 text-pink-800',
} as const;

/**
 * Status colors
 */
export const STATUS_COLORS = {
  success: '#10B981',
  error: '#EF4444',
  warning: '#F59E0B',
  info: '#3B82F6',
} as const;

/**
 * Gradients
 */
export const GRADIENTS = {
  header: 'from-[#EC7D10] to-[#FC2F00]',
  card: 'from-[#FFBC0A] to-[#EC7D10]',
  community: 'from-[#EC0868] to-[#C200FB]',
  action: 'from-[#FC2F00] to-[#EC0868]',
} as const;
