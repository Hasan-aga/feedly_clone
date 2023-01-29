import { useSession } from "next-auth/react";
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
import { useEffect, useState } from "react";
import ContentStack from "@/components/contentStack";
import { useTheme as useNextTheme } from "next-themes";
import { MoonIcon } from "@/components/icons/moon";
import { SunIcon } from "@/components/icons/sun";
import Sidebar from "@/components/sidebar";

export default function Profile() {
  const { data: session } = useSession();
  const [feeds, setFeeds] = useState();

  useEffect(() => {
    async function getFeeds() {
      const res = await fetch("http://localhost:3000/api/feeds");
      const { results } = await res.json();
      if (results) {
        setFeeds(results);
        console.log("results", results);
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
