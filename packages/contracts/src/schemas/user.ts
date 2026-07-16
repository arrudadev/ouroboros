import { z } from "zod";

export const userSchema = z.object({
  // Better Auth's internal ID generator, not an RFC4122 UUID.
  id: z.string().min(1),
  name: z.string().min(1).max(120),
  email: z.email(),
  createdAt: z.iso.datetime(),
});

export type User = z.infer<typeof userSchema>;

export const createUserSchema = userSchema.omit({
  id: true,
  createdAt: true,
});

export type CreateUser = z.infer<typeof createUserSchema>;

export const userListSchema = z.array(userSchema);
