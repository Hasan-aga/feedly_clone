import { Collapse, Grid, Image, Row, Text } from "@nextui-org/react";
import Link from "next/link";

export default function Categories({ feeds }) {
  console.log("feeds", feeds);
  if (!feeds) return <></>;
  return (
    <>
      <Grid.Container direction="column">
        <Grid>
          <Text h5>FEEDS</Text>
        </Grid>
        <Grid>
          <Collapse.Group accordion={false}>
            {feeds &&
              Object.keys(feeds).map((category) => {
                return (
                  <Collapse
                    title={
                      <Text h6 css={{ textTransform: "capitalize" }}>
                        {category}
                      </Text>
                    }
                  >
                    {feeds[category].map((feed) => (
                      // todo: link to each blog
                      <Link href={"/blog.hasan.one"}>
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
