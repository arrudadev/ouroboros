import { LoginForm } from "./components/LoginForm";
import { UsersList } from "./components/UsersList";
import { signOut, useSession } from "./lib/auth-client";

function App() {
  const { data: session, isPending } = useSession();

  if (isPending) return <p>Loading…</p>;

  if (!session) {
    return (
      <main>
        <LoginForm />
      </main>
    );
  }

  return (
    <main>
      <header>
        <p>Signed in as {session.user.email}</p>
        <button type="button" onClick={() => signOut()}>
          Sign out
        </button>
      </header>
      <UsersList />
    </main>
  );
}

export default App;
