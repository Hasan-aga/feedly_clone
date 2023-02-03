import ArticleCard from "@/components/articleCard";
import { Controller } from "@/lib/controller";
import { Grid } from "@nextui-org/react";
import { getSession } from "next-auth/react";

export default function bookmarks(props) {
  if (props.error) return <>Error {props.error}</>;
  return (
    <Grid xs={10} justify="center" direction="column">
      <Grid>
        {props.bookmarks.map((article, index) => {
          return <ArticleCard key={index} article={article} />;
        })}
      </Grid>
    </Grid>
  );
}

// This gets called on every request
export async function getServerSideProps(context) {
  try {
    const session = await getSession(context);
    if (!session) {
      throw new Error("You are not signed in.");
    }
    const controller = await Controller.start(session);
    const bookmarks = await controller.getMyBookmarks();
    console.log("bookmarks server", bookmarks);

    return { props: { bookmarks } };
  } catch (error) {
    return { props: { error: error.message } };
  }
}
