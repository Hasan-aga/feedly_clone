import CustomModal from "@/pages/modal";
import { Button, Grid, Spacer, Text } from "@nextui-org/react";
import { useState } from "react";
import Categories from "./categories";
import ProfileMenu from "./profileMenu";

export default function Sidebar({ session, feeds }) {
  const [visible, setVisible] = useState(false);

  return (
    <Grid.Container xs={12} gap={1} alignItems="center" justify="flex-start">
      <ProfileMenu session={session} />
      <Grid>
        <Spacer y={2} />
        <Button size="sm" onPress={() => setVisible(true)}>
          <Text b>Add a feed +</Text>
        </Button>
      </Grid>
      <CustomModal visible={visible} closeHandler={() => setVisible(false)} />
      <Categories feeds={feeds} />
    </Grid.Container>
  );
}
