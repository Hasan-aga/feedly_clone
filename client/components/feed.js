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

  async function getArticles() {
    const res = await fetch(
      `http://localhost:3000/api/articles?feedid=${feed.rowid}&offset=${0}`
    );

    if (!res.ok) {
      throw new Error("Problem while fetching articles.", res.ok);
    }
    return res.json();
  }

  const { isLoading, data } = useQuery({
    queryKey: ["articles"],
    queryFn: getArticles,
    onError: (error) => toast.error(`Something went wrong ${error.message}`),
  });

  console.log(`${isLoading}`);

  if (isLoading) {
    return <Loading type="points" color="currentColor" size="lg" />;
  }

  return (
    <>
      <Collapse title={feed.title} bordered expanded>
        {
          <Grid.Container
            direction="column"
            justify="center"
            alignItems="center"
            css={{ rowGap: "$10" }}
          >
            <Table aria-label="Example table with static content">
              <Table.Header>
                <Table.Column align="center">
                  <Pagination
                    shadow
                    noMargin
                    align="center"
                    rowsPerPage={5}
                    total={Math.ceil(feed.total_articles / 5)}
                    onChange={(page) => getArticles((page - 1) * 5)}
                  />
                </Table.Column>
              </Table.Header>
              <Table.Body>
                {data.results.map((article, index) => {
                  return (
                    <Table.Row key={index}>
                      <Table.Cell>
                        <Row>
                          <ArticleCard key={index} article={article} />
                        </Row>
                      </Table.Cell>
                    </Table.Row>
                  );
                })}
              </Table.Body>
            </Table>
          </Grid.Container>
        }
      </Collapse>

      {/* {articles && (
        <Collapse title={feed.title} bordered>
          <Grid.Container
            direction="column"
            justify="center"
            alignItems="center"
            css={{ rowGap: "$10" }}
          >
            {articles.map((article, index) => {
              return <ArticleCard key={index} article={article} />;
            })}
            <Button flat color="primary" auto onPress={loadMore}>
              {loading ? (
                <Loading type="points" color="currentColor" size="sm" />
              ) : (
                "Load More"
              )}
            </Button>
          </Grid.Container>
        </Collapse>
      )} */}
    </>
  );
}
