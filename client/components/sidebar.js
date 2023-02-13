import CustomModal from "@/pages/modal";
import {
  Button,
  Grid,
  Row,
  Spacer,
  Switch,
  User,
  useTheme,
} from "@nextui-org/react";
import { useTheme as useNextTheme } from "next-themes";
import { useState } from "react";
import { MoonIcon } from "./icons/moon";
import { SunIcon } from "./icons/sun";
import { signOut } from "next-auth/react";
import Categories from "./categories";

export default function Sidebar({ session, feeds }) {
  const { setTheme } = useNextTheme();
  const { isDark } = useTheme();
  const [visible, setVisible] = useState(false);

  return (
    <div style={{ position: "fixed", top: "1%" }}>
      <Grid.Container
        xs={12}
        direction="column"
        gap={2}
        alignItems="flex-start"
      >
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
              onChange={(e) => setTheme(e.target.checked ? "dark" : "light")}
              size="xl"
              iconOn={<SunIcon filled />}
              iconOff={<MoonIcon filled />}
            />
          </Grid>
        </Grid.Container>
        <Grid>
          <Button onPress={() => signOut()}>Sign out</Button>
        </Grid>
        <Grid>
          <Spacer y={2} />
          <Button onPress={() => setVisible(true)}>Add a feed</Button>
        </Grid>
        <CustomModal visible={visible} closeHandler={() => setVisible(false)} />
        <Categories feeds={feeds} />
      </Grid.Container>
    </div>
  );
}
