/**
 * Slug generation utility for product names and store names
 * Handles collision detection by appending numeric suffixes
 */

const sanitizeSlug = (text: string): string => {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "") // Remove special characters
    .replace(/\s+/g, "-") // Replace spaces with hyphens
    .replace(/-+/g, "-") // Replace multiple hyphens with single hyphen
    .replace(/^-|-$/g, ""); // Remove leading/trailing hyphens
};

/**
 * Generate slug from text (e.g., product name)
 * @param text - Input text to slugify
 * @returns Slugified text
 */
export const generateSlug = (text: string): string => {
  return sanitizeSlug(text);
};

/**
 * Handle slug collision by appending numeric suffix
 * @param baseSlug - Base slug string
 * @param existingSlugs - Array of existing slugs to check against
 * @returns Unique slug with numeric suffix if needed
 */
export const ensureUniqueSlug = (
  baseSlug: string,
  existingSlugs: string[]
): string => {
  if (!existingSlugs.includes(baseSlug)) {
    return baseSlug;
  }

  let counter = 1;
  let uniqueSlug = `${baseSlug}-${counter}`;

  while (existingSlugs.includes(uniqueSlug)) {
    counter++;
    uniqueSlug = `${baseSlug}-${counter}`;
  }

  return uniqueSlug;
};

export default {
  generateSlug,
  ensureUniqueSlug,
};
