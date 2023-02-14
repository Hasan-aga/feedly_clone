import CustomModal from "@/pages/modal";
import { Button, Grid, Spacer, Text } from "@nextui-org/react";
import { useState } from "react";
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
          <Spacer y={10} />
          <Button size="sm" onPress={() => setVisible(true)}>
            <Text b>Add a feed +</Text>
          </Button>
        </Grid>
        <CustomModal visible={visible} closeHandler={() => setVisible(false)} />
        <Categories feeds={feeds} />
      </Grid.Container>
    </div>
  );
}
