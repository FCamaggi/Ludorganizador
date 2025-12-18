/**
 * @file Validadores de datos
 * @module utils/validators
 */

import { LIMITS } from '../constants';

/**
 * Valida un email
 */
export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Valida una contraseña
 */
export const isValidPassword = (password: string): boolean => {
  return password.length >= LIMITS.MIN_PASSWORD_LENGTH;
};

/**
 * Valida un rango de jugadores
 */
export const isValidPlayerRange = (min: number, max: number): boolean => {
  return min >= LIMITS.MIN_PLAYERS && max <= LIMITS.MAX_PLAYERS && min <= max;
};

/**
 * Valida un título
 */
export const isValidTitle = (title: string): boolean => {
  return title.trim().length > 0 && title.length <= LIMITS.MAX_TITLE_LENGTH;
};

/**
 * Valida una descripción
 */
export const isValidDescription = (description: string): boolean => {
  return description.length <= LIMITS.MAX_DESCRIPTION_LENGTH;
};
