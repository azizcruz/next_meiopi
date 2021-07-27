import React, { useEffect, useState } from "react";
import { useStoreActions, useStoreState } from "easy-peasy";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Text,
  useDisclosure,
  Button,
  Skeleton,
  Flex,
  Box,
  Tooltip,
  useToast,
} from "@chakra-ui/react";
import { AiFillQuestionCircle, FaHandshake } from "react-icons/all";
import { useMutation, useQuery, useQueryClient } from "react-query";
import * as api from "../../api-services/api";

function ProfileModal(props) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const {
    data: fetchedUser,
    isLoading,
    isError,
    isSuccess,
    isFetching,
  } = useQuery(
    "lastVisitedProfile",
    () => api.fetchUser({ userId: props.userId }),
    {
      refetchOnWindowFocus: false,
      enabled: isOpen,
    }
  );
  const history = useHistory();
  const toast = useToast();

  if (isError) {
    toast({
      title: "Failed to get user, try again later",
      status: "error",
      duration: 2000,
      isClosable: true,
    });
  }
  return (
    <>
      <Text display={"inline-block"} cursor={"pointer"} onClick={onOpen}>
        {props.children}
      </Text>

      <Modal
        isOpen={isOpen}
        onClose={onClose}
        scrollBehavior={"inside"}
        size={"xl"}
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>
            <Box textAlign={"left"} fontSize={["xs", "sm", "md", "lg"]}>
              @{fetchedUser && fetchedUser.username}
            </Box>

            <Flex mt={2.5}>
              <Box
                mr={3}
                textAlign={"center"}
                fontSize={["xs", "sm", "md", "lg"]}
                backgroundColor={"blackAlpha.400"}
                borderRadius={"12"}
                p={2}
              >
                {fetchedUser && fetchedUser.opinions} Opinions
              </Box>
              <Box
                textAlign={"center"}
                fontSize={["xs", "sm", "md", "lg"]}
                flexDir={"row"}
                display={"flex"}
                alignItems={"center"}
                backgroundColor={"blackAlpha.400"}
                borderRadius={"12"}
                p={2}
                className={"show-help-message"}
              >
                <Box>
                  {Math.ceil(fetchedUser && fetchedUser.agreeRate)}% Agree rate{" "}
                </Box>

                <Box ml={"1"}>
                  <AiFillQuestionCircle cursor={"pointer"} />
                  <Box
                    as={"span"}
                    position={"absolute"}
                    w={"150px"}
                    bg={"blackAlpha.300"}
                    textAlign={"center"}
                    borderRadius={"12px"}
                    fontSize={["xs", "sm"]}
                    p={"2"}
                    opacity={"0"}
                  >
                    At least 3 people agree with this user opinions
                  </Box>
                </Box>
              </Box>
            </Flex>

            <Box
              as={"p"}
              textAlign={"left"}
              mt={3}
              fontSize={["xs", "sm", "md"]}
            >
              Bio
            </Box>

            <Box
              as={"p"}
              textAlign={"center"}
              fontSize={["xs", "sm", "md"]}
              maxW={"240px"}
              mr={"auto"}
              ml={"auto"}
              bg={"whiteAlpha.100"}
              p={3}
              borderRadius={5}
            >
              I like going to places where good things happen
            </Box>
            <Box
              textAlign={"left"}
              mt={2}
              fontSize={["xs", "sm", "md"]}
              position={"relative"}
              top={2}
            >
              Opinions
            </Box>
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Flex flexDirection={"row"} flexWrap={"wrap"}>
              <Flex flexDir={"column"} width={"100%"} mt={2} mb={2}>
                {fetchedUser &&
                fetchedUser.comments &&
                fetchedUser.comments.length > 0
                  ? fetchedUser.comments.map((comment, key) => {
                      return (
                        <Flex
                          alignItems={"center"}
                          borderRadius={5}
                          p={3}
                          mt={2}
                          mb={2}
                          bg={"whiteAlpha.100"}
                          cursor={"pointer"}
                          onClick={() => {
                            if (comment.post) {
                              history.push(
                                `/post/${comment.post._id}/${comment.post.slug}/?from=user-opinions&opinion-id=${comment._id}`
                              );
                            }
                          }}
                        >
                          <Box
                            flexBasis={"90%"}
                            fontSize={["xs", "sm", "md", "lg"]}
                          >
                            {comment.content}
                          </Box>
                          <Box
                            ml={2}
                            display={"flex"}
                            flexDir={"row"}
                            alignItems={"center"}
                            fontSize={["xs", "sm", "md", "lg"]}
                          >
                            <Box mr={2}>{comment.votes}</Box>
                            <Box>
                              <FaHandshake />
                            </Box>
                          </Box>
                        </Flex>
                      );
                    })
                  : ""}
              </Flex>
            </Flex>
          </ModalBody>
          <ModalFooter></ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}

export default ProfileModal;
