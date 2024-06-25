import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { GeistSans } from "geist/font/sans";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const fontSans = GeistSans;
