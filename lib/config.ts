// Public, client-safe config only. Server secrets (e.g. CALLMEBOT_*) are read in lib/notify.ts.
export const CONFIG = {
  github: { username: "Lualvarad0" },
  calendly: process.env.NEXT_PUBLIC_CALENDLY_URL || "https://calendly.com/REPLACE_ME",
};
