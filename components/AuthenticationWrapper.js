import useWakeServer from "@/hooks/useWakeServer";
import { Button, Grid, Loading, Text } from "@nextui-org/react";
import { signIn, useSession } from "next-auth/react";
import Image from "next/image";
import CustomHead from "./head";
import Layout from "./layout";
import Welcome from "./welcome";

// a component that handles auth and selects what to render accordingly
export default function AuthenticationWrapper({ children }) {
  useWakeServer();
  const { data: session, status } = useSession();
  console.log("session", session);

  if (status === "unauthenticated") {
    return <Welcome />;
  }

  if (status === "loading") {
    return (
      <>
        <CustomHead />
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
      </>
    );
  }

  if (status === "authenticated") {
    return <Layout session={session}>{children}</Layout>;
  }

  return <p>hello</p>;
}
