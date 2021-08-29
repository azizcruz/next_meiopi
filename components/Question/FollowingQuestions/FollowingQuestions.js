import React from "react";
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
import { useStoreState } from "easy-peasy";

export default function FollowingQuestions() {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const followingQuestions = useStoreState((state) => state.followingQuestions);

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
            {followingQuestions.map((item) => {
              return (
                <Flex
                  bg={"blackAlpha.400"}
                  p={3}
                  mb={3}
                  borderRadius={"15px"}
                  justifyContent={"space-between"}
                >
                  <Box>{item.content}</Box>
                  <Flex justifyContent={"space-around"} flexBasis={"100px"}>
                    <Box>X</Box>
                    <Box>Go to</Box>
                  </Flex>
                </Flex>
              );
            })}
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </>
  );
}
