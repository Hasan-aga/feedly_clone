import { useSession, signIn, signOut } from "next-auth/react";
import { User, Grid, Button, Card, Text, Spacer } from "@nextui-org/react";
import CustomModal from "@/pages/modal";
import { useEffect, useState } from "react";
import { unstable_getServerSession } from "next-auth";
import { getFeedsOfUser } from "@/lib/db";
import { XMLParser, XMLBuilder, XMLValidator } from "fast-xml-parser";
import ArticleCard from "@/components/articleCard";

export default function Profile({ links }) {
  async function callLink(link) {
    const res = await fetch(link);
    console.log(`calling ${link}`, link);
    if (res.ok) {
      const articles = await res.text();

      const parser = new XMLParser();
      let articleObject = parser.parse(articles);
      setArticle(articleObject.rss.channel);
    }
  }
  const { data: session } = useSession();
  const [visible, setVisible] = useState(false);
  const [articles, setArticle] = useState(null);
  console.log(articles);
  useEffect(() => {
    if (links.length > 0) callLink(links[1].url);
  }, []);

  if (session) {
    return (
      <>
        <User src={session.user.image} name={session.user.name} />
        <br />
        <Button onPress={() => signOut()}>Sign out</Button>
        <Spacer y={1} />
        <Grid>
          <Button onPress={() => setVisible(true)}>Add a feed</Button>
          <CustomModal
            visible={visible}
            closeHandler={() => setVisible(false)}
          />
        </Grid>
        <Spacer y={2} />
        {articles &&
          articles.item.map((a, i) => <ArticleCard key={i} article={a} />)}
      </>
    );
  }
  return (
    <>
      Not signed in <br />
      <button onClick={() => signIn()}>Sign in</button>
    </>
  );
}

// This gets called on every request
export async function getServerSideProps({ req, res }) {
  const session = await unstable_getServerSession(req, res);
  // console.log("session:", session.user);
  // todo: query and save the rss context from server side maybe works against cors
  const data = await getFeedsOfUser(session.user);
  // Pass data to the page via props
  return { props: { links: data.rows } };
}
