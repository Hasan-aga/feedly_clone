import { Button, Card, Col, Grid, Popover, Row, Text } from "@nextui-org/react";
import { useEffect, useLayoutEffect, useState } from "react";
import CardButtons from "./cardButtons";

export default function SmallArticleCard({ article, offset, feed }) {
  const [imageLink, setImageLink] = useState();

  async function fetchArticleImage() {
    try {
      if (article.image_link === "default link") {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_BASE_URL}/api/articles/image?articleid=${article.articleid}`
        );
        const result = await response.json();
        setImageLink(result.imageLink);
      }
    } catch (error) {
      console.error(`failed while getting image for article  ${error}`);
    }
  }

  useEffect(() => {
    fetchArticleImage();
  }, [article]);
  return (
    <Grid.Container
      xs={12}
      gap={2}
      alignContent="center"
      alignItems="center"
      justify="center"
    >
      <Grid
        sm={6}
        xs={12}
        css={{
          opacity: `${article.readid ? "0.5" : "1"}`,
          cursor: "pointer",
        }}
        onClick={() => window.open(article.link, "_blank")}
      >
        <Card css={{ w: "100%", h: "300px" }}>
          <Card.Header css={{ position: "absolute", zIndex: 1, top: 5 }}>
            <Col>
              <Popover placement="top">
                <Popover.Trigger>
                  <Button
                    css={{
                      all: "unset",
                      backgroundColor: "$background",
                      borderRadius: "100%",
                      width: "$2xl",
                      height: "$2xl",
                      fontSize: "$2xl",
                      color: "$white",
                    }}
                  >
                    &#8942;
                  </Button>
                </Popover.Trigger>
                <Popover.Content>
                  <Grid
                    css={{
                      borderRadius: "14px",
                      padding: "0.75rem",
                      maxWidth: "330px",
                    }}
                  >
                    <CardButtons
                      article={article}
                      css={{ padding: "$1" }}
                      offset={offset}
                      feed={feed}
                    />
                  </Grid>
                </Popover.Content>
              </Popover>
            </Col>
          </Card.Header>
          <Card.Body css={{ p: 0 }}>
            <Card.Image
              src={
                article.image_link === "default link"
                  ? imageLink
                  : article.image_link
              }
              width="100%"
              height="100%"
              objectFit="cover"
              alt="Card example background"
            />
          </Card.Body>
          <Card.Footer
            isBlurred
            css={{
              position: "absolute",
              bgBlur: "#ffffff66",
              borderTop: "$borderWeights$light solid rgba(255, 255, 255, 0.2)",
              bottom: 0,
              zIndex: 1,
            }}
          >
            <Row>
              <Col>
                <Text h5 color="black">
                  {article.title}
                </Text>
                <Text
                  color="$gray500"
                  css={{
                    textOverflow: "ellipsis",
                    overflow: "hidden",
                    overflowWrap: "break-word",
                    whiteSpace: "nowrap",
                    padding: "0",
                  }}
                >
                  {article.description}
                </Text>
              </Col>
            </Row>
          </Card.Footer>
        </Card>
      </Grid>
    </Grid.Container>
  );
}
