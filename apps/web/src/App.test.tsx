import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { render, screen, waitFor } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import App from "./App";
import { useSession } from "./lib/auth-client";

vi.mock("./lib/auth-client", () => ({
  useSession: vi.fn(),
  signOut: vi.fn(),
  signIn: { email: vi.fn() },
}));

function renderApp() {
  const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  return render(
    <QueryClientProvider client={queryClient}>
      <App />
    </QueryClientProvider>,
  );
}

describe("App", () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("shows the login form when there is no session", () => {
    vi.mocked(useSession).mockReturnValue({ data: null, isPending: false } as never);

    renderApp();

    expect(screen.getByRole("heading", { name: /log in/i })).toBeInTheDocument();
  });

  it("shows the app (users list) when a session exists", async () => {
    vi.mocked(useSession).mockReturnValue({
      data: { user: { id: "u1", name: "Ada Lovelace", email: "ada@example.com" } },
      isPending: false,
    } as never);
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: true,
        json: async () => [],
      }),
    );

    renderApp();

    expect(screen.getByText(/signed in as ada@example.com/i)).toBeInTheDocument();
    await waitFor(() => {
      expect(screen.getByRole("heading", { name: /users/i })).toBeInTheDocument();
    });
  });
});
