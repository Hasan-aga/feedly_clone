import { Collapse, Grid, Image, Loading, Row, Text } from "@nextui-org/react";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Bookmark from "./icons/bookmark";
import Cog from "./icons/cog";

export default function Categories({ feeds }) {
  // {categoryName: [feeds array]}
  const [categoryFeeds, setCategoryFeeds] = useState({});

  useEffect(() => {
    let temp = {};
    feeds &&
      Object.keys(feeds).map((category, key) => {
        temp[category] = feeds[category];
      });
    setCategoryFeeds({ ...categoryFeeds, ...temp });
    console.log("feed cats", categoryFeeds);
  }, [feeds]);

  if (!feeds) return <Loading type="points" color="currentColor" size="sm" />;
  return (
    <>
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
            {feeds &&
              Object.keys(categoryFeeds).map((category, key) => {
                const specificFeeds = categoryFeeds[category];
                return (
                  <Collapse
                    key={key}
                    expanded
                    title={
                      <Link href={`/categories/data?title=${category}`}>
                        <Text h6 css={{ textTransform: "capitalize" }}>
                          {category}
                        </Text>
                      </Link>
                    }
                  >
                    {feeds &&
                      specificFeeds.map((feed, key) => (
                        <Link
                          key={key + 1000}
                          href={`/feed/data?title=${feed.title}&url=${feed.url}&rowid=${feed.rowid}`}
                        >
                          <Row gap={1}>
                            <Grid xs={6}>
                              <Text b>{feed.title}</Text>
                            </Grid>
                            <Grid xs={6} alignItems="center">
                              <Image
                                showSkeleton
                                src={feed.favicon}
                                width={24}
                                height={24}
                              />
                            </Grid>
                          </Row>
                        </Link>
                      ))}
                  </Collapse>
                );
              })}

            {/* {feeds &&
              Object.keys(feeds).map((category, key) => {
                return (
                  <Collapse
                    key={key}
                    expanded
                    title={
                      <Link href={`/categories/data?title=${category}`}>
                        <Text h6 css={{ textTransform: "capitalize" }}>
                          {category}
                        </Text>
                      </Link>
                    }
                  >
                    {feeds[category].map((feed, index) => (
                      <Link
                        key={index + 1000}
                        href={`/feed/data?title=${feed.title}&url=${feed.url}&rowid=${feed.rowid}`}
                      >
                        <Row gap={1}>
                          <Grid xs={6}>
                            <Text b>{feed.title}</Text>
                          </Grid>
                          <Grid xs={6} alignItems="center">
                            <Image src={feed.favicon} width={24} height={24} />
                          </Grid>
                        </Row>
                      </Link>
                    ))}
                  </Collapse>
                );
              })} */}
          </Collapse.Group>
        </Grid>
      </Grid.Container>
    </>
  );
}
