import { useState, useEffect } from "react";
import {
  Collapse,
  Grid,
  Button,
  Loading,
  Table,
  Row,
  Pagination,
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
      throw new Error("Problem while fetching articles.", res.ok);
    }
    return res.json();
  }

  const { isLoading, data } = useQuery({
    queryKey: ["articles", offset, feed],
    queryFn: () => getArticles(feed, offset),
    onError: (error) => toast.error(`Something went wrong ${error.message}`),
  });

  console.log(`${isLoading}`);

  return (
    <>
      {isLoading ? (
        <Loading type="points" color="currentColor" size="lg" />
      ) : (
        <Collapse title={feed.title} bordered expanded>
          {
            <Grid.Container
              direction="column"
              justify="center"
              alignItems="center"
              css={{ rowGap: "$10" }}
            >
              <Grid xs={12}>
                <Table aria-label="Example table with static content">
                  <Table.Header>
                    <Table.Column align="center">
                      <Pagination
                        page={offset / 5 + 1}
                        shadow
                        noMargin
                        align="center"
                        rowsPerPage={5}
                        total={Math.ceil(feed.total_articles / 5)}
                        onChange={(page) => setOffset((page - 1) * 5)}
                      />
                    </Table.Column>
                  </Table.Header>
                  <Table.Body>
                    {data.results.map((article, index) => {
                      return (
                        <Table.Row key={index}>
                          <Table.Cell>
                            <Row alignItems="center" justify="center">
                              <ArticleCard key={index} article={article} />
                            </Row>
                          </Table.Cell>
                        </Table.Row>
                      );
                    })}
                  </Table.Body>
                </Table>
              </Grid>
            </Grid.Container>
          }
        </Collapse>
      )}
    </>
  );
}
