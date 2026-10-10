import { z } from "zod";

const optionalField = z.string().trim().max(200).optional();

export const leadSchema = z.object({
  service: optionalField,
  scope: optionalField,
  budget: optionalField,
  email: z.string().trim().max(254).optional(),
  summary: z.string().trim().min(1).max(6000),
});

export const contactSchema = z.object({
  name: z.string().trim().min(1).max(100),
  email: z.string().trim().max(254).email(),
  service: z.string().trim().min(1).max(100),
  message: z.string().trim().min(20).max(5000),
  // Honeypot: real users never see or fill this field.
  website: z.string().max(500).optional(),
  consent: z.literal(true),
});
