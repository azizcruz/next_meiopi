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

export default function EditOpinionForm(props) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [remain, setRemain] = useState(200 - props.currentContent.length);
  const [commentContent, setCommentContent] = useState(props.currentContent);
  const queryClient = useQueryClient();

  const toast = useToast();

  useEffect(async () => {}, []);

  const {
    isLoading,
    mutate: editOpinion,
    isError,
    error,
  } = useMutation(api.editOpinion, {
    onMutate: (data) => {
      setRemain(200 - data.content.length);
      setCommentContent(data.content);
      onClose();
    },
    onSuccess: (data) => {
      toast({
        title: "You have edited your opinion",
        status: "success",
        duration: 2000,
        isClosable: true,
      });
    },
  });

  if (isError) {
    toast({
      title: "Failed to edit your opinion, contact support",
      status: "error",
      duration: 2000,
      isClosable: true,
    });
  }

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
        editOpinion({
          commentId: props.commentId,
          content: commentContent,
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
        <Box
          position={"absolute"}
          left={"40%"}
          top={"0"}
          fontSize={["sm", "md", "lg"]}
        >
          <Box as={"span"}>updating</Box>
          <Spinner size={"sm"} top={"1"} position={"relative"} />
        </Box>
      )}
      <Box as={"span"} mr={"2"} mt={"1"} fontWeight={"bold"}>
        <Button
          position={"absolute"}
          bottom={2}
          right={2}
          onClick={() => onOpen()}
        >
          <AiTwotoneEdit fontSize={"large"} />
        </Button>
      </Box>

      <Modal isOpen={isOpen} p={0} isCentered>
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
                value={commentContent}
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
                disabled={remain < 0 || remain === 200}
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
