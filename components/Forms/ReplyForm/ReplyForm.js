import React, { useState } from "react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalBody,
  Button,
  useDisclosure,
  Textarea,
  Box,
  useToast,
} from "@chakra-ui/react";

import { useQuery, useQueryClient, useMutation } from "react-query";
import * as api from "../../../api-services/api";

export default function ReplyForm(props) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [remain, setRemain] = useState(200);
  const [replyContent, setReplyContent] = useState("");
  const toast = useToast();

  const {
    isLoading,
    mutate: addReply,
    isError,
    error,
  } = useMutation(api.addReply, {
    onSuccess: () => {
      setRemain(300);
      setReplyContent("");
      onClose();
      setTimeout(() => {
        props.onReplyAdd();
      }, 100);
      toast({
        title: "You have added a reply",
        status: "success",
        duration: 2000,
        isClosable: true,
      });
    },
  });

  if (isError) {
    toast({
      title: "Failed to add a reply, contact support",
      status: "error",
      duration: 2000,
      isClosable: true,
    });
  }

  const checkRemain = (e) => {
    let countedLetters = e.target.value.length;
    let remainedLetters = 200 - countedLetters;
    setRemain(remainedLetters);
    setReplyContent(e.target.value);
  };

  const submitForm = async (e) => {
    e.preventDefault();
    if (replyContent.length > 0) {
      try {
        addReply({
          commentId: props.commentId,
          content: replyContent,
          fromPostDetail: props.fromPostDetail,
        });
      } catch (error) {
        console.log(error);
      }
    }
  };
  return (
    <>
      <Button
        onClick={onOpen}
        border={
          props.buttonWithBorder ? "2px solid black" : "2px solid #e71d36"
        }
        backgroundColor={
          props.buttonBackgroundColor ? props.buttonBackgroundColor : "#e71d36"
        }
        width={props.buttonWidth ? props.buttonWidth : "100px"}
        alignSelf={props.buttonAlign ? props.buttonAlign : "right"}
        color={"black"}
        _hover={{ backgroundColor: props.backgroundColor }}
        mt={3}
        size={["sm"]}
      >
        Add Reply
      </Button>

      <Modal
        isOpen={isOpen}
        onClose={() => {
          setRemain(200);
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
                resize={"none"}
                _focus={{ border: 0 }}
                placeholder={"start typing..."}
                onChange={checkRemain}
                value={props.isEdit ? props.currentValue : replyContent}
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
                colorScheme={"teal"}
                disabled={remain < 0 || remain === 200}
                _hover={{ backgroundColor: props.backgroundColor }}
                backgroundColor={"#e71d36"}
                borderColor={"#e71d36"}
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
