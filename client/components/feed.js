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

export default function Feed({ feed }) {
  const [articles, setArticles] = useState([]);
  const [offset, setOffset] = useState(0);

  async function getArticles(feed, offset = 0) {
    const res = await fetch(
      `http://localhost:3000/api/articles?feedid=${feed.rowid}&offset=${offset}`
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
          expanded
        >
          <Grid.Container justify="center">
            <Grid>
              <Pagination
                page={offset / 5 + 1}
                shadow
                noMargin
                align="center"
                rowsPerPage={5}
                total={Math.ceil(feed.total_articles / 5)}
                onChange={(page) => setOffset((page - 1) * 5)}
              />
            </Grid>
            <Grid>
              {data.results.map((article, index) => {
                return (
                  <Row alignItems="center" justify="center">
                    <ArticleCard key={index} article={article} />
                  </Row>
                );
              })}
            </Grid>
          </Grid.Container>
        </Collapse>
      )}
    </>
  );
}
