import { userListSchema } from "@ouroboros/contracts";
import { useQuery } from "@tanstack/react-query";
import { apiRequest } from "../lib/api";

export function useUsers() {
  return useQuery({
    queryKey: ["users"],
    queryFn: () => apiRequest("/users", userListSchema),
  });
}
