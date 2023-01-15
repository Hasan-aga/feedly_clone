import { useSession, signIn, signOut } from "next-auth/react";
import { User } from "@nextui-org/react";

export default function Profile() {
  const { data: session } = useSession();
  if (session) {
    return (
      <>
        <User src={session.user.image} name={session.user.name} />
        <br />
        <button onClick={() => signOut()}>Sign out</button>
      </>
    );
  }
  return (
    <>
      Not signed in <br />
      <button onClick={() => signIn()}>Sign in</button>
    </>
  );
}
