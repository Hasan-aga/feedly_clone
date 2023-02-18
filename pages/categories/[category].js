import useFeeds from "@/hooks/useFeeds";
import { useRouter } from "next/router";
import ContentStack from "@/components/contentStack";
import Feed from "@/components/feed";
import { Collapse, Loading, Text } from "@nextui-org/react";
import { isError } from "@tanstack/react-query";
import { toast } from "react-hot-toast";

export default function SpecificCategory() {
  const router = useRouter();
  const { title } = router.query;
  const { data, isLoading } = useFeeds();

  if (isLoading) return <Loading type="points" />;
  if (data) {
    const { results } = data;
    return results[title] ? (
      <div style={{ width: "100%" }}>
        <Collapse.Group>
          {results[title] &&
            results[title].map((feed, key) => <Feed feed={feed} key={key} />)}
        </Collapse.Group>
      </div>
    ) : (
      <Text color="warning">No results for this category.</Text>
    );
  }
}
