import { Button, Grid, Spacer, Text } from "@nextui-org/react";
import Image from "next/image";
import Link from "next/link";
import mockImage from "../public/Group 26-min.png";
import darkMockImage from "../public/Group 26 (dark)-min.png";
import { useEffect, useState } from "react";
import { signIn } from "next-auth/react";
import Head from "next/head";

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
    <>
      <Head>
        <title>Feedni, The open-source content-aggregator.</title>
        <meta
          name="description"
          content="Use Feedni to follow your favorite blogs, magazines and news
          outlets"
        />

        <meta property="og:url" content="http://feedni.hasan.one/" />
        <meta property="og:type" content="website" />
        <meta
          property="og:title"
          content="Feedni, The open-source content-aggregator."
        />
        <meta
          property="og:description"
          content="Use Feedni to follow your favorite blogs, magazines and news
          outlets"
        />
        <meta
          property="og:image"
          content="https://github.com/Hasan-aga/feedni/blob/master/public/Group%2026%20(dark)-min.png?raw=true"
        />

        <meta
          name="twitter:card"
          content="https://github.com/Hasan-aga/feedni/blob/master/public/Group%2026%20(dark)-min.png?raw=true"
        />
        <meta property="twitter:domain" content="feedni.hasan.one" />
        <meta property="twitter:url" content="http://feedni.hasan.one/" />
        <meta
          name="twitter:title"
          content="Feedni, The open-source content-aggregator."
        />
        <meta
          name="twitter:description"
          content="Use Feedni to follow your favorite blogs, magazines and news
          outlets"
        />
        <meta
          name="twitter:image"
          content="https://github.com/Hasan-aga/feedni/blob/master/public/Group%2026%20(dark)-min.png?raw=true"
        />
        <meta name="twitter:creator" content="@selamFromHasan" />
      </Head>
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
              <Link href="https://github.com/Hasan-aga/feedni">
                open source
              </Link>{" "}
              feed-aggregator
            </Text>
            <Text>
              Use Feedni to follow your favorite blogs, magazines and news
              outlets
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
          <Text>
            Created By <Link href="https://hasan.one/">Hasan</Link>
          </Text>
        </Grid.Container>
      </Grid.Container>
    </>
  );
}
