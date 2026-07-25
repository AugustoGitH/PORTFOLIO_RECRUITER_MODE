import type { Primitive } from "../types";


export const normalizeString = (text: Primitive) =>
  String(text)
    .toLowerCase() // Convert to lowercase
    .normalize('NFD') // Normalize to separate accents from base letters
    .replace(/[\u0300-\u036f]/g, '') // Remove diacritic characters (accents)
    .replace(/[^\w\s-]/g, '') // Remove special characters except spaces and hyphens
    .trim() // Remove leading and trailing spaces
