import { useSession, signIn, signOut } from "next-auth/react";
import { User, Grid, Button } from "@nextui-org/react";
import CustomModal from "@/pages/modal";
import { useState } from "react";
import { unstable_getServerSession } from "next-auth";
import { getFeedsOfUser } from "@/lib/db";

export default function Profile(props) {
  console.log("links", props);
  const { data: session } = useSession();
  console.log(session);
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

// This gets called on every request
export async function getServerSideProps({ req, res }) {
  const session = await unstable_getServerSession(req, res);
  // console.log("session:", session.user);
  const data = await getFeedsOfUser(session.user);
  // Pass data to the page via props
  return { props: { links: data.rows, linkCount: data.rowCount } };
}
