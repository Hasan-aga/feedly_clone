import { useState, useEffect } from "react";
import { Collapse, Grid } from "@nextui-org/react";
import Feed from "./feed";

function getFeedsFromCategories(categories) {
  console.log("Categories", categories);
  // todo: this process is reversed in categories.
  let totalFeeds = [];
  for (const [category, feeds] of Object.entries(categories)) {
    console.log(`cat ${category}, feed `, feeds);
    totalFeeds.push(...feeds);
  }
  return totalFeeds;
}
export default function ContentStack({ feeds }) {
  return (
    <Collapse.Group>
      {feeds &&
        getFeedsFromCategories(feeds).map((feed, key) => (
          <Feed feed={feed} key={key} />
        ))}
    </Collapse.Group>
  );
}
