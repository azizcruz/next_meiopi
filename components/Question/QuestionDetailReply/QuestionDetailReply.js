import React from "react";
import { Box, Button, IconButton, Text } from "@chakra-ui/react";
import Linkify from "linkifyjs/react";
import LinkifyOptions from "../../../utils/Linkify/LinkifyOptions";
import Moment from "react-moment";
import ProfileModal from "../../ProfileModal/ProfileModal";
import EditReplyForm from "../../Forms/EditReplyForm/EditReplyForm";
import { isAuthenticated, userData } from "../../../auth-services/auth";

export default function QuestionDetailReply(props) {
  return (
    <Box className={"reply-wrapper"} position={"relative"}>
      <Box
        backgroundColor={"blackAlpha.200"}
        p={2}
        display={"flex"}
        ml={"4"}
        flexDirection={"column"}
        mb={2}
        borderRadius={"15px"}
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
            )}
          </Text>
          <Box fontSize={["xs", "xs", "md"]} fontWeight={"normal"}>
            <Moment fromNow>{props.createdAt}</Moment>
          </Box>
        </Box>
        <Text fontSize={["md", "lg"]}>
          <Linkify options={LinkifyOptions}>{props.content}</Linkify>
        </Text>

        {props.user &&
          isAuthenticated() &&
          props.user._id === userData().id && (
            <EditReplyForm
              currentContent={props.content}
              replyId={props._id}
              postId={props.postId}
              socket={props.socket}
            />
          )}
      </Box>
    </Box>
  );
}
