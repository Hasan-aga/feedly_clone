import { Card, Grid, Text, Button, Row, Spacer } from "@nextui-org/react";
import CardButtons from "./cardButtons";

export default function ArticleCard({ article }) {
  const date = new Intl.DateTimeFormat("en-GB").format(
    new Date(article.publication_date)
  );
  return (
    <div onClick={() => window.open(article.link, "_blank")}>
      <Grid xs={12}>
        <Card
          css={{ mw: "630px", padding: "$10" }}
          variant="bordered"
          isHoverable
          isPressable
        >
          <Card.Header>
            <Grid xs={8} direction="column">
              <Text b>{article.title}</Text>
              <Text css={{ color: "$accents8" }}>{date}</Text>
            </Grid>
            <Grid xs={4}>
              <CardButtons />
            </Grid>
          </Card.Header>
          <Card.Body css={{ paddingTop: "$5" }}>
            <Text color="#777">
              {article.description.slice(0, 200) + "..."}
            </Text>
          </Card.Body>
        </Card>
      </Grid>
    </div>
  );
}
