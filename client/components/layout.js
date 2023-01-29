import { Button, Grid, Spacer, Text } from "@nextui-org/react";
import { useSession, signIn, signOut } from "next-auth/react";
import { useEffect, useState } from "react";
import Sidebar from "./sidebar";

export default function Layout({ children }) {
  const [feeds, setFeeds] = useState();
  const { data: session } = useSession();
  console.log("session", session);
  useEffect(() => {
    async function getFeeds() {
      const res = await fetch("http://localhost:3000/api/feeds");
      const { results } = await res.json();

      if (results) {
        setFeeds(results);
      }
    }

    getFeeds();
  }, []);
  if (session) {
    return (
      <>
        <Grid.Container direction="row" gap={2}>
          <Grid xs={2} direction="column">
            <Sidebar session={session} feeds={feeds} />
          </Grid>
          {children}
        </Grid.Container>
      </>
    );
  }
  return (
    <>
      <Grid.Container direction="column" gap={2} justify="center">
        <Grid>
          <Text h3>Sign-in to customize your feed.</Text>
        </Grid>
        <Grid xs={2} direction="column">
          <Button onPress={() => signIn()}>Sign in</Button>
        </Grid>
      </Grid.Container>
    </>
  );
}
