import { useSession, signIn, signOut } from "next-auth/react";
import { User, Grid, Button, Card, Text, Spacer } from "@nextui-org/react";
import CustomModal from "@/pages/modal";
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
        <Spacer y={1} />
        <Grid>
          <Button onPress={() => setVisible(true)}>Add a feed</Button>
          <CustomModal
            visible={visible}
            closeHandler={() => setVisible(false)}
          />
        </Grid>
        <Spacer y={2} />
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
