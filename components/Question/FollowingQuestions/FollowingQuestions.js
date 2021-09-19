import React, { useState } from "react";
import {
  Drawer,
  DrawerBody,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  useDisclosure,
  Box,
  Flex,
} from "@chakra-ui/react";
import { BiAddToQueue } from "react-icons/bi";
import Nav from "../../BottomNavbar/Nav";
import { useStoreActions, useStoreState } from "easy-peasy";
import { IoMdClose } from "react-icons/io";
import router from 'next/router';

export default function FollowingQuestions() {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [count, setCount] = useState(0);
  const followingQuestions = useStoreState((state) => state.followingQuestions, (prev, next) => {
    console.log(prev, next)
    if(prev.length !== next.length) {
      return false
    } else {
      return true
    }
  });
  const removeFollowingQuestion = useStoreActions(actions => actions.removeFollowingQuestion)


  return (
    <>
      <Nav
        title={"Following"}
        icon={<BiAddToQueue size={[30]} color={"#ff9f1c"} display={"inline"} />}
        onClick={onOpen}
      ></Nav>
      <Drawer placement={"bottom"} onClose={onClose} isOpen={isOpen}>
        <DrawerOverlay />
        <DrawerContent>
          <DrawerHeader>
            Following Questions
            <Box as="div" color={"whiteAlpha.300"} fontSize={["xs", "sm"]}>
              This list will be deleted once you close the app, register to keep
              it saved
            </Box>
          </DrawerHeader>
          <DrawerBody maxH={"350px"} overflowY={"scroll"}>
            {followingQuestions.length > 0 ? followingQuestions.map((item) => {
              return (
                <Flex
                  bg={"blackAlpha.400"}
                  p={3}
                  mb={3}
                  borderRadius={"15px"}
                  justifyContent={"space-between"}
                >
                  <Box>{item.content}</Box>
                  <Flex justifyContent={"space-around"} alignItems={'center'} flexBasis={"100px"}>
                    <Box cursor={'pointer'} onClick={() => {
                      removeFollowingQuestion(item.questionId)
                      setCount(count + 1)
                    }}><IoMdClose /></Box>
                    <Box onClick={() => {
                      router.push(`/questions/${item.questionId}/${item.slug}?bgColor=#ff9f1c`)
                      onClose()
                    }} cursor={'pointer'}>Go to</Box>
                  </Flex>
                </Flex>
              );
            }) : <Box textAlign={'center'}>No questions saved</Box>}
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </>
  );
}
