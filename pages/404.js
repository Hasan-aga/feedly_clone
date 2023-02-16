import { Grid, Text } from "@nextui-org/react";
import Image from "next/image";

export default function Custom404() {
  return (
    <Grid
      direction="column"
      xs={12}
      justify="center"
      alignItems="center"
      css={{ backgroundColor: "$background" }}
    >
      <Text size="$5xl" color="warning" h5>
        404
      </Text>
      <Text size="$5xl" h6>
        Page not found
      </Text>

      <Image src="/sweating_emoji.svg" width="64" height="64" />
    </Grid>
  );
}
