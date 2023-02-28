import { useState, useEffect } from "react";
import {
  Collapse,
  Grid,
  Button,
  Loading,
  Table,
  Row,
  Pagination,
  Avatar,
} from "@nextui-org/react";
import ArticleCard from "./articleCard";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-hot-toast";
import SmallArticleCard from "./smallArticleCard";
import ArticleCardWrapper from "./articleCardWrapper";

export default function Feed({ feed }) {
  const [articles, setArticles] = useState([]);
  const [offset, setOffset] = useState(0);

  async function getArticles(feed, offset = 0) {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL}/api/articles?feedid=${feed.rowid}&offset=${offset}`
    );

    if (!res.ok) {
      throw new Error("Problem while fetching articles.");
    }
    return res.json();
  }

  const { isLoading, data } = useQuery({
    queryKey: ["articles", offset, feed],
    queryFn: () => getArticles(feed, offset),
    onError: (error) => toast.error(`Something went wrong ${error.message}`),
  });

  return (
    <>
      {isLoading ? (
        <Loading type="points" color="currentColor" size="lg" />
      ) : (
        <Collapse
          bordered
          css={{ marginBottom: "$10" }}
          title={feed.title}
          subtitle={feed.total_articles + " total articles"}
          contentLeft={
            feed.favicon && (
              <Avatar
                size="lg"
                src={feed.favicon}
                color="secondary"
                bordered
                squared
              />
            )
          }
        >
          <Grid.Container justify="center">
            <Grid>
              <Pagination
                page={offset / 5 + 1}
                shadow
                noMargin
                align="center"
                total={Math.ceil(feed.total_articles / 5)}
                onChange={(page) => setOffset((page - 1) * 5)}
              />
            </Grid>
            {data.results.map((article, index) => {
              return (
                <ArticleCardWrapper
                  key={index}
                  article={article}
                  feed={feed}
                  offset={offset}
                />
              );
            })}
          </Grid.Container>
        </Collapse>
      )}
    </>
  );
}
