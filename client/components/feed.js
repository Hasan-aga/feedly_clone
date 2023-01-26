import { useState, useEffect } from "react";
import { Collapse, Text, Button, Loading } from "@nextui-org/react";

export default function Feed({ feed }) {
  const [articles, setArticles] = useState([[]]);
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
        {articles &&
          articles.map((article, index) => {
            return <Text key={index}>{article.title}</Text>;
          })}
        <Button flat color="primary" auto onPress={loadMore}>
          {loading ? <Loading /> : "Load More"}
        </Button>
      </Collapse>
    </>
  );
}
