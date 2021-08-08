import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  IconButton,
  Text,
  Skeleton,
  SkeletonText,
  Stack,
  Center,
  useToast,
} from "@chakra-ui/react";
import { FaArrowLeft } from "react-icons/fa";
import QuestionDetailOpinion from "../QuestionDetailOpinion/QuestionDetailOpinion.js";
import QuestionDetailReply from "../QuestionDetailReply/QuestionDetailReply.js";
import { useStoreState, useStoreActions } from "easy-peasy";
import styles from "../../../styles/QuestionDetail.module.scss";
import OpinionForm from "../../Forms/OpinionForm/OpinionForm";
import Moment from "react-moment";
import {
  isAuthenticated,
  userData,
  getVisitorHashedIp,
} from "../../../auth-services/auth";
import Poll from "react-polls";

import Linkify from "linkifyjs/react";
import LinkifyOptions from "../../../utils/Linkify/LinkifyOptions";
import ProfileModal from "../../ProfileModal/ProfileModal";
import { useMutation, useQuery, useQueryClient } from "react-query";
import * as api from "../../../api-services/api";

export default function QuestionDetail(props) {
  const queryClient = useQueryClient();
  const [userVote, setUserVote] = useState("");
  const [pollOptions, setPollOptions] = useState([]);
  const toast = useToast();

  const { fetchFilteredPosts } = useStoreActions((actions) => actions);

  const {
    data: openedPost,
    isLoading,
    isError,
  } = useQuery(
    ["openedQuestion", props.id],
    () => api.getSingleQuestion({ postId: props.id, slug: props.slug }),
    {
      enabled: Boolean(props.id),
    }
  );

  const {
    isLoading: loadingVote,
    mutate: votePoll,
    isError: votingPollError,
    error,
  } = useMutation(api.votePoll, {
    onSuccess: (data) => {
      setPollOptions(data.options);
      checkIfUserVoted(data.votedUsers);
      toast({
        title: "Thanks for voring",
        status: "success",
        duration: 2000,
        isClosable: true,
      });
    },
  });

  useEffect(() => {
    if (openedPost && openedPost.hasPoll) {
      checkIfUserVoted(openedPost.poll.votedUsers);
      setPollOptions(openedPost.poll.options);
    }
  }, [openedPost]);

  useEffect(() => {
    let postDetailWrapper = document.querySelector(".post-detail-wrapper");

    if (postDetailWrapper) {
      postDetailWrapper.scrollIntoView(true);
    }

    // Refetch post when something has changed
    props.socket.on("questionChange", (data) => {
      queryClient.invalidateQueries(["openedQuestion", props.id]);
    });
    props.socket.on("commentChange", (data) => {
      queryClient.invalidateQueries(["openedQuestion", props.id]);
    });
    props.socket.on("replyChange", (data) => {
      queryClient.invalidateQueries(["openedQuestion", props.id]);
    });
  }, []);

  if (isLoading) {
    return (
      <Stack bg={!props.hash ? "#ff9f1c" : props.hash} p={5} minH={"73vh"}>
        <Skeleton height="10px" width={"25%"} />
        <br />
        <Skeleton height="20px" />
        <Skeleton height="20px" />
        <Skeleton height="20px" />
        <Skeleton height="20px" />
        <Skeleton height="20px" width={"35%"} />
        <br />
        <Skeleton height="10px" width={"15%"} />
        <br />
        <Stack p={5} pl={["0", "7"]}>
          <Skeleton height="10px" width={"25%"} />
          <br />
          <Skeleton height="20px" />
          <Skeleton height="20px" />
          <Skeleton height="20px" width={"35%"} />
          <br />
          <Stack p={5} pl={["0", "7"]}>
            <Skeleton height="10px" width={"25%"} />
            <br />
            <Skeleton height="20px" />
            <Skeleton height="20px" />
            <Skeleton height="20px" width={"35%"} />
          </Stack>
        </Stack>
      </Stack>
    );
  }

  if (isError) {
    return (
      <>
        {toast({
          title: "Something went wrong",
          status: "error",
          duration: 2000,
          isClosable: true,
        })}
        <Stack
          bg={props.location.hash === "" ? "#ff9f1c" : props.location.hash}
          p={5}
          minH={"73vh"}
        >
          <Skeleton height="10px" width={"25%"} />
          <br />
          <Skeleton height="20px" />
          <Skeleton height="20px" />
          <Skeleton height="20px" />
          <Skeleton height="20px" />
          <Skeleton height="20px" width={"35%"} />
          <br />
          <Skeleton height="10px" width={"15%"} />
          <br />
          <Stack p={5} pl={["0", "7"]}>
            <Skeleton height="10px" width={"25%"} />
            <br />
            <Skeleton height="20px" />
            <Skeleton height="20px" />
            <Skeleton height="20px" width={"35%"} />
            <br />
            <Stack p={5} pl={["0", "7"]}>
              <Skeleton height="10px" width={"25%"} />
              <br />
              <Skeleton height="20px" />
              <Skeleton height="20px" />
              <Skeleton height="20px" width={"35%"} />
            </Stack>
          </Stack>
        </Stack>
      </>
    );
  }

  const goToOpinion = (url) => {
    setTimeout(() => {
      let querySet = new URLSearchParams(url);
      let opinionId = querySet.get("opinion-id");
      let commentElement = document.getElementById(opinionId);
      commentElement.scrollIntoView({
        behavior: "smooth",
        block: "center",
        inline: "nearest",
      });

      setTimeout(() => {
        commentElement.classList.add("animate__animated", "animate__headShake");
      }, 500);
    }, 1000);
  };

  const submitVotePoll = async (options, votedOption, postId) => {
    let toVote = null;
    options.map((option) => {
      if (option.option === votedOption) {
        toVote = option._id;
      }
    });

    if (toVote) {
      let payload = {
        hashedIpOrUserId: isAuthenticated()
          ? userData().id
          : getVisitorHashedIp(),
        voteOptionId: toVote,
        postId,
      };

      votePoll(payload);
      setUserVote(votedOption);
    }
  };

  const checkIfUserVoted = (votedUsers) => {
    let userHasVoted = votedUsers.filter((user) => {
      if (isAuthenticated) {
        if (user.owner.includes(userData().id)) {
          return user;
        }
      } else {
        if (user.owner.includes(getVisitorHashedIp())) {
          return user;
        }
      }
    });

    if (userHasVoted.length > 0) {
      setUserVote(userHasVoted[0].option);
    } else {
      setUserVote("");
    }
  };

  return (
    <>
      <Button
        leftIcon={<FaArrowLeft />}
        onClick={() => {
          props.router.back();
        }}
        mb={2}
      >
        Back
      </Button>
      <Box
        bg={!props.hash ? "#ff9f1c" : props.hash}
        p={"4"}
        display={"flex"}
        flexDirection={"column"}
        color={"black"}
        className={styles["post-detail-wrapper"]}
        minH={"73vh"}
      >
        <Box
          display={"flex"}
          justifyContent={"space-between"}
          alignItems={"center"}
        >
          <Text fontSize={["md", "lg"]} fontWeight={"bold"}>
            @
            {openedPost && !openedPost.user ? (
              "Anonymous"
            ) : (
              <ProfileModal>
                {openedPost && openedPost.user.username}
              </ProfileModal>
            )}{" "}
          </Text>
          <Box fontSize={["xs", "xs", "md"]}>
            <Moment fromNow>{openedPost && openedPost.createdAt}</Moment>
          </Box>
        </Box>
        <Text mt={"5"} fontSize={["md", "lg"]}>
          <Linkify options={LinkifyOptions}>
            {openedPost && openedPost.content}
          </Linkify>
        </Text>
        <Box>
          <Box className={styles["poll-wrapper"]}>
            {openedPost && openedPost.hasPoll && (
              <Poll
                question={openedPost.poll && openedPost.poll.question}
                answers={pollOptions}
                onVote={(option) =>
                  submitVotePoll(
                    openedPost.poll.options,
                    option,
                    openedPost._id
                  )
                }
                noStorage={true}
                vote={userVote}
              />
            )}
          </Box>
        </Box>
        <Box mt={"5"} fontSize={["xs", "sm", "md", "lg"]}>
          {openedPost &&
            openedPost.tags.split("#").map((tag, key) => {
              if (key !== 0) {
                return (
                  <Box
                    key={key}
                    as={"span"}
                    cursor={"pointer"}
                    fontSize={["xs", "sm", "md", "lg"]}
                    mr={"8px"}
                    _hover={{ fontWeight: "bold" }}
                    onClick={() => {
                      fetchFilteredPosts(`#${tag}`);
                    }}
                  >
                    #{tag}
                  </Box>
                );
              }
            })}
        </Box>

        {openedPost && openedPost.comments.length > 10 && (
          <Box
            w={"100%"}
            display={"flex"}
            justifyContent={"center"}
            position={"relative"}
            top={4}
          >
            <OpinionForm
              buttonWidth={"100px"}
              postId={props.id}
              buttonWithBorder={true}
              fromPostDetail={true}
              onCommentAdd={(commentAddedId) => {
                if (openedPost.comments.length > 3) {
                  let addedComments =
                    document.querySelectorAll(".opinions-wrapper");

                  let lastComment = addedComments[addedComments.length - 1];

                  setTimeout(() => {
                    lastComment.scrollIntoView({
                      behavior: "smooth",
                      block: "center",
                      inline: "nearest",
                    });
                  }, 500);
                }
              }}
            />
          </Box>
        )}

        {openedPost && openedPost.comments.length > 0 && (
          <Box textAlign={"right"} fontSize={["xs", "sm", "md", "lg"]} mt={6}>
            {openedPost.comments.length}{" "}
            {openedPost.comments.length > 1 ? "opinions" : "opinion"}{" "}
          </Box>
        )}
        {openedPost && openedPost.comments.length > 0 ? (
          openedPost.comments.map((comment, key) => {
            return (
              <QuestionDetailOpinion
                {...comment}
                postId={props.id}
                socket={props.socket}
              />
            );
          })
        ) : (
          <>
            <Center mt={"4em"}>No Opinions yet 😁</Center>
            <OpinionForm
              buttonWidth={"100px"}
              buttonAlign={"center"}
              postId={props.id}
              buttonWithBorder={true}
              fromPostDetail={true}
            />
          </>
        )}
        {openedPost && openedPost.comments.length > 0 && (
          <Box w={"100%"} display={"flex"} justifyContent={"center"} mt={3}>
            <OpinionForm
              buttonWidth={"100px"}
              postId={props.id}
              buttonWithBorder={true}
              fromPostDetail={true}
              onCommentAdd={(commentAddedId) => {
                if (openedPost.comments.length > 3) {
                  let addedComments =
                    document.querySelectorAll(".opinions-wrapper");

                  let lastComment = addedComments[addedComments.length - 1];

                  setTimeout(() => {
                    lastComment.scrollIntoView({
                      behavior: "smooth",
                      block: "center",
                      inline: "nearest",
                    });
                  }, 500);
                }
              }}
            />
          </Box>
        )}
      </Box>
    </>
  );
}
