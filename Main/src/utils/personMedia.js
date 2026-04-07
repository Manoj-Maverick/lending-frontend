import { API_BASE_URL } from "api/client";

const GENDER_VARIANTS = {
  male: {
    background: "#dbeafe",
    foreground: "#1d4ed8",
    badge: "M",
  },
  female: {
    background: "#fce7f3",
    foreground: "#be185d",
    badge: "F",
  },
  other: {
    background: "#e5e7eb",
    foreground: "#475569",
    badge: "U",
  },
};

export function toApiAssetUrl(path) {
  if (!path) return "";
  if (/^https?:\/\//i.test(path) || path.startsWith("data:")) return path;
  return `${API_BASE_URL}${path.startsWith("/") ? "" : "/"}${path}`;
}

export function normalizeGender(value) {
  const normalized = String(value || "").trim().toLowerCase();
  if (["male", "man", "m"].includes(normalized)) return "male";
  if (["female", "woman", "f"].includes(normalized)) return "female";
  return "other";
}

export function getInitials(name) {
  if (!name) return "?";
  const parts = String(name)
    .trim()
    .split(/\s+/)
    .filter(Boolean);

  if (parts.length === 0) return "?";
  if (parts.length === 1) return parts[0].slice(0, 1).toUpperCase();
  return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
}

export function buildGenderFallbackAvatar({ name, gender }) {
  const initials = getInitials(name);
  const variant = GENDER_VARIANTS[normalizeGender(gender)] || GENDER_VARIANTS.other;
  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" width="160" height="160" viewBox="0 0 160 160" fill="none">
      <rect width="160" height="160" rx="28" fill="${variant.background}"/>
      <circle cx="80" cy="58" r="26" fill="${variant.foreground}" opacity="0.18"/>
      <path d="M80 88c-24.301 0-44 15.252-44 34.065V128h88v-5.935C124 103.252 104.301 88 80 88Z" fill="${variant.foreground}" opacity="0.18"/>
      <circle cx="120" cy="40" r="16" fill="${variant.foreground}"/>
      <text x="120" y="45" text-anchor="middle" font-family="Arial, sans-serif" font-size="12" font-weight="700" fill="white">${variant.badge}</text>
      <text x="80" y="104" text-anchor="middle" font-family="Arial, sans-serif" font-size="32" font-weight="700" fill="${variant.foreground}">${initials}</text>
    </svg>
  `.trim();

  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}

export function resolvePersonImage(person = {}, fallback = {}) {
  const imagePath =
    person.image ||
    person.photo ||
    person.photo_url ||
    person.photoUrl ||
    person.avatar ||
    person.avatar_url ||
    person.profile_pic ||
    person.profilePic ||
    fallback.image ||
    fallback.photo ||
    fallback.avatar;

  if (imagePath) {
    return toApiAssetUrl(imagePath);
  }

  return buildGenderFallbackAvatar({
    name: person.name || person.full_name || person.client_name || fallback.name,
    gender: person.gender || fallback.gender,
  });
}
