export const BRAND = "Cornerstone Develop";
/** Full name, as people search for it. */
export const OWNER = "David Alvarado Ronquillo";
export const OWNER_SHORT = "David Alvarado";
export const GITHUB_URL = "https://github.com/Lualvarad0";
export const CONTACT_EMAIL = "lui.alv.ron.25@gmail.com";
export const WHATSAPP_NUMBER = "593960730449";
export const LINKEDIN_URL = "https://linkedin.com/in/david-alvarado-ronquillo";

/** Self-hosted hero videos (Mixkit free licence), on desktop and mobile. */
export const VIDEOS = {
  base: "/videos/base.mp4",
  reveal: "/videos/codigo.mp4",
};

export const mailto = (subject: string) =>
  `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(subject)}`;
