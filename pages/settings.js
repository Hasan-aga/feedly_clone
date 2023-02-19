import Delete from "@/components/icons/delete";
import Move from "@/components/icons/move";
import useFeeds from "@/hooks/useFeeds";
import {
  Button,
  Col,
  Grid,
  Loading,
  Row,
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
      toast("Deleting...");
    },
  });

  function sortArr({ column }) {
    const { items, sortDescriptor } = arr;

    items.sort((a, b) => {
      let first = a[column];
      let second = b[column];
      console.log(`a ${first} | b ${second}`);
      let cmp = collator.compare(first, second);
      if (sortDescriptor === "descending") {
        cmp *= -1;
      }
      return cmp;
    });
    setArr({
      items,
      sortDescriptor:
        sortDescriptor === "ascending" ? "descending" : "ascending",
    });
  }

  const { isLoading, data, isSuccess, isFetching } = useFeeds();

  if (Object.keys(data.results).length === 0) {
    return (
      <Grid>
        <Text color="warning">You have not added any feeds.</Text>
      </Grid>
    );
  }

  useEffect(() => {
    let temp = [];
    for (const [key, value] of Object.entries(data.results)) {
      temp.push(...value);
    }
    setArr({ ...arr, items: [...temp] });
  }, [data.results]);

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
                Title
              </Table.Column>
              <Table.Column>Action</Table.Column>
            </Table.Header>
            <Table.Body>
              {arr.items &&
                arr.items.map((feed, key) => {
                  // todo: delete appears on hover
                  return (
                    <Table.Row key={key + 1}>
                      <Table.Cell>{feed.title}</Table.Cell>
                      <Table.Cell>
                        <div
                          style={{
                            display: "flex",
                            gap: "1rem",
                            alignItems: "center",
                            justifyContent: "flex-start",
                          }}
                        >
                          <Tooltip
                            color="warning"
                            content={
                              <Text b color="#000">
                                Delete feed?
                              </Text>
                            }
                            contentColor="error"
                            placement="top"
                          >
                            <Button
                              onPress={() => mutation.mutate(feed.rowid)}
                              css={{ all: "unset", cursor: "pointer" }}
                            >
                              <Delete />
                            </Button>
                          </Tooltip>

                          <Tooltip
                            color="warning"
                            content={
                              <Text b color="#000">
                                Move to different category?
                              </Text>
                            }
                            contentColor="error"
                            placement="top"
                          >
                            <Button
                              onPress={() => console.log("moving")}
                              css={{ all: "unset", cursor: "pointer" }}
                            >
                              <Move />
                            </Button>
                          </Tooltip>
                        </div>
                      </Table.Cell>
                    </Table.Row>
                  );
                })}
            </Table.Body>
          </Table>
        </Grid>
      </Grid>
    </div>
  );
}
