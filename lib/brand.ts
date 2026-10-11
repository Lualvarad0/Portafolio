export const BRAND = "Cornerstone Develop";
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
