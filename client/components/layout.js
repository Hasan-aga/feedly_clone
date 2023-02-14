import useFeeds from "@/hooks/useFeeds";
import { Button, Grid, Loading, Spacer, Text } from "@nextui-org/react";
import { useQuery } from "@tanstack/react-query";
import { useSession, signIn, signOut } from "next-auth/react";
import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import Sidebar from "./sidebar";

export default function Layout({ children }) {
  const { data: session } = useSession();
  console.log("session", session);
  const { isLoading, data, isSuccess, isFetching } = useFeeds();

  if (session && isSuccess) {
    return (
      <Grid.Container gap={2} css={{ height: "100vh", overflow: "hidden" }}>
        <Grid
          xs={0}
          md={2}
          direction="column"
          css={{ backgroundColor: "$cyan100", pt: "$0" }}
        >
          <Sidebar session={session} feeds={data.results} />
        </Grid>

        <Grid
          xs={10}
          css={{
            backgroundColor: "$cyan50",
            height: "100vh",
            overflowY: "scroll",
            overflowX: "hidden",
          }}
        >
          <Grid.Container justify="center">
            <Grid xs={12}>{children}</Grid>
          </Grid.Container>
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
