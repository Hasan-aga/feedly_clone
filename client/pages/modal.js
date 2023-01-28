import { Modal, Button, Text, Input, Spacer, Loading } from "@nextui-org/react";
import { useRef, useState } from "react";

export default function CustomModal({ children, visible, closeHandler }) {
  const [input, setInput] = useState(null);
  const [category, setCategory] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const categoryInput = useRef();
  async function addHandler() {
    var requestOptions = {
      method: "POST",
      redirect: "follow",
      cerendtials: "include",
    };
    try {
      await fetch(
        `http://localhost:3000/api/addFeed?url=${input}&category=${category}`,
        requestOptions
      );
    } catch (error) {
      console.log("oops!", error);
    } finally {
      setIsLoading(false);
      closeHandler();
    }
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
        <Spacer />
        <Input
          autoFocus
          aria-label="add feed"
          bordered
          fullWidth
          color="primary"
          size="lg"
          labelPlaceholder="ex: http://blog.hasan.one"
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={async (e) => {
            if (e.key === "Enter") {
              setInput(e.target.value);
              categoryInput.current.focus();
            }
          }}
          //   contentLeft={<Mail fill="currentColor" />}
        />
        <Spacer />
        <Input
          ref={categoryInput}
          aria-label="add category"
          bordered
          fullWidth
          color="primary"
          size="lg"
          labelPlaceholder="ex: Tech"
          onChange={(e) => setCategory(e.target.value)}
          onKeyDown={async (e) => {
            if (e.key === "Enter") {
              setCategory(e.target.value);
              setIsLoading(true);
              await addHandler();
            }
          }}
        />
      </Modal.Body>
      <Modal.Footer>
        <Button auto flat color="error" onPress={closeHandler}>
          Close
        </Button>
        <Button auto onPress={addHandler}>
          {isLoading ? (
            <Loading type="points" color="currentColor" size="sm" />
          ) : (
            "Add"
          )}
        </Button>
      </Modal.Footer>
    </Modal>
  );
}
