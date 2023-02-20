import React from "react";
import { Text, Button, Grid, Row, Input } from "@nextui-org/react";

export const MoveCategory = ({ feed }) => {
  return (
    <Grid.Container
      css={{ borderRadius: "14px", padding: "0.75rem", maxWidth: "330px" }}
    >
      <Row>
        <Text b>I want to move {feed.title} to:</Text>
      </Row>
      <Row>
        <Input
          autoFocus
          aria-label="pick new category"
          bordered
          fullWidth
          color="primary"
          size="lg"
          labelPlaceholder="ex: Tech"
          onChange={(e) => setLink(e.target.value)}
          onKeyDown={async (e) => {
            if (e.key === "Enter") {
              setLink(e.target.value);
              categoryInput.current.focus();
            }
          }}
        />
      </Row>
      <Grid.Container justify="space-between" alignContent="center">
        <Grid>
          <Button size="sm" light>
            Cancel
          </Button>
        </Grid>
        <Grid>
          <Button size="sm" shadow color="error">
            Delete
          </Button>
        </Grid>
      </Grid.Container>
    </Grid.Container>
  );
};
