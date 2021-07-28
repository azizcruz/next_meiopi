import { AlertDialog, IconButton, Tooltip } from "@chakra-ui/react";
import React, { useState, useEffect } from "react";
import { BiAddToQueue } from "react-icons/bi";
import { BsCheckBox } from "react-icons/bs";

import { useMutation, useQuery, useQueryClient } from "react-query";
import * as api from "../../../api-services/api";
import { useStoreActions, useStoreState } from "easy-peasy";

export default function AddToFollowingsButton(props) {
  const { setFollowingQuestions } = useStoreActions((actions) => actions);
  const { followingQuestions } = useStoreState((state) => state);
  return (
    <>
      {followingQuestions.some(
        (item) => item.questionId === props.questionId
      ) ? (
        <IconButton
          mr={"10px"}
          ml={"10px"}
          fontSize={["xs", "sm", "md", "lg"]}
          minW={["25px", "40px"]}
          h={["25px", "40px"]}
          icon={<BsCheckBox />}
        />
      ) : (
        <IconButton
          mr={"10px"}
          ml={"10px"}
          fontSize={["xs", "sm", "md", "lg"]}
          minW={["25px", "40px"]}
          h={["25px", "40px"]}
          onClick={() =>
            setFollowingQuestions({
              questionId: props.questionId,
              content: props.content,
              slug: props.slug,
              prevList: followingQuestions,
            })
          }
          icon={<BiAddToQueue />}
        />
      )}
    </>
  );
}
