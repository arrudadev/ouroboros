import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { signIn } from "../lib/auth-client";
import { LoginForm } from "./LoginForm";

vi.mock("../lib/auth-client", () => ({
  signIn: { email: vi.fn() },
}));

describe("LoginForm", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("shows an error and stays usable when the credentials are invalid", async () => {
    vi.mocked(signIn.email).mockResolvedValue({
      data: null,
      error: { message: "Invalid email or password" },
    } as never);

    const user = userEvent.setup();
    render(<LoginForm />);

    await user.type(screen.getByLabelText(/email/i), "ada@example.com");
    await user.type(screen.getByLabelText(/password/i), "wrong-password");
    await user.click(screen.getByRole("button", { name: /log in/i }));

    await waitFor(() => {
      expect(screen.getByRole("alert")).toHaveTextContent(/invalid email or password/i);
    });

    // The UI isn't stuck: the form is still there and usable, not crashed.
    expect(screen.getByLabelText(/email/i)).toBeEnabled();
    expect(screen.getByRole("button", { name: /log in/i })).toBeEnabled();
  });

  it("rejects an obviously invalid email client-side without calling the API", async () => {
    const user = userEvent.setup();
    render(<LoginForm />);

    await user.type(screen.getByLabelText(/email/i), "not-an-email");
    await user.type(screen.getByLabelText(/password/i), "password123");
    await user.click(screen.getByRole("button", { name: /log in/i }));

    expect(signIn.email).not.toHaveBeenCalled();
  });
});
