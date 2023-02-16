import { useState, useEffect } from "react";
import { Collapse, Grid, Text } from "@nextui-org/react";
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
  console.log(feeds);
  if (Object.keys(feeds).length === 0) {
    return (
      <div style={{ width: "100%" }}>
        <Text color="warning">Add some feeds to see them here .</Text>
      </div>
    );
  }
  return (
    <div style={{ width: "100%" }}>
      {
        <Collapse.Group>
          {getFeedsFromCategories(feeds).map((feed, key) => (
            <Feed feed={feed} key={key} />
          ))}
        </Collapse.Group>
      }
    </div>
  );
}
