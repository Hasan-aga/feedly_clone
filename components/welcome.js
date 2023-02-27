import { Button, Grid, Spacer, Text } from "@nextui-org/react";
import Image from "next/image";
import Link from "next/link";
import mockImage from "../public/Group 26-min.png";
import darkMockImage from "../public/Group 26 (dark)-min.png";
import { useEffect, useState } from "react";
import { signIn } from "next-auth/react";

export default function Welcome() {
  const [flip, setflip] = useState(false);
  //   console.log(flip);
  useEffect(() => {
    const interval = setInterval(() => {
      setflip((oldFlip) => !oldFlip);
      console.log("flip", flip);
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  return (
    <Grid.Container
      direction="column"
      justify="center"
      alignItems="center"
      css={{ height: "100vh", position: "relative", rowGap: "$10" }}
    >
      <Grid.Container justify="space-evenly" alignItems="center">
        <Grid
          xs={12}
          md={6}
          direction="column"
          justify="space-between"
          alignItems="center"
          css={{ textAlign: "center" }}
        >
          <Text h1>Welcome to Feedni</Text>
          <Text>
            The{" "}
            <Link href="https://github.com/Hasan-aga/feedni">open source</Link>{" "}
            feed-aggregator
          </Text>
          <Text>
            Use Feedni to follow your favorite blogs, magazines and news outlets
          </Text>
          <Spacer />
          <Text h3>Sign-in to customize your feed.</Text>
          <Button onPress={() => signIn()}>Sign in</Button>
          <Spacer />
          <Image
            src="/wink_emoji.svg"
            alt="welocm emoji"
            width="64"
            height="64"
          />
        </Grid>
        <Grid md={6} xs={0}>
          {flip ? (
            <Image
              alt="shit"
              width="552px"
              height="425px"
              src={mockImage}
              className="reveal"
            />
          ) : (
            <Image
              alt="shit"
              width="552px"
              height="425px"
              src={darkMockImage}
              className="reveal"
            />
          )}
        </Grid>
        <Spacer />

        <Grid md={0} xs={12} justify="center">
          {flip ? (
            <Image
              alt="shit"
              src="/Group 26-min.png"
              width="276"
              height="212"
              className="reveal"
            />
          ) : (
            <Image
              alt="shit"
              src="/Group 26 (dark)-min.png"
              width="276"
              height="212"
              className="reveal"
            />
          )}
        </Grid>
      </Grid.Container>
      <Text>
        Created By <Link href="https://hasan.one/">Hasan</Link>
      </Text>
    </Grid.Container>
  );
}
