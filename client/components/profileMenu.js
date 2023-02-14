import {
  Button,
  Grid,
  Popover,
  Row,
  Switch,
  Text,
  User,
} from "@nextui-org/react";
import { signOut } from "next-auth/react";
import { useTheme } from "next-themes";
import { MoonIcon } from "./icons/moon";
import { SunIcon } from "./icons/sun";

export default function ProfileMenu({ session }) {
  const { theme, setTheme } = useTheme();
  return (
    <Popover isBordered>
      <Popover.Trigger>
        {/* <User
          as="button"
          size="lg"
          bordered
          color="primary"
          src={session.user.image}
          name={session.user.name}
        /> */}
        <Grid xs={12} css={{ cursor: "pointer" }}>
          <Row xs={12} justify="space-between" align="center">
            <User
              size="lg"
              bordered
              color="primary"
              src={session.user.image}
              name={session.user.name}
            />
            <Text css={{ rotate: "90deg" }}>&#10148;</Text>
          </Row>
        </Grid>
      </Popover.Trigger>
      <Popover.Content css={{ px: "$6", py: "$10" }}>
        <Grid.Container
          gap={2}
          direction="column"
          xs={12}
          css={{ borderRadius: "14px", padding: "0.75rem", maxWidth: "330px" }}
        >
          <Grid>
            <Row justify="space-between" align="center">
              <Text>Theme</Text>
              <Switch
                onChange={(e) => {
                  setTheme(theme === "dark" ? "light" : "dark");
                }}
                size="md"
                iconOn={<SunIcon filled />}
                iconOff={<MoonIcon filled />}
              />
            </Row>
          </Grid>
          <Grid>
            <Button size="sm" onPress={signOut}>
              Sign out
            </Button>
          </Grid>
        </Grid.Container>
      </Popover.Content>
    </Popover>
  );
}
