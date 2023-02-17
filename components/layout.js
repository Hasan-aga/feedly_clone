import useFeeds from "@/hooks/useFeeds";
import { Button, Grid, Loading, Spacer, Text } from "@nextui-org/react";
import { useQuery } from "@tanstack/react-query";
import { useSession, signIn, signOut } from "next-auth/react";
import Image from "next/image";
import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import CustomNavbar from "./CustomNavbar";
import Sidebar from "./sidebar";

export default function Layout({ children }) {
  const { data: session, status } = useSession();
  const { isLoading, data, isSuccess, isFetching } = useFeeds();
  console.log("session", session);

  if (status === "unauthenticated") {
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

  if (status === "loading") {
    return (
      <div
        style={{
          height: "100vh",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-evenly",
          alignItems: "center",
        }}
      >
        <Loading color="success" size="lg" type="points" />
        <Text h5 color="success">
          Signing you in...
        </Text>
        <Image
          src="/welcome_emoji.svg"
          alt="welocm emoji"
          width="64"
          height="64"
        />
      </div>
    );
  }

  if (status === "authenticated") {
    return isSuccess ? (
      <Grid xs={12} direction="column">
        <Grid md={0}>
          <CustomNavbar session={session} />
        </Grid>
        <Grid.Container
          gap={2}
          css={{
            height: "100vh",
            overflow: "hidden",
          }}
        >
          <Grid
            xs={0}
            md={2}
            direction="column"
            css={{ pt: "$0", backgroundColor: "$blue400" }}
          >
            <Sidebar session={session} feeds={data.results} />
          </Grid>

          <Grid
            md={10}
            xs={12}
            css={{
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
      </Grid>
    ) : (
      <Grid.Container
        direction="column"
        gap={2}
        justify="center"
        alignItems="center"
      >
        <Grid>
          <Text h3>✅</Text>
        </Grid>
      </Grid.Container>
    );
  }
}
