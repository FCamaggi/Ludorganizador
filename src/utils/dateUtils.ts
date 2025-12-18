/**
 * @file Utilidades para manejo de fechas
 * @module utils/dateUtils
 */

import { format } from 'date-fns';
import { es } from 'date-fns/locale';

/**
 * Formatea una fecha en formato legible en español
 */
export const formatEventDate = (dateString: string): string => {
  try {
    return format(new Date(dateString), "d 'de' MMMM, yyyy - HH:mm", {
      locale: es,
    });
  } catch (error) {
    console.error('Error formatting date:', error);
    return dateString;
  }
};

/**
 * Formatea una fecha para input datetime-local
 */
export const formatDateTimeLocal = (date: Date = new Date()): string => {
  return format(date, "yyyy-MM-dd'T'HH:mm");
};

/**
 * Verifica si una fecha es futura
 */
export const isFutureDate = (dateString: string): boolean => {
  return new Date(dateString) > new Date();
};

/**
 * Verifica si una fecha es pasada
 */
export const isPastDate = (dateString: string): boolean => {
  return new Date(dateString) < new Date();
};
