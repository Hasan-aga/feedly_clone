import ArticleCard from "@/components/articleCard";
import { Grid, Text } from "@nextui-org/react";
import { useQuery, useQueryClient } from "@tanstack/react-query";

export default function bookmarks() {
  // todo: we need offset and feed so we can pass them to articles for query invalidation
  const { data, isSuccess } = useQuery({
    queryKey: ["bookmarks"],
    queryFn: () => getBookmarks(),
    onError: (error) => toast.error(`Something went wrong ${error.message}`),
  });

  async function getBookmarks() {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL}/api/articles/bookmarks`
    );

    if (!response.ok) {
      const result = await response.text();
      throw new Error(result);
    }

    return response.json();
  }

  if (isSuccess) {
    return (
      <Grid xs={10} justify="center" alignItems="center" direction="column">
        <Text h3>Bookmarks</Text>
        {data.results.map((article, index) => {
          return <ArticleCard key={index} article={article} />;
        })}
      </Grid>
    );
  }
}

// This gets called on every request
// disabled since we use react query to sync state
// export async function getServerSideProps(context) {
//   try {
//     const session = await getSession(context);
//     if (!session) {
//       throw new Error("You are not signed in.");
//     }
//     const controller = await Controller.start(session);
//     const bookmarks = await controller.getMyBookmarks();
//     console.log("bookmarks server", bookmarks);

//     return { props: { bookmarks } };
//   } catch (error) {
//     return { props: { error: error.message } };
//   }
// }
