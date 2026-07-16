import { useUsers } from "../hooks/useUsers";

export function UsersList() {
  const { data: users, isLoading, isError, error } = useUsers();

  if (isLoading) return <p>Loading users…</p>;
  if (isError) return <p role="alert">Failed to load users: {error.message}</p>;

  return (
    <section>
      <h2>Users</h2>
      <ul>
        {users?.map((user) => (
          <li key={user.id}>
            {user.name} — {user.email}
          </li>
        ))}
      </ul>
    </section>
  );
}
