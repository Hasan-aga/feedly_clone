import { Grid, Switch, User } from "@nextui-org/react";
import { useTheme } from "next-themes";
import { MoonIcon } from "./icons/moon";
import { SunIcon } from "./icons/sun";

export default function ProfileMenu({ session }) {
  const { isDark, setTheme } = useTheme();
  return (
    <Grid.Container direction="row">
      <Grid>
        <User
          size="lg"
          bordered
          color="primary"
          src={session.user.image}
          name={session.user.name}
        />
      </Grid>
      <Grid>
        <Switch
          checked={isDark}
          onChange={(e) => setTheme(e.target.checked ? "light" : "dark")}
          size="xl"
          iconOn={<SunIcon filled />}
          iconOff={<MoonIcon filled />}
        />
      </Grid>
    </Grid.Container>
  );
}
