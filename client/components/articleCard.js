import {
  Card,
  Grid,
  Text,
  Button,
  Row,
  Spacer,
  Image,
} from "@nextui-org/react";
import { useEffect, useLayoutEffect, useState } from "react";
import CardButtons from "./cardButtons";

function getDescription(article) {
  if (!article.description) {
    return "No description 😓";
  }
  let { description } = article;
  if (description.charAt(0) === "<") {
    description = new DOMParser().parseFromString(description, "text/html").body
      .textContent;
  }
  return description.slice(0, 200);
}

export default function ArticleCard({ article }) {
  const date = new Intl.DateTimeFormat("en-GB").format(
    new Date(article.publication_date)
  );

  const [imageLink, setImageLink] = useState();

  async function fetchArticleImage() {
    try {
      if (article.image_link === "default link") {
        console.log("get image");

        const response = await fetch(
          `/api/articles/image?articleid=${article.articleid}`
        );
        const result = await response.json();
        setImageLink(result.imageLink);
      }
    } catch (error) {
      console.error(`failed while getting image for article  ${error}`);
    }
  }

  useLayoutEffect(() => {
    fetchArticleImage();
  }, [article]);

  const [isRead, setIsRead] = useState(article.readid);
  return (
    // todo: fix card width (card no size, card content set size)
    <Grid.Container
      xs={12}
      gap={2}
      alignContent="center"
      alignItems="center"
      justify="center"
    >
      <Grid
        xs={6} // must always be 12 so text not hidden
        css={{
          opacity: `${isRead ? "0.5" : "1"}`,
          cursor: "pointer",
        }}
        onClick={() => window.open(article.link, "_blank")}
      >
        <Grid xs={2} css={{ padding: "0" }} alignItems="flex-start">
          <Image
            showSkeleton
            maxDelay={10000}
            css={{ borderRadius: "5px" }}
            src={
              article.image_link === "default link"
                ? imageLink
                : article.image_link
            }
            width="100%"
            alt="article image"
          />
        </Grid>
        <Spacer />
        <Grid xs={10} css={{ padding: "0" }}>
          <Card
            css={{
              padding: "$10",
            }}
          >
            <Card.Header css={{ padding: "0" }}>
              <Grid.Container gap={1} justify="space-between">
                <Grid xs={8} direction="column">
                  <Text css={{ padding: "$1", width: "100em" }}>
                    {article.title}
                  </Text>
                  <Text css={{ color: "$accents8", pb: "$1" }}>{date}</Text>
                </Grid>
                <Grid xs={4}>
                  <CardButtons
                    css={{ padding: "$1" }}
                    articleID={article.articleid}
                    isBookmarked={article.bookmarkid}
                    isRead={isRead}
                    setIsRead={setIsRead}
                  />
                </Grid>
              </Grid.Container>
            </Card.Header>
            <Card.Body css={{ padding: "0px" }}>
              <Text
                color="#777"
                css={{
                  textOverflow: "ellipsis",
                  overflow: "hidden",
                  overflowWrap: "break-word",
                  whiteSpace: "nowrap",
                  padding: "0",
                }}
              >
                {getDescription(article)}
              </Text>
            </Card.Body>
          </Card>
        </Grid>
      </Grid>
    </Grid.Container>
  );
}
