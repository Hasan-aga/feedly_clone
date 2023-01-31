import { Grid, Tooltip } from "@nextui-org/react";
import Bookmark from "./icons/bookmark";
import Checkmark from "./icons/checkmark";
import styles from "./cardButtons.module.css";
import ErrorCard from "./errorCard";
import { useState } from "react";
import useError from "@/hooks/useError";

export default function CardButtons({ articleID }) {
  const [isVisible, toggleVisibility] = useError();
  const [bookmarked, setBookmarked] = useState(false);

  async function bookmarkArticle(e, articleID) {
    e.stopPropagation();
    setBookmarked(!bookmarked);

    var requestOptions = {
      method: bookmarked ? "DELETE" : "POST",
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
      toggleVisibility();
    }
  }
  return (
    <>
      <Grid xs={12} justify="flex-end">
        <Tooltip
          content={bookmarked ? "Remove bookmark" : "Bookmark"}
          rounded
          color="primary"
        >
          <Bookmark
            fill={bookmarked}
            handler={(e) => bookmarkArticle(e, articleID)}
          />
        </Tooltip>
        <Checkmark />
        {isVisible && (
          <p style={{ position: "fixed", top: "5px", right: "5px" }}>
            Already bookmarked
          </p>
        )}
      </Grid>
    </>
  );
}
