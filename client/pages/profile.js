import { useSession, signIn, signOut } from "next-auth/react";
import {
  User,
  Grid,
  Button,
  Spacer,
  Switch,
  useTheme,
} from "@nextui-org/react";
import CustomModal from "@/pages/modal";
import { useState } from "react";
import ContentStack from "@/components/contentStack";
import { useTheme as useNextTheme } from "next-themes";
import { MoonIcon } from "@/components/icons/moon";
import { SunIcon } from "@/components/icons/sun";

export default function Profile() {
  const { data: session } = useSession();
  const [visible, setVisible] = useState(false);

  const { setTheme } = useNextTheme();
  const { isDark } = useTheme();

  if (session) {
    return (
      <>
        <div>
          <Switch
            checked={isDark}
            onChange={(e) => setTheme(e.target.checked ? "dark" : "light")}
            size="xl"
            iconOn={<SunIcon filled />}
            iconOff={<MoonIcon filled />}
          />
        </div>
        <User src={session.user.image} name={session.user.name} />
        <br />
        <Button onPress={() => signOut()}>Sign out</Button>
        <Spacer y={1} />
        <Grid>
          <Button onPress={() => setVisible(true)}>Add a feed</Button>
          <CustomModal
            visible={visible}
            closeHandler={() => setVisible(false)}
          />
        </Grid>
        <Spacer y={4} />
        <ContentStack />
      </>
    );
  }
  return (
    <>
      Not signed in <br />
      <button onClick={() => signIn()}>Sign in</button>
    </>
  );
}
