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

export default function Profile() {
  const { data: session } = useSession();
  const [visible, setVisible] = useState(false);

  const { setTheme } = useNextTheme();
  const { isDark, type } = useTheme();

  if (session) {
    return (
      <>
        <div>
          The current theme is: {type}
          <Switch
            checked={isDark}
            onChange={(e) => setTheme(e.target.checked ? "dark" : "light")}
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
        <Spacer y={2} />
        <Spacer y={2} />
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
