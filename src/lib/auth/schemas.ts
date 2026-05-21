import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().trim().email("Enter a valid email."),
  password: z.string().min(8, "At least 8 characters."),
});

export const signupSchema = z
  .object({
    name: z.string().trim().min(2, "Name is required.").max(80),
    email: z.string().trim().email("Enter a valid email."),
    institution: z.string().trim().max(120).optional(),
    password: z
      .string()
      .min(8, "At least 8 characters.")
      .regex(/[A-Z]/, "Add an uppercase letter.")
      .regex(/[0-9]/, "Add a number."),
    confirm: z.string(),
    accept: z.boolean().refine((v) => v, "You must accept the terms."),
  })
  .refine((d) => d.password === d.confirm, { path: ["confirm"], message: "Passwords must match." });

export const contactSchema = z.object({
  name: z.string().trim().min(2, "Name is required.").max(80),
  email: z.string().trim().email("Enter a valid email."),
  subject: z.string().trim().min(3, "Subject is required.").max(120),
  message: z.string().trim().min(10, "Tell us a little more.").max(2000),
});

export type LoginInput = z.infer<typeof loginSchema>;
export type SignupInput = z.infer<typeof signupSchema>;
export type ContactInput = z.infer<typeof contactSchema>;

export function passwordStrength(pw: string): { score: 0 | 1 | 2 | 3 | 4; label: string } {
  let score = 0;
  if (pw.length >= 8) score++;
  if (/[A-Z]/.test(pw)) score++;
  if (/[0-9]/.test(pw)) score++;
  if (/[^A-Za-z0-9]/.test(pw)) score++;
  const labels = ["Too weak", "Weak", "Fair", "Strong", "Excellent"] as const;
  return { score: score as 0 | 1 | 2 | 3 | 4, label: labels[score] };
}
