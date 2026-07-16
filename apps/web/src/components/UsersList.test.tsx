import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { render, screen, waitFor } from "@testing-library/react";
import type { ReactNode } from "react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { UsersList } from "./UsersList";

function renderWithClient(ui: ReactNode) {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  return render(<QueryClientProvider client={queryClient}>{ui}</QueryClientProvider>);
}

describe("UsersList", () => {
  beforeEach(() => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: true,
        json: async () => [
          {
            id: "8d5a2b1e-2f3a-4a9e-9c0e-6f1b2c3d4e5f",
            name: "Ada Lovelace",
            email: "ada@example.com",
            createdAt: "2026-01-01T00:00:00.000Z",
          },
        ],
      }),
    );
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("renders users returned by the API, validated against the shared contract", async () => {
    renderWithClient(<UsersList />);

    await waitFor(() => {
      expect(screen.getByText(/Ada Lovelace/)).toBeInTheDocument();
    });
  });
});
