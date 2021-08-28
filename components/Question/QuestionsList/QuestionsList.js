import React, { useEffect } from "react";
import { Box, Center, Spinner, useToast } from "@chakra-ui/react";
import Head from "next/head";
import Axios from "axios";
import { useMutation, useQuery, useQueryClient } from "react-query";
import * as api from "../../../api-services/api";
import QuestionCard from "../QuestionCard/QuestionCard";

import styles from "../../../styles/Home.module.scss";
import QuestionsListLoading from "../../LoadingSekeletons/QuestionsListLoading";

function QuestionsList(props) {
  const queryClient = useQueryClient();

  useEffect(async () => {
    // Refetch posts when new post is added
    props.socket.on("updateListQuestions", (data) => {
      queryClient.invalidateQueries("questions");
    });
    props.socket.on("newQuestion", (data) => {
      queryClient.invalidateQueries("questions");
    });
  }, []);

  const { data, isLoading, isError, isSuccess, isFetching } = useQuery(
    "questions",
    () => api.getQuestions({ page: 2, limit: 30 }),
    {
      refetchOnWindowFocus: false,
    }
  );

  if (isLoading) {
    return <QuestionsListLoading />;
  }

  if (isError) {
    toast({
      title: "Something went wrong",
      status: "error",
      duration: 2000,
      isClosable: true,
    });
  }

  return (
    <>
      <Box className={styles.opinions}>
        {/* <TransitionGroup component={testTrans}> */}
        {data &&
          data.docs.map((post, key) => {
            return (
              // <CSSTransition key={post._id} timeout={1000} classNames="item">
              <QuestionCard
                // followingQuestions={followingQuestions}
                key={post._id}
                content={post.content}
                slug={post.slug}
                postId={post._id}
                tags={post.tags}
                key={post._id}
                commentsLength={post.comments.length}
                createdAt={post.createdAt}
                hasPoll={post.hasPoll}
                poll={post.hasPoll ? post.poll : false}
                user={post.user}
                socket={props.socket}
              />
              // </CSSTransition>
            );
          })}
        {/* </TransitionGroup> */}
      </Box>
    </>
  );
}

export default QuestionsList;
