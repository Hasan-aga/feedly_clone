import { useState, useEffect } from "react";
import { Collapse, Grid, Button, Loading, Table, Row } from "@nextui-org/react";
import ArticleCard from "./articleCard";

export default function Feed({ feed }) {
  const [articles, setArticles] = useState([]);
  const [offset, setOffset] = useState(0);
  const [loading, setLoading] = useState(false);
  const [mainLoading, setMainLoading] = useState(false);

  console.log(`total articles ${articles[0]?.total}`, articles);

  async function getArticles(offset = 0) {
    // todo: use index pagination
    const res = await fetch(
      `http://localhost:3000/api/articles?feedid=${feed.rowid}&offset=${offset}`
    );
    const { results } = await res.json();

    if (results) {
      offset === 0
        ? setArticles([...results])
        : setArticles([...articles, ...results]);
      setLoading(false);
      setMainLoading(false);
    }
  }

  async function loadMore() {
    setLoading(true);
    const newOffset = offset + 5;
    setOffset(newOffset);

    await getArticles(newOffset);
  }
  useEffect(() => {
    console.log("new feed", articles);
    setMainLoading(true);
    getArticles();
  }, [feed]);

  if (mainLoading) {
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
            <Table
              aria-label="Example table with static content"
              css={{
                height: "auto",
                minWidth: "100%",
              }}
            >
              <Table.Header>
                <Table.Column></Table.Column>
              </Table.Header>
              <Table.Body>
                {articles.map((article, index) => {
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
              <Table.Pagination
                shadow
                noMargin
                align="center"
                rowsPerPage={5}
                total={Math.ceil(articles[0]?.total / 5)}
                onPageChange={(page) => getArticles(page * 5)}
              />
            </Table>
            <Button flat color="primary" auto onPress={loadMore}>
              {loading ? (
                <Loading type="points" color="currentColor" size="sm" />
              ) : (
                "Load More"
              )}
            </Button>
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
