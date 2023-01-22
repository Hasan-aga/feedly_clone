import { useSession, signIn, signOut } from "next-auth/react";
import { User, Grid, Button, Card, Text, Spacer } from "@nextui-org/react";
import CustomModal from "@/pages/modal";
import { useState } from "react";
import { unstable_getServerSession } from "next-auth";
import { getFeedsOfUser } from "@/lib/db";

export default function Profile({ links }) {
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
        {/* todo: move feed list to own page so we refresh it when we add feed */}
        <Grid>
          {links.map((link) => {
            console.log(link);
            return (
              <Card css={{ backgroundColor: "#999" }}>
                <Card.Body>
                  <Text>{link.url}</Text>
                </Card.Body>
              </Card>
            );
          })}
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
  return { props: { links: data.rows } };
}
