import React, { useState, useEffect } from "react";
import * as api from "../../../api-services/api";
import { useQuery, useQueryClient, useMutation } from "react-query";
import {
  useDisclosure,
  useToast,
  Textarea,
  Box,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalBody,
  ModalFooter,
  Button,
  Spinner,
} from "@chakra-ui/react";
import { AiTwotoneEdit } from "react-icons/ai";

export default function EditReplyForm(props) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [remain, setRemain] = useState(200 - props.currentContent.length);
  const [replyContent, setReplyContent] = useState(props.currentContent);
  const queryClient = useQueryClient();

  const toast = useToast();

  useEffect(async () => {
    // Refetch replys when reply is edited
    props.socket.on("commentChange", (data) => {
      queryClient.invalidateQueries(["openedComments", props.postId]);
    });
  }, []);

  const {
    isLoading,
    mutate: editReply,
    isError,
    error,
  } = useMutation(api.editReply, {
    onMutate: (data) => {
      setRemain(200 - data.content.length);
      setReplyContent(data.content);
      onClose();
    },
    onSuccess: (data) => {
      toast({
        title: "You have edit your reply",
        status: "success",
        duration: 2000,
        isClosable: true,
      });
    },
  });

  if (isError) {
    toast({
      title: "Failed to edit your reply, contact support",
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
        editReply({
          replyId: props.replyId,
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
      {isLoading && (
        <Box position={"absolute"} left={"25px"} bottom={"10px"}>
          updating <Spinner />
        </Box>
      )}
      <Box
        as={"div"}
        display={"flex"}
        justifyContent={"flex-end"}
        fontWeight={"bold"}
      >
        <Button onClick={() => onOpen()}>
          <AiTwotoneEdit fontSize={"sm"} />
        </Button>
      </Box>

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
                value={replyContent}
                onFocus={function (e) {
                  var val = e.target.value;
                  e.target.value = "";
                  e.target.value = val;
                }}
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
