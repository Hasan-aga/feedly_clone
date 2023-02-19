import Delete from "@/components/icons/delete";
import useFeeds from "@/hooks/useFeeds";
import {
  Button,
  Grid,
  Loading,
  Spacer,
  Table,
  Text,
  Tooltip,
  useCollator,
} from "@nextui-org/react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";

export default function Settings() {
  const queryClient = useQueryClient();
  const collator = useCollator({ numeric: true });
  const [arr, setArr] = useState({
    items: [],
    sortDescriptor: "descending",
  });
  async function deleteFeed(feedid) {
    var requestOptions = {
      method: "DELETE",
      redirect: "follow",
      cerendtials: "include",
    };
    console.log("delete", feedid);

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL}/api/feeds?feedid=${feedid}`,
      requestOptions
    );

    if (!response.ok) {
      throw new Error("failed to delete query");
    }

    return response.json();
  }

  const mutation = useMutation({
    mutationFn: (feedid) => deleteFeed(feedid),
    onError: (error) => toast.error(error.message),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["feeds"] });
      toast("invalidating");
    },
  });

  function sortArr({ column }) {
    const { items, sortDescriptor } = arr;
    console.log(items);
    console.log(sortDescriptor);
    items.sort((a, b) => {
      let first = a[column];
      let second = b[column];
      console.log(`a ${first} | b ${second}`);
      let cmp = collator.compare(first, second);
      if (sortDescriptor.direction === "descending") {
        cmp *= -1;
      }
      return cmp;
    });
    console.log("sorted", items);
    setArr({
      items,
      sortDescriptor:
        sortDescriptor === "ascending" ? "descending" : "ascending",
    });
  }

  const { isLoading, data, isSuccess, isFetching } = useFeeds();

  console.log("dat", Object.keys(data.results));
  if (Object.keys(data.results).length === 0) {
    return (
      <Grid>
        <Text color="warning">You have not added any feeds.</Text>
      </Grid>
    );
  }

  useEffect(() => {
    for (const [key, value] of Object.entries(data.results)) {
      setArr({ ...arr, items: [...value] });
    }
  }, []);

  return (
    <div style={{ width: "100%" }}>
      <Grid xs={12} direction="column" justify="center" alignItems="center">
        <Grid>
          <Text color="error" h2>
            Settings
          </Text>
        </Grid>
        <Spacer y={1} />
        <Grid>
          <Table
            compact
            lined
            bordered
            aria-label="Example static collection table with multiple selection"
            css={{
              height: "auto",
              minWidth: "100%",
            }}
            selectionMode="multiple"
            onSortChange={sortArr}
            sortDescriptor={arr.sortDescriptor}
          >
            <Table.Header>
              <Table.Column key="title" allowsSorting>
                TITLE
              </Table.Column>
              <Table.Column>DELETE</Table.Column>
            </Table.Header>
            <Table.Body items={arr.items} loadingState={isFetching}>
              {(feed) => {
                return (
                  <Table.Row key={feed.title}>
                    <Table.Cell>{feed.title}</Table.Cell>
                    <Table.Cell>
                      <Tooltip
                        color="warning"
                        content={
                          <Text b color="#000">
                            Delete feed?
                          </Text>
                        }
                        contentColor="error"
                        placement="right"
                      >
                        <Button
                          onPress={() => mutation.mutate(feed.rowid)}
                          color="error"
                          css={{ all: "unset" }}
                        >
                          <Delete />
                        </Button>
                      </Tooltip>
                    </Table.Cell>
                  </Table.Row>
                );
              }}
            </Table.Body>
          </Table>
        </Grid>
      </Grid>
    </div>
  );
}

// you add a sort function to your data arr
// you can control what gets passed to this function
