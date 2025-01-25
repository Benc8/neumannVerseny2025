import { z } from "zod";

export const signInSchema = z.object({
  email: z.string().email("Érvényes e-mail címet adj meg!"),
  password: z
    .string()
    .min(6, "A jelszónak legalább 6 karakter hosszúnak kell lennie!")
    .max(20, "A jelszó nem lehet hosszabb 20 karakternél!"),
});
export const signUpSchema = z.object({
  fullName: z
    .string()
    .min(3, "A névnek legalább 3 karakter hosszúnak kell lennie!"),
  email: z.string().email("Érvényes e-mail címet adj meg!"),
  password: z
    .string()
    .min(6, "A jelszónak legalább 6 karakter hosszúnak kell lennie!")
    .max(20, "A jelszó nem lehet hosszabb 20 karakternél!"),
});

export const foodSchema = z.object({
  name: z.string().min(3, "Az étel neve legalább 3 karakter legyen"),
  description: z.string().optional(),
  category: z.string().min(1, "Válassz egy kategóriát"),
  image: z.string().optional(),
  allergens: z.array(z.string()).optional(),
});
