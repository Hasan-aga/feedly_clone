import { useSession, signIn, signOut } from "next-auth/react";
import {
  User,
  Grid,
  Button,
  Spacer,
  Switch,
  useTheme,
  Text,
} from "@nextui-org/react";
import CustomModal from "@/pages/modal";
import { useState } from "react";
import ContentStack from "@/components/contentStack";
import { useTheme as useNextTheme } from "next-themes";
import { MoonIcon } from "@/components/icons/moon";
import { SunIcon } from "@/components/icons/sun";
import Sidebar from "@/components/sidebar";

export default function Profile() {
  const { data: session } = useSession();

  const { setTheme } = useNextTheme();
  const { isDark } = useTheme();

  if (session) {
    return (
      <>
        <Grid.Container direction="row" gap={2}>
          <Grid xs={2} direction="column">
            <Sidebar session={session} />
          </Grid>
          <Grid xs={8}>
            <Spacer y={4} />
            <ContentStack />
          </Grid>
        </Grid.Container>
      </>
    );
  }
  return (
    <>
      <Grid.Container direction="column" gap={2} justify="center">
        <Grid>
          <Text h3>Sign-in to customize your feed.</Text>
        </Grid>
        <Grid xs={2} direction="column">
          <Button onPress={() => signIn()}>Sign in</Button>
        </Grid>
        <Grid xs={8}>
          <Spacer y={4} />
          <ContentStack />
        </Grid>
      </Grid.Container>
    </>
  );
}
