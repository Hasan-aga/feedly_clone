import Feed from "@/components/feed";
import { Collapse, Grid } from "@nextui-org/react";
import { useRouter } from "next/router";

export default function SpecificFeed() {
  const router = useRouter();
  const feed = router.query;
  const { origin } = new URL(feed.url);

  return (
    <>
      <Grid xs={10} justify="center">
        <Collapse.Group>
          <Feed feed={feed} />
        </Collapse.Group>
      </Grid>
    </>
  );
}
