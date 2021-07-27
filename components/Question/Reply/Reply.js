import React from "react";
import { Box, Flex, Image, Text } from "@chakra-ui/react";
import Moment from "react-moment";
import Linkify from "linkifyjs/react";
import LinkifyOptions from "./../../../utils/Linkify/LinkifyOptions";
import ProfileModal from "../../ProfileModal/ProfileModal";
import EditReplyForm from "./../../Forms/ReplyForm/ReplyForm";
import { useAuthUser } from "react-auth-kit";

export default function Reply(props) {
  const user = useAuthUser();
  return (
    <Box mb={4} borderWidth={1} p={2} borderRadius={15} position={"relative"}>
      <Flex justifyContent={"space-between"}>
        <Box fontWeight={"bold"}>
          @
          {props.user ? (
            <ProfileModal>{props.user.username}</ProfileModal>
          ) : (
            "Anonymous"
          )}
        </Box>
        <Box fontSize={["xs", "sm"]} fontWeight={"normal"}>
          <Moment fromNow>{props.createdAt}</Moment>
        </Box>
      </Flex>

      <Box mt={"1"} ml={"2"}>
        <Linkify options={LinkifyOptions}>
          <Text fontSize={["md", "lg"]}>{props.content}</Text>
        </Linkify>
      </Box>

      {props.user && user() && props.user._id === user().userId && (
        <EditReplyForm
          currentContent={props.content}
          replyId={props._id}
          postId={props.postId}
          socket={props.socket}
        />
      )}
    </Box>
  );
}
