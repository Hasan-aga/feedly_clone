import {
  Button,
  Grid,
  Card,
  Text,
  Row,
  Container,
  Input,
} from "@nextui-org/react";

import { useState } from "react";

async function authenticate(credentials, setIsLoading) {
  try {
    const url = `/login?${credentials.email}&password=${credentials.password}`;
    console.log("calling", url);
    const user = await fetch(url);
  } catch (error) {
    console.log("error", error);
  }
}

export default function Login() {
  const [credentials, setCredentials] = useState({ email: "", password: "" });
  const [isLoading, setIsLoading] = useState(false);

  return (
    <Grid.Container
      direction="column"
      alignItems="center"
      justify="center"
      css={{ height: "100vh" }}
    >
      <Grid.Container gap={2} alignItems="center" direction="column" xs={6}>
        <Grid>
          <Input
            placeholder="Email"
            onChange={(e) =>
              setCredentials({ ...credentials, email: e.target.value })
            }
          />
        </Grid>
        <Grid>
          <Input
            placeholder="Password"
            onChange={(e) =>
              setCredentials({ ...credentials, password: e.target.value })
            }
          />
        </Grid>
        <Grid>
          <Button onClick={() => authenticate(credentials, isLoading)}>
            Signup / Login
          </Button>
        </Grid>
      </Grid.Container>
    </Grid.Container>
  );
}
