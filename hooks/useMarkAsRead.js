import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-hot-toast";
/**
 * A hook that returns a React-Query mutation.
 *
 * @param {Object} article - article data.
 * @param {int} offset- the offset used to query the article from db.
 * @param {Object} feed- the feed used to query the article from db.
 * @param {boolean} toggle- flag used to select hook behavior. when true the mutation will cycle between read/unread.
 *
 * @returns {ReactNode} The component UI to be rendered.
 *
 * @example
 * const markReadMutation = useMarkAsRead(article, offset, feed);
 */
export default function useMarkAsRead(article, offset, feed, toggle = "true") {
  if (!article) {
    throw new Error("useMarkAsRead requires an input article!");
  }
  if (offset === "false") {
    throw new Error(
      "useMarkAsRead requires an offset to identify and invalidate the query!"
    );
  }
  if (!article) {
    throw new Error(
      "useMarkAsRead requires a feed to identify and invalidate the  query!"
    );
  }

  const queryClient = useQueryClient();

  const markReadMutation = useMutation({
    mutationFn: () => {
      return markArticleAsRead(article, toggle);
    },
    onError: (error) => toast.error(error.message),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["articles"], offset, feed });
    },
  });

  return markReadMutation;
}

async function markArticleAsRead(article, toggle) {
  var requestOptions = {
    method: getPostMethod(article, toggle),
    redirect: "follow",
    cerendtials: "include",
  };
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/api/articles/read?articleid=${article.articleid}`,
    requestOptions
  );

  if (!response.ok) {
    const result = await response.text();
    throw new Error(result);
  }

  return response.json();
}

function getPostMethod(article, toggle) {
  // only switch between DELETE/POST when the toggle flag is true
  if (toggle) return article.readid ? "DELETE" : "POST";
  return "POST";
}
