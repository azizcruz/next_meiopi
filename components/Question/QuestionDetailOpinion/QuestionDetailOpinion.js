import React from "react";
import { useParams } from "react-router-dom";
import {
  Box,
  Button,
  IconButton,
  Text,
  Collapse,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";

import { FaRegHandshake, FaHandshake } from "react-icons/fa";
import { AiFillCaretDown, AiFillCaretUp } from "react-icons/ai";
import QuestionDetailReply from "../QuestionDetailReply/QuestionDetailReply";
import ReplyForm from "../../Forms/ReplyForm/ReplyForm";
import {
  isAuthenticated,
  userData,
  getVisitorHashedIp,
} from "../../../auth-services/auth";
import { useStoreState, useStoreActions } from "easy-peasy";

import "animate.css";
import Linkify from "linkifyjs/react";
import LinkifyOptions from "../../../utils/Linkify/LinkifyOptions";
import Moment from "react-moment";
import ProfileModal from "../../ProfileModal/ProfileModal";
import EditOpinionForm from "../../Forms/EditOpinionForm/EditOpinionForm";
import { useQuery, useQueryClient, useMutation } from "react-query";
import * as api from "../../../api-services/api";

export default function PostDetailOpinion(props) {
  const { isOpen, onToggle } = useDisclosure();
  const queryClient = useQueryClient();
  const toast = useToast();
  const userHashedIp = useStoreState((state) => state.userHashedIp);

  const {
    isLoading,
    mutate: submitAgreeWith,
    isError,
  } = useMutation(api.submitAgreeWith, {
    onMutate: (data) => {
      queryClient.setQueryData(["openedQuestion", props.postId], (old) => {
        let updatedOpinions = old.comments.map((opinion) => {
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
        old.comments = updatedOpinions;
        return old;
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
      if (userHashedIp || isAuthenticated()) {
        submitAgreeWith({
          commentId: props._id,
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
      mb={2}
      id={props._id}
      className={"opinions-wrapper"}
      position={"relative"}
      borderRadius={"15px"}
    >
      <Box
        backgroundColor={"blackAlpha.200"}
        p={2}
        display={"flex"}
        flexDirection={"column"}
        borderRadius={"15px"}
        ml={["0", "4"]}
      >
        <Box
          display={"flex"}
          justifyContent={"space-between"}
          alignItems={"center"}
          mb={"2"}
        >
          <Text fontSize={["xs", "sm", "md", "lg"]} fontWeight={"bold"}>
            @
            {props.user ? (
              <ProfileModal>{props.user.username}</ProfileModal>
            ) : (
              "Anonymous"
            )}{" "}
            <Box fontSize={["xs", "sm"]} fontWeight={"normal"}>
              <Moment fromNow>{props.createdAt}</Moment>
            </Box>
          </Text>
          <Box
            display={"flex"}
            alignItems={"center"}
            cursor={"pointer"}
            fontSize={["1.5rem", "1.2rem", "1.8rem"]}
          >
            <Box
              display={"flex"}
              alignItems={"center"}
              cursor={"pointer"}
              onClick={agreeWith}
            >
              <Box as={"span"} mr={"1"} mt={"1"} fontSize={["1rem", "1.2rem"]}>
                {props.votes}
              </Box>

              {(isAuthenticated() &&
                props.upVoteUsers.includes(userData().id)) ||
              props.upVoteUsers.includes(userHashedIp) ? (
                <Box borderRadius={"50%"} bg={"blackAlpha.300"} p={["2", "4"]}>
                  <FaHandshake mb={"1"} fontSize={"x-large"} />
                </Box>
              ) : (
                <Box borderRadius={"50%"} bg={"blackAlpha.300"} p={["2", "4"]}>
                  <FaRegHandshake fontSize={"x-large"} />
                </Box>
              )}
            </Box>
          </Box>
        </Box>

        <Text fontSize={["md", "lg"]}>
          <Linkify options={LinkifyOptions}>{props.content}</Linkify>
        </Text>
        <Box
          display={"flex"}
          mt={"1"}
          onClick={onToggle}
          cursor={"pointer"}
          justifyContent={"flex-end"}
        >
          {props.replies.length > 0 && (
            <>
              {" "}
              <Text fontSize={["xs", "sm", "md", "lg"]} cursor={"pointer"}>
                {props.replies.length}{" "}
                {props.replies.length > 1 ? "replies" : "reply"}
              </Text>
            </>
          )}
          {props.replies.length > 0 && !isOpen && (
            <Box mt={"4px"}>
              <AiFillCaretDown />
            </Box>
          )}
          {props.replies.length > 0 && isOpen && (
            <Box mt={"4px"}>
              <AiFillCaretUp />
            </Box>
          )}
        </Box>
        {props.replies.length > 0 ? (
          <Collapse in={isOpen} animateOpacity>
            <Box
              mt={1}
              pt={2}
              display={"flex"}
              flexDirection={"column"}
              id={`reply-${props._id}`}
            >
              {props.replies.map((reply, key) => {
                return (
                  <QuestionDetailReply
                    {...reply}
                    postId={props.postId}
                    socket={props.socket}
                  />
                );
              })}
            </Box>{" "}
          </Collapse>
        ) : (
          ""
        )}

        <Box w={"100%"} display={"flex"} justifyContent={"center"} mt={3}>
          <ReplyForm
            buttonWidth={"100px"}
            commentId={[props._id]}
            buttonWithBorder={true}
            fromPostDetail={true}
            onReplyAdd={() => {
              if (isOpen === false) {
                onToggle();
                let replies = document
                  .getElementById(`${props._id}`)
                  .querySelectorAll("div");
                let lastReply = replies[replies.length - 1];

                setTimeout(() => {
                  lastReply.scrollIntoView({
                    behavior: "smooth",
                    block: "center",
                    inline: "nearest",
                  });
                }, 500);
              } else {
                let replies = document
                  .getElementById(`${props._id}`)
                  .querySelectorAll("div");
                let lastReply = replies[replies.length - 1];

                lastReply.scrollIntoView({
                  behavior: "smooth",
                  block: "center",
                  inline: "nearest",
                });
              }
            }}
          />
        </Box>
        {props.user &&
          isAuthenticated() &&
          props.user._id === userData().id && (
            <EditOpinionForm
              currentContent={props.content}
              commentId={props._id}
              postId={props.postId}
              socket={props.socket}
            />
          )}
      </Box>
    </Box>
  );
}
