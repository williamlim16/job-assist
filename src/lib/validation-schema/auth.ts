import z from "zod";

export const authSchema = z.object({
  name: z.string({ message: "Name is required" }),
  email: z
    .string({ message: "Email is required" })
    .email("Email should be a valid email"),
  password: z
    .string({ message: "Password is required" })
    .min(8, "Password should be at least 8 characters"),
});

export const registerSchema = z.object({
  name: z.string({ message: "Name is required" }),
  email: z
    .string({ message: "Email is required" })
    .email("Email should be a valid email"),
  password: z
    .string({ message: "Password is required" })
    .min(8, "Password should be at least 8 characters"),
});

export const loginSchema = z.object({
  email: z
    .string({ message: "Email is required" })
    .email("Email should be a valid email"),
  password: z
    .string({ message: "Password is required" })
    .min(8, "Password should be at least 8 characters"),
});
