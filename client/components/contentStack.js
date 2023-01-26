import { useState, useEffect } from "react";
export default function ContentStack() {
  const [articles, setArticles] = useState();
  useEffect(() => {
    async function getArticles() {
      const res = await fetch("http://localhost:3000/api/getMyArticles");
      const { results } = await res.json();

      if (results) {
        for (let key of Object.keys(results)) {
          console.log(results[key]);
        //   todo: break down api
        // api for fetching articles of feed
        // api for fetching feeds of user = this is where we keep articles uptodate
        }
      }
    }

    getArticles();
  }, []);

  return (
    <>
      <h4>{articles && Object.keys(articles).map((key) => key)}</h4>
    </>
  );
}
