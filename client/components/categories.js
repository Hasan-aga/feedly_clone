import useFeeds from "@/hooks/useFeeds";
import { Collapse, Grid, Image, Loading, Row, Text } from "@nextui-org/react";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Bookmark from "./icons/bookmark";
import Cog from "./icons/cog";

function renderMap(feedMap) {
  let result = [];
  for (const [category, feedArr] of feedMap.entries()) {
    result.push(
      <Collapse
        key={category}
        expanded
        title={
          <Link href={`/categories/data?title=${category}`}>
            <Text h6 css={{ textTransform: "capitalize" }} color="primary">
              &#128279;
              {category}
            </Text>
          </Link>
        }
      >
        {feedArr.map((feed, key) => {
          return (
            <Link
              key={key + 1000}
              href={`/feed/data?title=${feed.title}&url=${feed.url}&rowid=${feed.rowid}`}
            >
              <Row gap={1}>
                <Grid xs={10}>
                  <Text>{feed.title}</Text>
                </Grid>
                <Grid xs={1} alignItems="flex-end" justify="center">
                  {feed.favicon && (
                    <Image
                      showSkeleton
                      src={feed.favicon}
                      width={24}
                      height={24}
                    />
                  )}
                </Grid>
              </Row>
            </Link>
          );
        })}
      </Collapse>
    );
  }
  return result;
}

export default function Categories() {
  // {categoryName: [feeds array]}
  const { data, isSuccess, isLoading } = useFeeds();
  if (!data) return;
  const { results } = data;

  if (isLoading) {
    return <p>loading...</p>;
  }

  if (results) {
    const feedMap = new Map(Object.entries(results));

    return (
      <Grid.Container direction="column">
        <Grid>
          <Text h5>FEEDS</Text>
        </Grid>
        <Row>
          <Grid xs={9}>
            <Link href="/">All</Link>
          </Grid>
          <Grid xs={1.5}>
            <Link href="/settings/data?hello=world">
              <Cog />
            </Link>
          </Grid>
          <Grid>
            <Link href="/bookmarks">
              <Bookmark />
            </Link>
          </Grid>
        </Row>
        <Grid>
          <Collapse.Group accordion={false}>
            {renderMap(feedMap)}
          </Collapse.Group>
        </Grid>
      </Grid.Container>
    );
  }
  return (
    <Grid xs={8}>
      <Text color="warning">Your feeds will be displayed here 👇️</Text>
    </Grid>
  );
}
