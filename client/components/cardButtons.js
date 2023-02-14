import { Grid, Tooltip } from "@nextui-org/react";
import Bookmark from "./icons/bookmark";
import Checkmark from "./icons/checkmark";
import styles from "./cardButtons.module.css";
import ErrorCard from "./errorCard";
import { useState } from "react";
import useError from "@/hooks/useError";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-hot-toast";

export default function CardButtons({
  article,
  isRead,
  setIsRead,
  offset,
  feed,
}) {
  const queryClient = useQueryClient();

  async function bookmarkArticle(articleID) {
    var requestOptions = {
      method: article.bookmarkid ? "DELETE" : "POST",
      redirect: "follow",
      cerendtials: "include",
    };
    const response = await fetch(
      `http://localhost:3000/api/articles/bookmarks?articleid=${articleID}`,
      requestOptions
    );

    if (!response.ok) {
      const result = await response.text();
      throw new Error(result);
    }
    return response.json();
  }

  // add remove to/from bookmarks
  const bookmarkMutation = useMutation({
    mutationFn: () => {
      return bookmarkArticle(article.articleid);
    },
    onError: (error) => toast.error(error.message),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["bookmarks"] });
      queryClient.invalidateQueries({ queryKey: ["articles"], offset, feed });
    },
  });

  async function markArticleAsRead(e, articleID) {
    console.log("mark as", isRead ? "unread" : "read");
    e.stopPropagation();
    setIsRead(!isRead);

    var requestOptions = {
      method: isRead ? "DELETE" : "POST",
      redirect: "follow",
      cerendtials: "include",
    };
    try {
      const response = await fetch(
        `http://localhost:3000/api/articles/read?articleid=${articleID}`,
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
    <Grid xs={12} justify="flex-end">
      <Tooltip
        content={article.bookmarkid ? "Remove bookmark" : "Bookmark"}
        rounded
        color="primary"
      >
        <Bookmark
          fill={article.bookmarkid}
          handler={(e) => {
            e.stopPropagation();
            bookmarkMutation.mutate(e);
          }}
        />
      </Tooltip>
      <Tooltip
        content={isRead ? "Mark as unread" : "Mark as read"}
        rounded
        color="primary"
      >
        <Checkmark handler={(e) => markArticleAsRead(e, article.articleID)} />
      </Tooltip>
    </Grid>
  );
}
