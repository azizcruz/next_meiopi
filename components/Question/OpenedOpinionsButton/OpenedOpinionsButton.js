import { Button, useDisclosure, usePrevious } from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import { IoIosChatboxes } from "react-icons/all";
import OpenedCommentsModal from "../OpenedOpinionsModal/OpenedOpinionsModal";
import abbrNum from "../../../utils/abbrNum";
import "animate.css";

export default function OpenedOpinionsButton(props) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [fireAnimation, setFireAnimation] = useState("");
  const prevAmount = usePrevious(props.commentsLength);
  const btnRef = React.useRef();
  const [scrollBehavior, setScrollBehavior] = React.useState("inside");

  useEffect(() => {
    if (props.commentsLength > prevAmount && prevAmount !== undefined) {
      setFireAnimation("animate__animated animate__heartBeat");
      setTimeout(() => {
        setFireAnimation("");
      }, 900);
    }
  }, [props.commentsLength]);

  /**
   * props
   *
   * postId
   * commentsLength
   *
   */

  return (
    <>
      <Button
        rightIcon={<IoIosChatboxes />}
        ref={btnRef}
        onClick={async () => {
          onOpen();
        }}
        cursor={"pointer"}
        variant={"outline"}
        colorScheme={"black"}
        fontSize={["sm", "md", "lg"]}
        width={["50px", "60px"]}
        height={["40px", "45px"]}
      >
        <span className={fireAnimation}>
          {abbrNum(props.commentsLength, 1)}
        </span>
      </Button>

      <OpenedCommentsModal
        isOpen={isOpen}
        onClose={onClose}
        btnRef={btnRef}
        scrollBehavior={scrollBehavior}
        postId={props.postId}
        socket={props.socket}
      />
    </>
  );
}
