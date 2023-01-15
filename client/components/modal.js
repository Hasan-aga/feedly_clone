import { Modal, Button, Text, Input, Row, Checkbox } from "@nextui-org/react";
import { useState } from "react";

export default function CustomModal({ children, visible, closeHandler }) {
  const [input, setInput] = useState(null);
  function addHandler(e) {
    console.log(input);
    closeHandler();
  }
  return (
    <Modal
      closeButton
      aria-labelledby="modal-title"
      open={visible}
      onClose={closeHandler}
    >
      <Modal.Header>
        <Text id="modal-title" size={18}>
          Add a blog's URL
        </Text>
      </Modal.Header>
      <Modal.Body>
        <Input
          aria-label="add feed"
          clearable
          bordered
          fullWidth
          color="primary"
          size="lg"
          placeholder="ex: http://blog.hasan.one"
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              setInput(e.target.value);
              addHandler();
            }
          }}
          //   contentLeft={<Mail fill="currentColor" />}
        />
      </Modal.Body>
      <Modal.Footer>
        <Button auto flat color="error" onPress={closeHandler}>
          Close
        </Button>
        <Button auto onPress={addHandler}>
          Add
        </Button>
      </Modal.Footer>
    </Modal>
  );
}
