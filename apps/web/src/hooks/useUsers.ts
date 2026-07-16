import {
  type CreateUser,
  createUserSchema,
  userListSchema,
  userSchema,
} from "@ouroboros/contracts";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "../lib/api";

const usersQueryKey = ["users"] as const;

export function useUsers() {
  return useQuery({
    queryKey: usersQueryKey,
    queryFn: () => apiRequest("/users", userListSchema),
  });
}

export function useCreateUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: CreateUser) => {
      // Validate on the way out too: fail fast in the browser instead of
      // relying solely on the server's ZodValidationPipe.
      const body = createUserSchema.parse(input);
      return apiRequest("/users", userSchema, { method: "POST", body });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: usersQueryKey });
    },
  });
}
