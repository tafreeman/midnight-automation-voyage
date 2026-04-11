import { sections, type SectionId } from "./model";

export function parseHash(hash: string): SectionId | null {
  const value = hash.replace(/^#/, "").trim();
  if (!value) return "layouts";
  if (!/^[a-z-]+$/.test(value)) return "layouts";
  return sections.some((section) => section.id === value) ? (value as SectionId) : null;
}
