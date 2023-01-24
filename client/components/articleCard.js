import { Card, Grid, Text, Button, Row } from "@nextui-org/react";

export default function ArticleCard({ article }) {
  return (
    <>
      <Grid sm={12} md={5}>
        <Card css={{ mw: "330px" }}>
          <Card.Header>
            <Text b>{article.title}</Text>
          </Card.Header>
          <Card.Divider />
          <Card.Body css={{ py: "$10" }}>
            <Text>{article.description}</Text>
          </Card.Body>
          <Card.Divider />
          <Card.Footer>
            <Row justify="flex-end">
              <Button size="sm" light>
                Share
              </Button>
              <Button size="sm" color="secondary">
                <a target="_blank" href={article.link}>
                  Learn more
                </a>
              </Button>
            </Row>
          </Card.Footer>
        </Card>
      </Grid>{" "}
    </>
  );
}
