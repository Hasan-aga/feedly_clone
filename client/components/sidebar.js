import CustomModal from "@/pages/modal";
import {
  Button,
  Grid,
  Spacer,
  Switch,
  User,
  useTheme,
} from "@nextui-org/react";
import { useTheme as useNextTheme } from "next-themes";
import { useState } from "react";
import { MoonIcon } from "./icons/moon";
import { SunIcon } from "./icons/sun";
import { signIn, signOut } from "next-auth/react";

export default function Sidebar({ session }) {
  const { setTheme } = useNextTheme();
  const { isDark } = useTheme();
  const [visible, setVisible] = useState(false);

  return (
    <>
      <Grid.Container gap={2} justify="center" alignItems="center">
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
            onChange={(e) => setTheme(e.target.checked ? "dark" : "light")}
            size="xl"
            iconOn={<SunIcon filled />}
            iconOff={<MoonIcon filled />}
          />
        </Grid>
        <Grid>
          <Button onPress={() => signOut()}>Sign out</Button>
        </Grid>
        <Grid>
          <Spacer y={2} />
          <Button onPress={() => setVisible(true)}>Add a feed</Button>
        </Grid>
        <CustomModal visible={visible} closeHandler={() => setVisible(false)} />
      </Grid.Container>
    </>
  );
}
