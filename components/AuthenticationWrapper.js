import { Button, Grid, Loading, Text } from "@nextui-org/react";
import { signIn, useSession } from "next-auth/react";
import Image from "next/image";
import Layout from "./layout";

// a component that handles auth and selects what to render accordingly
export default function AuthenticationWrapper({ children }) {
  const { data: session, status } = useSession();
  console.log("session", session);

  if (status === "unauthenticated") {
    return (
      <>
        <Grid.Container
          direction="column"
          justify="center"
          alignItems="center"
          css={{ height: "100vh", position: "relative", rowGap: "$10" }}
        >
          <Text h3>Sign-in to customize your feed.</Text>
          <Button onPress={() => signIn()}>Sign in</Button>
          <Image
            src="/wink_emoji.svg"
            alt="welocm emoji"
            width="64"
            height="64"
          />
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
    return <Layout session={session}>{children}</Layout>;
  }

  return <p>hello</p>;
}
