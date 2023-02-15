import {
  Button,
  Grid,
  Popover,
  Row,
  Switch,
  Text,
  User,
  useTheme,
} from "@nextui-org/react";
import { signOut } from "next-auth/react";
import { useTheme as useNextTheme } from "next-themes";
import { MoonIcon } from "./icons/moon";
import { SunIcon } from "./icons/sun";

export default function ProfileMenu({ session }) {
  const { theme: themeName, setTheme } = useNextTheme();
  console.log("theme name", themeName);
  const { theme } = useTheme;
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
            <Text>🔻</Text>
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
                checked={themeName === "dark" ? false : true}
                onChange={(e) => {
                  setTheme(themeName === "dark" ? "light" : "dark");
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
