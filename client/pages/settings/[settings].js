import Delete from "@/components/icons/delete";
import useFeeds from "@/hooks/useFeeds";
import { Button, Grid, Loading, Spacer, Table, Text } from "@nextui-org/react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";

export default function Settings() {
  const router = useRouter();
  const queryClient = useQueryClient();

  async function deleteFeed(feedid) {
    var requestOptions = {
      method: "DELETE",
      redirect: "follow",
      cerendtials: "include",
    };
    console.log("delete", feedid);

    const response = await fetch(
      `http://localhost:3000/api/feeds?feedid=${feedid}`,
      requestOptions
    );

    if (!response.ok) {
      throw new Error("failed to delete query");
    }

    return response.json();
  }

  const mutation = useMutation({
    mutationFn: deleteFeed,
    onError: (error) => toast.error(error.message),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["feeds"] }),
  });

  const { isLoading, data, isSuccess, isFetching } = useFeeds();

  let arr = [];
  if (isSuccess) {
    for (const [key, value] of Object.entries(data.results)) {
      arr.push(...value);
    }
  }
  if (isLoading) return <Loading type="points" />;
  if (isSuccess)
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
                {arr &&
                  arr.map((feed, key) => {
                    // todo: delete appears on hover and works on sibling only
                    return (
                      <Table.Row key={key + 1}>
                        <Table.Cell>{feed.title}</Table.Cell>
                        <Table.Cell>
                          <Button
                            onPress={(e) => mutation.mutate(feed.rowid)}
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
