import { Card, Grid, Text, Button, Row, Spacer } from "@nextui-org/react";
import { useState } from "react";
import CardButtons from "./cardButtons";

export default function ArticleCard({ article }) {
  const date = new Intl.DateTimeFormat("en-GB").format(
    new Date(article.publication_date)
  );

  const [isRead, setIsRead] = useState(article.readid);
  return (
    <div onClick={() => window.open(article.link, "_blank")}>
      <Grid xs={12}>
        <Card
          css={{
            mw: "600px",
            opacity: `${isRead ? "0.5" : "1"}`,
            pl: "$10",
            pr: "$10",
          }}
          isHoverable
          isPressable
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
          <Card.Body css={{ paddingTop: "$1" }}>
            <Text
              color="#777"
              css={{
                textOverflow: "ellipsis",
                overflow: "hidden",
                whiteSpace: "nowrap",
              }}
            >
              {article.description.slice(0, 200) + "..."}
            </Text>
          </Card.Body>
        </Card>
      </Grid>
    </div>
  );
}
