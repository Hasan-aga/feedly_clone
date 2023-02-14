import { useState, useEffect } from "react";
import { Collapse, Grid } from "@nextui-org/react";
import Feed from "./feed";

function getFeedsFromCategories(categories) {
  // todo: this process is reversed in categories.
  let totalFeeds = [];
  for (const [category, feeds] of Object.entries(categories)) {
    totalFeeds.push(...feeds);
  }
  return totalFeeds;
}
export default function ContentStack({ feeds }) {
  return (
    <div style={{ width: "100%" }}>
      {feeds && (
        <Collapse.Group>
          {getFeedsFromCategories(feeds).map((feed, key) => (
            <Feed feed={feed} key={key} />
          ))}
        </Collapse.Group>
      )}
    </div>
  );
}
