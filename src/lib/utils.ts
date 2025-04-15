import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const getTagColor = (tag: string | undefined) => {
  if (!tag) return "#000000";
  // Generate a hash from the string
  let hash = 0;
  for (let i = 0; i < tag.length; i++) {
    hash = tag.charCodeAt(i) + ((hash << 5) - hash);
  }

  // Convert to HSL for pastel colors
  // Use hash to generate hue (0-360)
  const hue = hash % 360;
  // Fixed high lightness and low saturation for pastel effect
  return `hsl(${hue}, 70%, 85%)`;
};
