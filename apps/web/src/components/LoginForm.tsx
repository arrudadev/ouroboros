import { loginSchema } from "@ouroboros/contracts";
import { type FormEvent, useState } from "react";
import { signIn } from "../lib/auth-client";

export function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);

    const parsed = loginSchema.safeParse({ email, password });
    if (!parsed.success) {
      setError(parsed.error.issues[0]?.message ?? "Invalid email or password");
      return;
    }

    setIsSubmitting(true);
    const { error: signInError } = await signIn.email(parsed.data);
    setIsSubmitting(false);

    if (signInError) {
      setError(signInError.message ?? "Invalid email or password");
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <h1>Log in</h1>
      <input
        aria-label="Email"
        type="email"
        placeholder="Email"
        value={email}
        onChange={(event) => setEmail(event.target.value)}
        required
      />
      <input
        aria-label="Password"
        type="password"
        placeholder="Password"
        value={password}
        onChange={(event) => setPassword(event.target.value)}
        required
      />
      <button type="submit" disabled={isSubmitting}>
        {isSubmitting ? "Signing in…" : "Log in"}
      </button>
      {error && <p role="alert">{error}</p>}
    </form>
  );
}
