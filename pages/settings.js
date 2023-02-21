import Delete from "@/components/icons/delete";
import Move from "@/components/icons/move";
import useFeeds from "@/hooks/useFeeds";
import {
  Button,
  Col,
  Grid,
  Input,
  Loading,
  Modal,
  Popover,
  Row,
  Spacer,
  Table,
  Text,
  Tooltip,
  useCollator,
} from "@nextui-org/react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useEffect, useRef, useState } from "react";
import { toast } from "react-hot-toast";

export default function Settings() {
  const [openMap, setopenMap] = useState();
  const queryClient = useQueryClient();
  const collator = useCollator({ numeric: true });
  const [arr, setArr] = useState({
    items: [],
    sortDescriptor: { direction: "descending", column: "title" },
  });

  function handleOpenClose(feed) {
    setopenMap((prev) => {
      const keyExists = prev && Object.keys(prev).includes(feed.title);
      return {
        ...prev,
        [feed.title]: keyExists ? !prev[feed.title] : true,
      };
    });
  }

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

  const deleteMutation = useMutation({
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
      let cmp = collator.compare(first, second);
      if (sortDescriptor.direction === "descending") {
        cmp *= -1;
      }
      return cmp;
    });
    setArr({
      items,
      sortDescriptor:
        sortDescriptor.direction === "ascending"
          ? { direction: "descending", column: "title" }
          : { direction: "ascending", column: "title" },
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
    //todo: use map to store key/value
    let temp = [];
    for (const [key, value] of Object.entries(data.results)) {
      temp.push(...value);
    }
    setArr({ ...arr, items: [...temp] });
    let tempMap = {};
    for (let element of temp) {
      tempMap[element.title] = false;
    }
    setopenMap(tempMap);
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
                              key={`delete${feed.title}`}
                              onPress={() => deleteMutation.mutate(feed.rowid)}
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
                            <Popover
                              isOpen={openMap && openMap[feed.title]}
                              onOpenChange={() => handleOpenClose(feed)}
                              key={`pop${feed.title}`}
                            >
                              <Popover.Trigger>
                                <Button
                                  key={`move${feed.title}`}
                                  css={{ all: "unset", cursor: "pointer" }}
                                >
                                  <Move />
                                </Button>
                              </Popover.Trigger>
                              <Popover.Content>
                                <MovePopup
                                  feed={feed}
                                  close={() =>
                                    setopenMap((prev) => {
                                      return { ...prev, [feed.title]: false };
                                    })
                                  }
                                />
                              </Popover.Content>
                            </Popover>
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

function MovePopup({ feed, close }) {
  const queryClient = useQueryClient();
  const inputRef = useRef();

  const moveMutation = useMutation({
    mutationFn: ({ feedid, category }) => moveFeedToCategory(feedid, category),
    onError: (error) => toast.error(error.message),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["feeds"] });
      toast("Moving...");
    },
  });

  async function moveFeedToCategory(feedid, newCategory) {
    var requestOptions = {
      method: "PUT",
      redirect: "follow",
      cerendtials: "include",
    };
    console.log("move", feedid);

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL}/api/feeds?feedid=${feedid}&category=${newCategory}`,
      requestOptions
    );

    if (!response.ok) {
      throw new Error("failed to move feed");
    }

    return response.json();
  }

  return (
    <Grid css={{ padding: "$10" }}>
      <Row>
        <Text id="popup text" size={18}>
          Move <Text b>{feed.title}</Text> to:
        </Text>
      </Row>
      <Row>
        <Input
          ref={inputRef}
          aria-label="move to category"
          placeholder="Select Category"
          onKeyDown={async (e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              saveAndClose(e.target.value, feed.rowid);
            }
          }}
        ></Input>
      </Row>
      <Spacer />
      <Row>
        <Grid.Container justify="space-between" alignContent="center">
          <Grid>
            <Button size="xs" onPress={close}>
              Cancel
            </Button>
          </Grid>
          <Grid>
            <Button
              onPress={() => saveAndClose(inputRef.current.value, feed.rowid)}
              size="xs"
              shadow
              color="error"
            >
              Move
            </Button>
          </Grid>
        </Grid.Container>
      </Row>
    </Grid>
  );

  function saveAndClose(category, feedid) {
    // note: mutation expects one parameter, to pass more use object:
    moveMutation.mutate({ feedid, category });
    close();
  }
}
