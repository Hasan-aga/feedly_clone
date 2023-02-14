import {
  Modal,
  Button,
  Text,
  Input,
  Spacer,
  Loading,
  Grid,
} from "@nextui-org/react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useEffect, useRef, useState } from "react";
import { toast } from "react-hot-toast";

export default function CustomModal({ children, visible, closeHandler }) {
  const [link, setLink] = useState(null);
  const [category, setCategory] = useState(null);
  const categoryInput = useRef();
  const queryClient = useQueryClient();

  async function addFeed(link, category) {
    var requestOptions = {
      method: "POST",
      redirect: "follow",
      cerendtials: "include",
    };
    const response = await fetch(
      `http://localhost:3000/api/feeds?url=${link}&category=${category}`,
      requestOptions
    );

    if (!response.ok) {
      const result = await response.json();
      throw new Error(result.error);
    }

    return response.json();
  }

  const mutation = useMutation({
    mutationFn: () => {
      return addFeed(link, category);
    },
    onError: (error) => toast.error(error.message),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["feeds"] }),
  });

  // todo: call it inside onSuccess above
  useEffect(() => {
    closeHandler();
  }, [mutation.isSuccess]);

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
          autoComplete="on"
          autoFocus
          aria-label="add feed"
          bordered
          fullWidth
          color="primary"
          size="lg"
          labelPlaceholder="ex: blog.hasan.one"
          onChange={(e) => setLink(e.target.value)}
          onKeyDown={async (e) => {
            if (e.key === "Enter") {
              setLink(e.target.value);
              categoryInput.current.focus();
            }
          }}
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
          onChange={(e) => setCategory(e.target.value.toLowerCase())}
          onKeyDown={async (e) => {
            if (e.key === "Enter") {
              setCategory(e.target.value);
              mutation.mutate();
            }
          }}
        />
      </Modal.Body>
      <Modal.Footer>
        <Button auto flat color="error" onPress={closeHandler}>
          Close
        </Button>
        <Button auto onPress={mutation.mutate}>
          {mutation.isLoading ? (
            <Loading type="points" color="currentColor" size="sm" />
          ) : (
            "Add"
          )}
        </Button>
      </Modal.Footer>
    </Modal>
  );
}
