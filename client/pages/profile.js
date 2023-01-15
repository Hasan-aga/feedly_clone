import { useSession, signIn, signOut } from "next-auth/react";
import { User, Grid, Button } from "@nextui-org/react";
import CustomModal from "@/components/modal";
import { useState } from "react";

export default function Profile() {
  const { data: session } = useSession();
  const [visible, setVisible] = useState(false);
  if (session) {
    return (
      <>
        <User src={session.user.image} name={session.user.name} />
        <br />
        <Button onPress={() => signOut()}>Sign out</Button>
        <Grid>
          <Button onPress={() => setVisible(true)}>Add a feed</Button>
          <CustomModal
            visible={visible}
            closeHandler={() => setVisible(false)}
          />
        </Grid>
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
