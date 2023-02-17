import { Grid } from "@nextui-org/react";
import ArticleCard from "./articleCard";
import SmallArticleCard from "./smallArticleCard";

/**
 * A Next.js component that displays one of two article cards that is either small or big decided by the device screen size.
 *
 * @param {article} props - The article data.
 * @param {offset} props - The article feed.
 * @param {feed} props - The feed or the article.
 *
 * @returns {ReactNode} The component UI to be rendered.
 *
 * @example
 * <ArticleCardWrapper article={article}/>
 */
export default function ArticleCardWrapper({ article, offset, feed }) {
  return (
    <Grid.Container
      xs={12}
      css={{
        opacity: `${article.readid ? "0.5" : "1"}`,
        cursor: "pointer",
      }}
    >
      <Grid xs={0} sm={12} dir={article.language === "ar" ? "rtl" : ""}>
        <ArticleCard article={article} offset={offset} feed={feed} />
      </Grid>
      <Grid xs={12} sm={0} dir={article.language === "ar" ? "rtl" : ""}>
        <SmallArticleCard article={article} offset={offset} feed={feed} />
      </Grid>
    </Grid.Container>
  );
}
