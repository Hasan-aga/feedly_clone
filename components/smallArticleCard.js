import { Button, Card, Col, Grid, Row, Text } from "@nextui-org/react";
import { useEffect, useLayoutEffect, useState } from "react";

export default function SmallArticleCard({ article }) {
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
        <Card css={{ w: "100%", h: "400px" }}>
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
