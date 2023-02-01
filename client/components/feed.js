import { useState, useEffect } from "react";
import { Collapse, Grid, Button, Loading } from "@nextui-org/react";
import ArticleCard from "./articleCard";

export default function Feed({ feed }) {
  const [articles, setArticles] = useState([]);
  const [offset, setOffset] = useState(0);
  const [loading, setLoading] = useState(false);
  const [mainLoading, setMainLoading] = useState(false);

  async function getArticles(offset = 0) {
    const res = await fetch(
      `http://localhost:3000/api/articles?feedid=${feed.rowid}&offset=${offset}`
    );
    const { results } = await res.json();

    if (results) {
      setLoading(false);
      setMainLoading(false);
      setArticles([...articles, ...results]);
      console.log("offset", offset);
      console.log("articles", results);
    }
  }

  async function loadMore() {
    setLoading(true);
    const newOffset = offset + 5;
    setOffset(newOffset);

    await getArticles(newOffset);
  }
  useEffect(() => {
    setMainLoading(true);
    getArticles();
  }, [feed]);

  if (mainLoading) {
    return <Loading type="points" color="currentColor" size="lg" />;
  }

  return (
    <>
      {articles && (
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
      )}
    </>
  );
}
