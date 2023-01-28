import { useState, useEffect } from "react";
import { Collapse } from "@nextui-org/react";
import Feed from "./feed";

export default function ContentStack() {
  const [feeds, setFeeds] = useState();
  useEffect(() => {
    async function getFeeds() {
      const res = await fetch("http://localhost:3000/api/feeds");
      const { results } = await res.json();

      if (results) {
        setFeeds(results);
        console.log(results);
      }
    }

    getFeeds();
  }, []);

  return (
    <>
      <Collapse.Group>
        {feeds &&
          feeds.map((feed, index) => {
            return <Feed feed={feed} key={index} />;
          })}
      </Collapse.Group>
    </>
  );
}
