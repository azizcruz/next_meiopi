import React, { useState } from "react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
  useDisclosure,
  Input,
  Textarea,
  Box,
  useToast,
  toast,
  Spinner,
} from "@chakra-ui/react";
import { useQuery, useQueryClient, useMutation } from "react-query";
import * as api from "../../../api-services/api";

export default function CommentForm(props) {
  const queryClient = useQueryClient();
  const toast = useToast();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [remain, setRemain] = useState(300);

  const [commentContent, setCommentContent] = useState("");
  const {
    isLoading,
    mutate: addOpinion,
    isError,
  } = useMutation(api.addOpinion, {
    onMutate: (data) => {},
    onSuccess: (data) => {
      setRemain(300);
      setCommentContent("");
      onClose();
      toast({
        title: "You have added an opinion",
        status: "success",
        duration: 2000,
        isClosable: true,
      });
      let addedComments = document.querySelectorAll(".opinions-wrapper");
      if (addedComments.length > 0) {
        props.onCommentAdd(data._id);
      }
    },
  });

  const checkRemain = (e) => {
    let countedLetters = e.target.value.length;
    let remainedLetters = 200 - countedLetters;

    setRemain(remainedLetters);
    setCommentContent(e.target.value);
  };

  const submitForm = async (e) => {
    e.preventDefault();
    if (commentContent.length > 0) {
      try {
        addOpinion({
          postId: props.postId,
          content: commentContent,
          fromPostDetail: props.fromPostDetail,
        });
      } catch (error) {
        console.log(error);
      }
    }
  };

  if (isError) {
    toast({
      title: "Failed to add a comment, contact support",
      status: "error",
      duration: 2000,
      isClosable: true,
    });
  }

  return (
    <>
      <Button
        onClick={onOpen}
        backgroundColor={"#ff9f1c"}
        fontSize={['sm', 'md', 'lg']}
        border={
          props.buttonWithBorder ? "2px solid black" : "2px solid #ff9f1c"
        }
        color={"black"}
        width={props.buttonWidth ? props.buttonWidth : "100%"}
        alignSelf={props.buttonAlign ? props.buttonAlign : "left"}
        _hover={{ backgroundColor: "#ff9f1c" }}
      >
        Add Opinion
      </Button>

      <Modal
        isOpen={isOpen}
        onClose={() => {
          setRemain(200);
          setCommentContent("");
          onClose();
        }}
        p={0}
        isCentered
      >
        <ModalOverlay />
        <ModalContent>
          <form onSubmit={submitForm}>
            <ModalBody pr={"0"} pb={"0"} pl={"0"} pt={2}>
              <Textarea
                border={0}
                fontSize={"1.2rem"}
                height={"120px"}
                resize={"none"}
                _focus={{ border: 0 }}
                placeholder={"start typing..."}
                onChange={checkRemain}
                value={props.isEdit ? props.currentValue : commentContent}
              />
            </ModalBody>
            <ModalFooter>
              <Box mr={4} color={remain < 0 ? "red.400" : ""}>
                {remain}
              </Box>
              <Button
                colorScheme={"teal"}
                _hover={{ backgroundColor: props.backgroundColor }}
                backgroundColor={"#AAA"}
                borderColor={"#AAA"}
                color={"black"}
                type={"button"}
                onClick={() => {
                  onClose();
                }}
                mr={2}
              >
                Cancel
              </Button>
              <Button
                disabled={remain < 0 || remain === 300}
                _hover={{ backgroundColor: "#ff9f1c" }}
                backgroundColor={"#ff9f1c"}
                color={"black"}
                type={"submit"}
              >
                Confirm
              </Button>
            </ModalFooter>
          </form>
        </ModalContent>
      </Modal>
    </>
  );
}
