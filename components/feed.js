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

export default function Feed({ feed }) {
  const [articles, setArticles] = useState([]);
  const [offset, setOffset] = useState(0);

  async function getArticles(feed, offset = 0) {
    console.log(offset);
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
            {data.results.map((article, index) => {
              console.log("art", article);
              return (
                <>
                  <Grid
                    xs={0}
                    sm={12}
                    key={index}
                    dir={article.language === "ar" ? "rtl" : ""}
                  >
                    <ArticleCard
                      article={article}
                      offset={offset}
                      feed={feed}
                    />
                  </Grid>
                  <Grid
                    xs={12}
                    sm={0}
                    key={index}
                    dir={article.language === "ar" ? "rtl" : ""}
                  >
                    <SmallArticleCard
                      article={article}
                      offset={offset}
                      feed={feed}
                    />
                  </Grid>
                </>
              );
            })}
          </Grid.Container>
        </Collapse>
      )}
    </>
  );
}
