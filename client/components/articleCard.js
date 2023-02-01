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

  const [isRead, setIsRead] = useState(article.readid);
  return (
    <Grid
      xs={6}
      css={{ opacity: `${isRead ? "0.5" : "1"}`, cursor: "pointer" }}
      onClick={() => window.open(article.link, "_blank")}
    >
      <Grid xs={3} css={{ padding: "0" }}>
        <Image
          css={{ borderRadius: "5px" }}
          src={
            "https://images.unsplash.com/photo-1493787039806-2edcbe808750?ixlib=rb-4.0.3&q=80&fm=jpg&crop=entropy&cs=tinysrgb"
          }
          objectFit="cover"
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
  );
}
