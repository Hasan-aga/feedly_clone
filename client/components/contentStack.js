import { useState, useEffect } from "react";
import { Collapse } from "@nextui-org/react";
import Feed from "./feed";

export default function ContentStack({ feeds }) {
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
