import { Card, Grid, Text } from "@nextui-org/react";

export default function ErrorCard({ error }) {
  console.log("here is your error!");
  return (
    <Grid.Container css={{ position: "sticky", top: "5px", right: "5px" }}>
      <Grid>
        <Card variant="bordered">
          <Card.Body>
            <Text color="error" h4>
              Error!
            </Text>
            <Text>{error}</Text>
          </Card.Body>
        </Card>
      </Grid>
    </Grid.Container>
  );
}
