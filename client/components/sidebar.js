import CustomModal from "@/pages/modal";
import { Button, Grid, Spacer } from "@nextui-org/react";
import { useState } from "react";
import { signOut } from "next-auth/react";
import Categories from "./categories";
import ProfileMenu from "./profileMenu";

export default function Sidebar({ session, feeds }) {
  const [visible, setVisible] = useState(false);

  return (
    <div style={{ position: "fixed", top: "1%" }}>
      <Grid.Container
        xs={12}
        direction="column"
        gap={2}
        alignItems="flex-start"
      >
        <ProfileMenu session={session} />
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
