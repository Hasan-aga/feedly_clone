import { Collapse, Grid, Image, Loading, Row, Text } from "@nextui-org/react";
import Link from "next/link";
import { useRouter } from "next/router";
import Cog from "./icons/cog";

export default function Categories({ feeds }) {
  if (!feeds) return <Loading type="points" color="currentColor" size="sm" />;
  return (
    <>
      <Grid.Container direction="column">
        <Grid>
          <Text h5>FEEDS</Text>
        </Grid>
        <Row>
          <Grid xs={10}>
            <Link href="/">All</Link>
          </Grid>
          <Grid>
            <Link href="/settings/data?hello=world">
              <Cog />
            </Link>
          </Grid>
        </Row>
        <Grid>
          <Collapse.Group accordion={false}>
            {feeds &&
              Object.keys(feeds).map((category) => {
                return (
                  <Collapse
                    expanded
                    title={
                      <Text h6 css={{ textTransform: "capitalize" }}>
                        {category}
                      </Text>
                    }
                  >
                    {feeds[category].map((feed) => (
                      <Link
                        href={`/feed/data?title=${feed.title}&url=${feed.url}&rowid=${feed.rowid}`}
                      >
                        <Row gap={1}>
                          <Grid xs={6}>
                            <Text b>{feed.title}</Text>
                          </Grid>
                          <Grid xs={6} alignItems="center">
                            <Image src={feed.favicon} width={24} height={24} />
                          </Grid>
                        </Row>
                      </Link>
                    ))}
                  </Collapse>
                );
              })}
          </Collapse.Group>
        </Grid>
      </Grid.Container>
    </>
  );
}
