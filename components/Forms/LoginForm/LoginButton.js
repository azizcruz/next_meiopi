import React from "react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
  useDisclosure,
  Box,
  Flex,
  Text,
} from "@chakra-ui/react";
import { FiLogIn } from "react-icons/fi";
import LoginForm from "./LoginForm";
import Nav from "../../BottomNavbar/Nav";

export default function CreateAccountButton(props) {
  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <>
      <Flex
        onClick={onOpen}
        justifyContent={"center"}
        alignItems={"center"}
        fontSize={["md", "xl"]}
        backgroundColor={"blackAlpha.300"}
        p={2}
        cursor={"pointer"}
      >
        <Text mr={2}>Log in</Text>
        <Box>
          <FiLogIn fontSize={["28px"]} display={"inline"} />
        </Box>
      </Flex>
      <Box>
        <Modal onClose={onClose} isOpen={isOpen} isCentered>
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>Login</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <LoginForm
                onSignIn={() => {
                  props.onLogin();
                  onClose();
                }}
              />
            </ModalBody>
            <ModalFooter></ModalFooter>
          </ModalContent>
        </Modal>
      </Box>
    </>
  );
}
