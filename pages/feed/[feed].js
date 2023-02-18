import Feed from "@/components/feed";
import useFeeds from "@/hooks/useFeeds";
import { Collapse, Grid } from "@nextui-org/react";
import { useRouter } from "next/router";

function getMyFeedFromCategories(categories, feedTitle) {
  // todo: this process is reversed in categories.
  let totalFeeds = [];
  for (const [category, feeds] of Object.entries(categories)) {
    for (const feed of feeds) {
      if (feed.title == feedTitle) return feed;
    }
  }
  return totalFeeds;
}

export default function SpecificFeed() {
  const router = useRouter();
  const feed = router.query;

  const { data, isFetching } = useFeeds();

  if (data)
    return (
      <div style={{ width: "100%" }}>
        <Collapse.Group>
          {<Feed feed={getMyFeedFromCategories(data.results, feed.title)} />}
        </Collapse.Group>
      </div>
    );
}
