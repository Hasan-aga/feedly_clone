import { Grid } from "@nextui-org/react";
import Bookmark from "./icons/bookmark";
import Checkmark from "./icons/checkmark";
import styles from "./cardButtons.module.css";

export default function CardButtons({ articleID }) {
  console.log("article id", articleID);

  async function bookmarkArticle(e, articleID) {
    e.stopPropagation();
    console.log("bookmarking", articleID);
    var requestOptions = {
      method: "POST",
      redirect: "follow",
      cerendtials: "include",
    };
    try {
      const response = await fetch(
        `http://localhost:3000/api/articles?articleid=${articleID}`,
        requestOptions
      );

      if (!response.ok) {
        const result = await response.text();
        throw new Error(result);
      }
    } catch (error) {
      console.log("oops!", error);
    }
  }
  return (
    <>
      <Grid xs={12} justify="flex-end">
        <Bookmark handler={(e) => bookmarkArticle(e, articleID)} />
        <Checkmark />
      </Grid>
    </>
  );
}
