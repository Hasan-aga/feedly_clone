import useFeeds from "@/hooks/useFeeds";
import { useRouter } from "next/router";
import ContentStack from "@/components/contentStack";
import Feed from "@/components/feed";
import { Collapse } from "@nextui-org/react";

export default function SpecificCategory() {
  const router = useRouter();
  const { title } = router.query;
  const {
    data: { results },
  } = useFeeds();
  if (results) {
    console.log(results[title][0].title);

    return (
      <Collapse.Group>
        {results[title].map((feed, key) => (
          <Feed feed={feed} key={key} />
        ))}
      </Collapse.Group>
    );
  }
  return <p>loading...</p>;
}
