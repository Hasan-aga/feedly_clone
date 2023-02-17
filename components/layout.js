import useFeeds from "@/hooks/useFeeds";
import { Button, Grid, Loading, Spacer, Text } from "@nextui-org/react";
import { useSession, signIn } from "next-auth/react";
import Image from "next/image";
import CustomNavbar from "./CustomNavbar";
import Sidebar from "./sidebar";
/**
 * A Next.js component that displays a layout with feeds and user authentication status.
 *
 * @param {Object} props - The component props.
 * @param {ReactNode} props.children - The children components to be rendered within the layout.
 *
 * @returns {ReactNode} The component UI to be rendered.
 *
 * @example
 * <Layout>
 *   <h1>Welcome to my app!</h1>
 * </Layout>
 */
export default function Layout({ children }) {
  const { data: session, status } = useSession();
  console.log("session", session);
  const { isLoading, data, isSuccess, isFetching } = useFeeds();

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
