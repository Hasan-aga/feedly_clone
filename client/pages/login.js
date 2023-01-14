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
      gap={2}
      justify="center"
      alignItems="center"
      direction="column"
    >
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
  );
}
