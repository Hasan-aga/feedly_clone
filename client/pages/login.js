import {
  Button,
  Grid,
  Card,
  Text,
  Row,
  Container,
  Input,
} from "@nextui-org/react";

export default function Login() {
  return (
    <Grid.Container
      direction="column"
      alignItems="center"
      justify="center"
      css={{ height: "100vh" }}
    >
      <Grid.Container gap={2} alignItems="center" direction="column" xs={6}>
        <Grid>
          <Input placeholder="Email" />
        </Grid>
        <Grid>
          <Input placeholder="Password" />
        </Grid>
        <Grid>
          <Button>Signup / Login</Button>
        </Grid>
      </Grid.Container>
    </Grid.Container>
  );
}
