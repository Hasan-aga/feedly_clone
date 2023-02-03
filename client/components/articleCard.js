import {
  Card,
  Grid,
  Text,
  Button,
  Row,
  Spacer,
  Image,
} from "@nextui-org/react";
import { useState } from "react";
import CardButtons from "./cardButtons";

export default function ArticleCard({ article }) {
  const date = new Intl.DateTimeFormat("en-GB").format(
    new Date(article.publication_date)
  );

  console.log(article.image_link);

  const [isRead, setIsRead] = useState(article.readid);
  return (
    <Grid.Container gap={2}>
      <Grid
        xs={6}
        css={{ opacity: `${isRead ? "0.5" : "1"}`, cursor: "pointer" }}
        onClick={() => window.open(article.link, "_blank")}
      >
        <Grid xs={3} css={{ padding: "0" }} alignItems="flex-start">
          <Image
            showSkeleton
            maxDelay={10000}
            css={{ borderRadius: "5px" }}
            src={article.image_link}
            width="100%"
            alt="article image"
          />
        </Grid>
        <Spacer />
        <Card
          css={{
            mw: "600px",
            padding: "$10",
          }}
        >
          <Card.Header css={{ padding: "0" }}>
            <Grid xs={8} direction="column">
              <Text b css={{ padding: "$1" }}>
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
          </Card.Header>
          <Card.Body css={{ padding: "0px" }}>
            <Text
              color="#777"
              css={{
                textOverflow: "ellipsis",
                overflow: "hidden",
                whiteSpace: "nowrap",
                padding: "0",
              }}
            >
              {article.description.slice(0, 200) + "..."}
            </Text>
          </Card.Body>
        </Card>
      </Grid>
    </Grid.Container>
  );
}
