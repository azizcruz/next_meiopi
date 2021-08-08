import { IconButton } from "@chakra-ui/button";
import { Box, Flex } from "@chakra-ui/layout";
import { Text, Tooltip, useToast } from "@chakra-ui/react";
import { BsArrowsAngleExpand } from "react-icons/bs";
import React, { useState, useRef, useEffect } from "react";
import "./../../../styles/QuestionFormsStyles.module.scss";
import EditQuestionCard from "./../../Forms/EditQuestionCard/EditQuestionCard";
import Link from "next/link";
import { useStoreActions } from "easy-peasy";
import "animate.css";
import { useMutation, useQueryClient } from "react-query";
import Moment from "react-moment";
import Linkify from "linkifyjs/react";
import LinkifyOptions from "./../../../utils/Linkify/LinkifyOptions";
import Poll from "react-polls";
import ProfileModal from "../../ProfileModal/ProfileModal";
import OpenedCommentsButton from "../OpenedOpinionsButton/OpenedOpinionsButton";
import AddToFollowingsButton from "../AddToFollowingButton/AddToFollowingButton";
import styles from "../../../styles/Home.module.scss";
import * as api from "../../../api-services/api";
import {
  isAuthenticated,
  userData,
  getVisitorHashedIp,
} from "../../../auth-services/auth";

function QuestionCard(props) {
  const [backgroundColor, setBackgroundColor] = useState("");
  const [reRenderComponent, setRerenderComponent] = useState(0);
  const [options, setOptions] = useState([]);
  const [userVote, setUserVote] = useState(null);
  const [userHasVoted, setUserHasVoted] = useState(false);

  const toast = useToast();

  const { fetchFilteredPosts } = useStoreActions((actions) => actions);

  const {
    isLoading: loadingVote,
    mutate: votePoll,
    isError: isVotingPollError,
    error: addingVoteError,
  } = useMutation(api.votePoll, {
    onMutate: (updateData) => {
      let currOptions = props.poll.options;
      currOptions.map((option) => {
        if (option._id === updateData.voteOptionId) {
          option.votes += 1;
        }
      });
      setOptions(currOptions);
      setUserVote({
        owner: updateData.hashedIpOrUserId,
        _id: updateData.voteOptionId,
        option: updateData.option,
      });
      setUserHasVoted(true);
    },
    onSuccess: (data) => {
      toast({
        title: "Thanks for voting 😘",
        status: "success",
        duration: 2000,
        isClosable: true,
      });
    },
    onError(error) {
      if (error.request && error.request.status === 403) {
        toast({
          title: "You have already voted before 🙂",
          status: "success",
          duration: 2000,
          isClosable: true,
        });
      } else {
        toast({
          title: "Something went wrong, try again later",
          status: "error",
          duration: 2000,
          isClosable: true,
        });
      }
    },
  });

  function componentToHex(c) {
    var hex = c.toString(16);
    return hex.length == 1 ? "0" + hex : hex;
  }
  function rgbToHex(r, g, b) {
    return "#" + componentToHex(r) + componentToHex(g) + componentToHex(b);
  }

  const detectQuestionCardBG = () => {
    const bgColor = window
      .getComputedStyle(document.getElementById(props.postId), null)
      .getPropertyValue("background-color")
      .replace("(", "")
      .replace(")", "")
      .replace("rgb", "")
      .split(",");

    const r = parseInt(bgColor[0].trim());
    const g = parseInt(bgColor[1].trim());
    const b = parseInt(bgColor[2].trim());

    setBackgroundColor(rgbToHex(r, g, b));
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
        option: votedOption,
        postId,
      };

      votePoll(payload);
    }
  };

  const checkIfUserVoted = (votedUsers) => {
    let userHasVoted = votedUsers.filter((user) => {
      if (isAuthenticated()) {
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
      return userHasVoted[0].option;
    } else {
      return "";
    }
  };

  return (
    <>
      <Box
        className={styles.opinion}
        id={props.postId}
        onTouchStartCapture={(e) => {
          detectQuestionCardBG();
        }}
        onMouseOverCapture={(e) => {
          detectQuestionCardBG();
        }}
      >
        <Box
          display={"flex"}
          justifyContent={"space-between"}
          alignItems={"center"}
        >
          <Text
            as={"p"}
            pt={"1"}
            textAlign={"left"}
            fontSize={["xs", "sm", "md", "lg"]}
            fontWeight={"bold"}
          >
            @
            {props.user ? (
              <ProfileModal userId={props.user._id}>
                {props.user.username}
              </ProfileModal>
            ) : (
              "Anonymous"
            )}{" "}
            <Box fontWeight={"normal"} fontSize={["xs", "sm", "md", "lg"]}>
              <Moment fromNow>{props.createdAt}</Moment>
            </Box>
          </Text>

          <Box>
            <EditQuestionCard
              content={props.content}
              tags={props.tags}
              postId={props.postId}
              hasPoll={props.hasPoll}
              poll={props.poll}
            />
            <AddToFollowingsButton
              questionId={props.postId}
              slug={props.slug}
              content={props.content}
            />

            <Link
              href={`/questions/${props.postId}/${props.slug}?bgColor=${backgroundColor}`}
            >
              <a>
                <IconButton
                  fontSize={["xs", "sm", "md", "lg"]}
                  minW={["25px", "40px"]}
                  h={["25px", "40px"]}
                  icon={<BsArrowsAngleExpand />}
                />
              </a>
            </Link>
          </Box>
        </Box>

        <Text
          mt={"5"}
          fontSize={["lg", "x-large"]}
          className={styles["question-content"]}
        >
          <Linkify options={LinkifyOptions}>{props.content}</Linkify>
        </Text>

        <Box className={styles["poll-wrapper"]}>
          {props.hasPoll && !userHasVoted ? (
            <Poll
              question={props.poll && props.poll.question}
              answers={props.poll && props.poll.options}
              onVote={(option) =>
                submitVotePoll(props.poll.options, option, props.postId)
              }
              noStorage={true}
              vote={checkIfUserVoted(props.poll.votedUsers)}
            />
          ) : (
            <Poll
              question={props.poll && props.poll.question}
              answers={options}
              onVote={(option) =>
                submitVotePoll(props.poll.options, option, props.postId)
              }
              noStorage={true}
              vote={userVote}
            />
          )}
        </Box>

        <Flex justifyContent={"space-between"} alignItems={"flex-end"}>
          <Box>
            {props.tags.split("#").map((tag, key) => {
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
          <OpenedCommentsButton
            commentsLength={props.commentsLength}
            postId={props.postId}
            socket={props.socket}
          />
        </Flex>
      </Box>
    </>
  );
}

export default QuestionCard;
