import { Grid, Card, Row, Text } from "@nextui-org/react";

export default function App() {
  return (
    <Grid.Container
      css={{ height: "100vh" }}
      direction="column"
      justify="center"
    >
      <Card css={{ $$cardColor: "$colors$primary" }}>
        <Card.Body>
          <Row justify="center" align="center">
            <Text h6 size={15} color="white" css={{ m: 0 }}>
              You are signed in.
            </Text>
          </Row>
        </Card.Body>
      </Card>
    </Grid.Container>
  );
}
