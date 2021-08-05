import { IconButton } from "@chakra-ui/button";
import { Box, Flex } from "@chakra-ui/layout";
import { Text, Tooltip, useToast } from "@chakra-ui/react";
import { BsArrowsAngleExpand } from "react-icons/bs";
import React, { useState, useRef, useEffect } from "react";
import "./../../../styles/QuestionFormsStyles.module.scss";
import EditQuestionCard from "./../../Forms/EditQuestionCard/EditQuestionCard";
import Link from "next/link";
import { useStoreState, useStoreActions } from "easy-peasy";
import "animate.css";
import Moment from "react-moment";
import Linkify from "linkifyjs/react";
import LinkifyOptions from "./../../../utils/Linkify/LinkifyOptions";
import Poll from "react-polls";
import ProfileModal from "../../ProfileModal/ProfileModal";
import OpenedCommentsButton from "../OpenedOpinionsButton/OpenedOpinionsButton";
import AddToFollowingsButton from "../AddToFollowingButton/AddToFollowingButton";
import styles from "../../../styles/Home.module.scss";
import {
  isAuthenticated,
  userData,
  getVisitorHashedIp,
} from "../../../auth-services/auth";

function QuestionCard(props) {
  const [backgroundColor, setBackgroundColor] = useState("");

  const toast = useToast();

  const { fetchFilteredPosts, votePoll } = useStoreActions(
    (actions) => actions
  );

  const { loadingPoll } = useStoreState((state) => state);

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
        option.votes += 1;
      }
    });

    if (toVote) {
      try {
        // Detect vote performer
        let votePerformer = userIsLoggedIn()
          ? userIsLoggedIn()._id
          : localStorage.getItem("visitorHashedIp");

        console.log(votePerformer);
        let data = await votePoll({
          hashedIpOrUserId: votePerformer,
          voteOptionId: toVote,
          postId: props.postId,
        });
        toast({
          title: "Thanks for voting 😘",
          status: "success",
          duration: 2000,
          isClosable: true,
        });
      } catch (error) {
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
      }
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
      return userHasVoted[0].option;
    } else {
      return false;
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
          className={"question-content"}
        >
          <Linkify options={LinkifyOptions}>{props.content}</Linkify>
        </Text>

        <Box className={"poll-wrapper"}>
          {props.hasPoll && loadingPoll === false && (
            <Poll
              question={props.poll && props.poll.question}
              answers={props.poll && props.poll.options}
              onVote={(option) =>
                submitVotePoll(props.poll.options, option, props.postId)
              }
              noStorage={true}
              vote={checkIfUserVoted(props.poll ? props.poll.votedUsers : [])}
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
