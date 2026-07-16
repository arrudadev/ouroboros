import { type FormEvent, useState } from "react";
import { useCreateUser, useUsers } from "../hooks/useUsers";

export function UsersList() {
  const { data: users, isLoading, isError, error } = useUsers();
  const createUser = useCreateUser();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    createUser.mutate(
      { name, email },
      {
        onSuccess: () => {
          setName("");
          setEmail("");
        },
      },
    );
  }

  if (isLoading) return <p>Loading users…</p>;
  if (isError) return <p role="alert">Failed to load users: {error.message}</p>;

  return (
    <section>
      <h1>Users</h1>
      <ul>
        {users?.map((user) => (
          <li key={user.id}>
            {user.name} — {user.email}
          </li>
        ))}
      </ul>

      <form onSubmit={handleSubmit}>
        <input
          aria-label="Name"
          placeholder="Name"
          value={name}
          onChange={(event) => setName(event.target.value)}
          required
        />
        <input
          aria-label="Email"
          type="email"
          placeholder="Email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          required
        />
        <button type="submit" disabled={createUser.isPending}>
          {createUser.isPending ? "Adding…" : "Add user"}
        </button>
      </form>

      {createUser.isError && <p role="alert">{createUser.error.message}</p>}
    </section>
  );
}
