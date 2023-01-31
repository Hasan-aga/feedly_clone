import { useSession } from "next-auth/react";
import { Grid } from "@nextui-org/react";
import { useEffect, useState } from "react";
import ContentStack from "@/components/contentStack";

export default function Profile() {
  const { data: session } = useSession();
  const [feeds, setFeeds] = useState();

  useEffect(() => {
    async function getFeeds() {
      const res = await fetch("http://localhost:3000/api/feeds");
      const { results } = await res.json();
      if (results) {
        setFeeds(results);
      }
    }

    getFeeds();
  }, []);
  if (session) {
    return (
      <>
        <Grid xs={10} justify="center">
          <ContentStack feeds={feeds} />
        </Grid>
      </>
    );
  }
}
