/* eslint-disable @typescript-eslint/no-explicit-any */
const URL_BASE = import.meta.env.VITE_URL_BASE;
const PORT_EXPRESS = import.meta.env.VITE_PORT_EXPRESS;
const PORT_OBRAS = import.meta.env.VITE_OBRAS;
const API_URL = `${URL_BASE}${PORT_EXPRESS}${PORT_OBRAS}`;

import type { Obra } from "../types/types";

export const fetchObras = async (): Promise<any[]> => {
  const res = await fetch(API_URL);
  const data = await res.json();
  
  if (!res.ok) {
    throw new Error(data.error || `Error HTTP ${res.status}`);
  }
  
  return Array.isArray(data) ? data : data.obrasList || data.obras || [];
};

export const fetchComparacion = async (ids: string[]): Promise<Obra[]> => {
  if (ids.length < 2) return [];
  
  const res = await fetch(`${API_URL}/comparar?ids=${ids.join(",")}`);
  const data = await res.json();
  
  if (!res.ok) {
    throw new Error(data.error || `Error HTTP ${res.status}`);
  }
  
  return Array.isArray(data) ? data : data.obrasList || data.obras || [];
};