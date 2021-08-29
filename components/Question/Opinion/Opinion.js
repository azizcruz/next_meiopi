import React from "react";
import { IconButton } from "@chakra-ui/button";
import { Box, Flex } from "@chakra-ui/layout";
import {
  Image,
  useDisclosure,
  Text,
  Collapse,
  Input,
  useToast,
  Button,
} from "@chakra-ui/react";
import { AiFillCaretDown, AiFillCaretUp } from "react-icons/ai";
import ReplyForm from "./../../Forms/ReplyForm/ReplyForm";
import { useStoreState, useStoreActions } from "easy-peasy";
import Reply from "./../Reply/Reply";
import Moment from "react-moment";
import "animate.css";
import Linkify from "linkifyjs/react";
import LinkifyOptions from "../../../utils/Linkify/LinkifyOptions";
import ProfileModal from "../../ProfileModal/ProfileModal";
import EditOpinionForm from "../../Forms/EditOpinionForm/EditOpinionForm";
import { useQuery, useQueryClient, useMutation } from "react-query";
import * as api from "../../../api-services/api";
import {
  isAuthenticated,
  userData,
  getVisitorHashedIp,
} from "../../../auth-services/auth";
import { FaHandshake } from "react-icons/fa";

export default function Opinion(props) {
  const userHashedIp = useStoreState((state) => state.userHashedIp);
  const queryClient = useQueryClient();
  const { isOpen, onToggle } = useDisclosure();
  const { upVoteComment } = useStoreActions((actions) => actions);
  const toast = useToast();

  const {
    isLoading,
    mutate: submitAgreeWith,
    isError,
  } = useMutation(api.submitAgreeWith, {
    onMutate: (data) => {
      queryClient.setQueryData(["openedOpinions", props.postId], (old) => {
        let updatedData = old.map((opinion) => {
          if (data.commentId === opinion._id) {
            if (!opinion.upVoteUsers.includes(data.userIpOrId)) {
              opinion.upVoteUsers.push(data.userIpOrId);
              opinion.votes += 1;
            } else {
              opinion.upVoteUsers.splice(
                opinion.upVoteUsers.indexOf(data.userIpOrId),
                1
              );
              opinion.votes -= 1;
            }
          }

          return opinion;
        });

        return updatedData;
      });
    },
    onSuccess: (data) => {
      if (data.hasLiked) {
        toast({
          title: "You have agreed with an opinion 🤝",
          status: "success",
          duration: 2000,
          isClosable: true,
        });
      } else {
        toast({
          title: "Its OK to change your mind 😁",
          status: "success",
          duration: 2000,
          isClosable: true,
        });
      }
    },
  });

  if (isError) {
    toast({
      title: "Failed to agree with an opinion, try again later",
      status: "error",
      duration: 2000,
      isClosable: true,
    });
  }

  const agreeWith = async () => {
    try {
      if (getVisitorHashedIp || isAuthenticated()) {
        submitAgreeWith({
          commentId: props.commentId,
          userIpOrId: isAuthenticated() ? userData().id : userHashedIp,
        });
      }
    } catch (error) {
      toast({
        title: "Failed to agree with an opinion, contact support",
        status: "error",
        duration: 2000,
        isClosable: true,
      });
    }
  };

  return (
    <Box
      borderWidth={1}
      borderColor={"inherit"}
      p={2}
      mb={4}
      borderRadius={8}
      className={"opinions-wrapper"}
      id={`comment-${props.commentId}`}
      position={"relative"}
      borderRadius={"15px"}
    >
      <Flex alignItems={"center"}>
        <Box fontWeight={"bold"}>
          @
          {props.user ? (
            <ProfileModal>{props.user.username}</ProfileModal>
          ) : (
            "Anonymous"
          )}
          <Box fontSize={["xs", "sm"]} fontWeight={"normal"}>
            <Moment fromNow>{props.createdAt}</Moment>
          </Box>
        </Box>
        <Box display={"flex"} alignItems={"center"} ml={"auto"}>
          {props.user &&
            isAuthenticated() &&
            props.user._id === userData().id && (
              <EditOpinionForm
                currentContent={props.commentContent}
                commentId={props.commentId}
                postId={props.postId}
                socket={props.socket}
              />
            )}

          <Box
            display={"flex"}
            alignItems={"center"}
            cursor={"pointer"}
            onClick={agreeWith}
          >
            <Box as={"span"} mr={"1"} mt={"1"} fontWeight={"bold"}>
              {props.votes}
            </Box>
            {(isAuthenticated() && props.upVoteUsers.includes(userData().id)) ||
            props.upVoteUsers.includes(userHashedIp) ? (
              <Box borderRadius={"50%"} bg={"blackAlpha.300"} p={["2", "4"]}>
                <FaHandshake mb={"1"} color={"green"} fontSize={"x-large"} />
              </Box>
            ) : (
              <Box borderRadius={"50%"} bg={"blackAlpha.300"} p={["2", "4"]}>
                <FaHandshake fontSize={"x-large"} />
              </Box>
            )}
          </Box>
        </Box>
      </Flex>
      <Box mt={"2"}>
        <Linkify options={LinkifyOptions}>
          <Text fontSize={["md", "lg"]} mb={3}>
            {props.commentContent}
          </Text>
        </Linkify>
      </Box>
      <Box display={"flex"} mt={"1"} onClick={onToggle} cursor={"pointer"}>
        {props.commentReplies.length > 0 && (
          <Text
            width={"100%"}
            textAlign={"right"}
            _active={{ backgroundColor: "transparent" }}
          >
            {props.commentReplies.length}
            {props.commentReplies.length > 1 ? " Replies" : " Reply"}
          </Text>
        )}
        {props.commentReplies.length > 0 && !isOpen && (
          <Box mt={"3px"}>
            <AiFillCaretDown />
          </Box>
        )}
        {props.commentReplies.length > 0 && isOpen && (
          <Box mt={"3px"}>
            <AiFillCaretUp />
          </Box>
        )}
      </Box>
      <Collapse in={isOpen} animateOpacity>
        <Box
          mt={1}
          pt={2}
          display={"flex"}
          flexDirection={"column"}
          id={`reply-${props.commentId}`}
          className={"reply-wrapper"}
        >
          {props.commentReplies.length > 0
            ? props.commentReplies.map((reply, key) => {
                return (
                  <Reply
                    key={key}
                    {...reply}
                    socket={props.socket}
                    onClick={() => onToggle()}
                  />
                );
              })
            : ""}
        </Box>
      </Collapse>
      <ReplyForm
        commentId={props.commentId}
        onReplyAdd={() => {
          if (isOpen === false) {
            onToggle();
            let replies = document
              .getElementById(`reply-${props.commentId}`)
              .querySelectorAll("div");
            let lastReply = replies[replies.length - 1];

            if (replies.length > 0) {
              setTimeout(() => {
                lastReply.scrollIntoView({
                  behavior: "smooth",
                  block: "center",
                  inline: "nearest",
                });
              }, 500);
            }
          } else {
            let replies = document
              .getElementById(`reply-${props.commentId}`)
              .querySelectorAll("div");
            let lastReply = replies[replies.length - 1];

            if (replies.length > 0) {
              lastReply.scrollIntoView({
                behavior: "smooth",
                block: "center",
                inline: "nearest",
              });
            }
          }
        }}
      />
    </Box>
  );
}
