import { Button, Card, Col, Grid, Popover, Row, Text } from "@nextui-org/react";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import CardButtons from "./cardButtons";

export default function SmallArticleCard({ children, article, clickHandler }) {
  const [imageLink, setImageLink] = useState();
  const imageRef = useRef();

  async function fetchArticleImage() {
    try {
      if (article.image_link === "default link") {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_BASE_URL}/api/articles/image?articleid=${article.articleid}`
        );
        if (!response.ok) {
          //case no image found
          setImageLink("/feedni-default-img.jpg");
          return;
        }
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
        onClick={clickHandler}
      >
        <Card css={{ w: "100%", h: "250px" }}>
          <Card.Header css={{ position: "absolute", zIndex: 1, top: 5 }}>
            <Col>
              <Popover placement="top">
                <Popover.Trigger>
                  <Button
                    css={{
                      all: "unset",
                      backgroundColor: "$backgroundAlpha",
                      borderRadius: "100%",
                      width: "$2xl",
                      height: "$2xl",
                      fontSize: "$1xl",
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
                    {children}
                  </Grid>
                </Popover.Content>
              </Popover>
            </Col>
          </Card.Header>
          <Card.Body css={{ p: 0 }}>
            <Card.Image
              ref={imageRef}
              src={
                article.image_link === "default link"
                  ? imageLink
                  : article.image_link
              }
              width="100%"
              height="100%"
              objectFit="cover"
              alt="article preview image"
              onError={() => {
                imageRef.current.src = "/feedni-default-img.jpg";
              }}
            />
          </Card.Body>
          <Card.Footer
            isBlurred
            css={{
              position: "absolute",
              bottom: "0px",
              zIndex: 1,
            }}
          >
            <Row>
              <Col>
                <Text h5>{article.title}</Text>
                <Text
                  color="$accent10"
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
