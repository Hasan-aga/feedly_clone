import { Collapse, Grid, Image, Row, Text } from "@nextui-org/react";

export default function Categories({ feeds }) {
  console.log("feeds", feeds);
  return (
    <>
      <Grid.Container direction="column">
        <Grid>
          <Text h5>FEEDS</Text>
        </Grid>
        <Grid>
          <Collapse.Group accordion={false}>
            {feeds &&
              feeds.map((feed) => {
                return (
                  <Collapse
                    title={
                      <Text h6 css={{ textTransform: "capitalize" }}>
                        {feed.category}
                      </Text>
                    }
                  >
                    <Row>
                      <Text>{feed.title}</Text>
                      <Image src={feed.favicon} width={24} height={24} />
                    </Row>
                  </Collapse>
                );
              })}
          </Collapse.Group>
        </Grid>
      </Grid.Container>
    </>
  );
}
