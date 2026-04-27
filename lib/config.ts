export const CONFIG = {
  emailjs: {
    publicKey: process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY || "REPLACE_ME",
    serviceId: process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID || "REPLACE_ME",
    templateId: process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID || "REPLACE_ME",
  },
  callmebot: {
    phone: process.env.NEXT_PUBLIC_CALLMEBOT_PHONE || "REPLACE_ME",
    apikey: process.env.NEXT_PUBLIC_CALLMEBOT_APIKEY || "REPLACE_ME",
  },
  github: { username: "Lualvarad0" },
  calendly: process.env.NEXT_PUBLIC_CALENDLY_URL || "https://calendly.com/REPLACE_ME",
};
