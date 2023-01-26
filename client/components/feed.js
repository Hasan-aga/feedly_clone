import { useState, useEffect } from "react";
import { Collapse, Grid, Button, Loading } from "@nextui-org/react";
import ArticleCard from "./articleCard";

export default function Feed({ feed }) {
  const [articles, setArticles] = useState([]);
  const [offset, setOffset] = useState(0);
  const [loading, setLoading] = useState(false);

  async function getArticles() {
    const res = await fetch(
      `http://localhost:3000/api/getArticlesOfFeed?feedid=${feed.rowid}&offset=${offset}`
    );
    const { results } = await res.json();

    if (results) {
      setLoading(false);
      setArticles([...articles, ...results]);
      console.log("articles", articles);
    }
  }

  async function loadMore() {
    setLoading(true);
    const newOffset = offset + 5;
    setOffset(newOffset);
    await getArticles();
  }
  useEffect(() => {
    getArticles();
  }, []);

  return (
    <>
      <Collapse title={feed.title}>
        <Grid.Container
          direction="column"
          justify="center"
          alignItems="center"
          gap={2}
        >
          {articles &&
            articles.map((article, index) => {
              return <ArticleCard article={article} />;
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
    </>
  );
}
