import Delete from "@/components/icons/delete";
import { Button, Grid, Spacer, Table, Text } from "@nextui-org/react";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

export default function Settings() {
  const router = useRouter();
  const [feeds, setFeeds] = useState();
  const [selected, setSelected] = useState();

  async function deleteFeed(feedid, e) {
    var requestOptions = {
      method: "DELETE",
      redirect: "follow",
      cerendtials: "include",
    };
    console.log("delete", feedid);

    try {
      await fetch(
        `http://localhost:3000/api/feeds?feedid=${feedid}`,
        requestOptions
      );
    } catch (error) {
      console.error("oops!", error);
    }
  }
  useEffect(() => {
    async function getFeeds() {
      const res = await fetch("http://localhost:3000/api/feeds");
      const { results } = await res.json();
      if (results) {
        console.log("results", results);
        let arr = [];
        for (const [key, value] of Object.entries(results)) {
          console.log(`${key}: ${value}`);
          arr.push(...value);
        }
        setFeeds(arr);
        console.log(" feeds now", feeds);
      }
    }

    getFeeds();
  }, []);
  return (
    <>
      <Grid xs={10} justify="center" direction="column">
        <Grid>
          <Text color="error" h2>
            Settings
          </Text>
        </Grid>
        <Spacer y={1} />
        <Grid>
          <Table
            lined
            bordered
            aria-label="Example static collection table with multiple selection"
            css={{
              height: "auto",
              minWidth: "100%",
            }}
            selectionMode="multiple"
          >
            <Table.Header>
              <Table.Column>TITLE</Table.Column>
              <Table.Column>DELETE</Table.Column>
            </Table.Header>
            <Table.Body>
              {feeds &&
                feeds.map((feed, key) => {
                  // todo: delete appears on hover and works on sibling only
                  return (
                    <Table.Row key={key + 1}>
                      <Table.Cell>{feed.title}</Table.Cell>
                      <Table.Cell>
                        <Button
                          onPress={(e) => deleteFeed(feed.rowid, e)}
                          title="Delete feed!"
                          color="error"
                          ghost
                          auto
                        >
                          X
                        </Button>
                      </Table.Cell>
                    </Table.Row>
                  );
                })}
            </Table.Body>
          </Table>
        </Grid>
      </Grid>
    </>
  );
}
