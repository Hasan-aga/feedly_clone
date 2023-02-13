import { Button, Grid, Loading, Spacer, Text } from "@nextui-org/react";
import { useQuery } from "@tanstack/react-query";
import { useSession, signIn, signOut } from "next-auth/react";
import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import Sidebar from "./sidebar";

export default function Layout({ children }) {
  const { data: session } = useSession();
  console.log("session", session);
  const { isLoading, data, isSuccess, isFetching } = useQuery({
    queryKey: ["feeds"],
    queryFn: getFeeds,
    onError: (error) => toast.error(error.message),
  });

  async function getFeeds() {
    const response = await fetch("http://localhost:3000/api/feeds");

    if (!response.ok) {
      throw new Error("Something went wrong.");
    }
    return response.json();
  }
  if (session && isSuccess) {
    return (
      <Grid.Container gap={2} css={{ backgroundColor: "$blue300" }}>
        <Grid xs={2} direction="column" css={{ backgroundColor: "$yellow100" }}>
          <Sidebar session={session} feeds={data.results} />
        </Grid>

        <Grid xs={6} css={{ backgroundColor: "$accents5" }}>
          {children}
        </Grid>
      </Grid.Container>
    );
  }
  return (
    <>
      <Grid.Container
        direction="column"
        gap={2}
        justify="center"
        alignItems="center"
      >
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
