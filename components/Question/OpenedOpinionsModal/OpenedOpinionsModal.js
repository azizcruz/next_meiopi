import {
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Skeleton,
  Stack,
  Text,
} from "@chakra-ui/react";
import React, { useEffect } from "react";
import Opinion from "../../Question/Opinion/Opinion";
import OpinionForm from "../../Forms/OpinionForm/OpinionForm";
import { useMutation, useQuery, useQueryClient } from "react-query";
import * as api from "../../../api-services/api";

export default function OpenedOpinionsModal(props) {
  const queryClient = useQueryClient();

  useEffect(async () => {
    // Refetch comments when new comment is added
    props.socket.on("commentChange", (data) => {
      queryClient.invalidateQueries(["openedOpinions", props.postId]);
    });
  }, []);

  const { data, isLoading, isError, isSuccess, isFetching } = useQuery(
    ["openedOpinions", props.postId],
    () => api.fetchOpinions({ postId: props.postId }),
    {
      enabled: props.isOpen,
    }
  );

  return (
    <>
      <Modal
        onClose={props.onClose}
        finalFocusRef={props.btnRef}
        isOpen={props.isOpen}
        scrollBehavior={props.scrollBehavior}
        size={"xl"}
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Opinions</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            {isLoading ? (
              <>
                <Stack minH={"73vh"} opacity={1}>
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
            ) : (
              <>
                {data?.length > 0 ? (
                  data.map((comment, key) => {
                    return (
                      <Opinion
                        key={key}
                        commentContent={comment.content}
                        commentReplies={comment.replies}
                        commentId={comment._id}
                        upVoteUsers={comment.upVoteUsers}
                        votes={comment.votes}
                        user={comment.user}
                        createdAt={comment.createdAt}
                        updatedAt={comment.updatedAt}
                        socket={props.socket}
                        postId={props.postId}
                      />
                    );
                  })
                ) : (
                  <Text textAlign={"center"} fontSize={["sm", "md", "lg"]}>
                    No opinions yet 😷
                  </Text>
                )}
              </>
            )}
          </ModalBody>
          <ModalFooter>
            <OpinionForm
              backgroundColor={"white"}
              color={"black"}
              postId={props.postId}
              onCommentAdd={(commentAddedId) => {
                if (data.length > 3) {
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
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}
