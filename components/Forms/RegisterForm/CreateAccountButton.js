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
  Center,
  Text,
  Box,
  Flex,
} from "@chakra-ui/react";
import { AiOutlineUserAdd } from "react-icons/ai";
import RegisterForm from "./RegisterForm";
import Nav from "../../BottomNavbar/Nav";

export default function CreateAccountButton() {
  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <>
      <Flex
        onClick={onOpen}
        justifyContent={"center"}
        alignItems={"center"}
        fontSize={["md", "xl"]}
        backgroundColor={"blackAlpha.300"}
        cursor={"pointer"}
        p={2}
      >
        <Text mr={2}>Sign up</Text>
        <Box>
          <AiOutlineUserAdd fontSize={["28px"]} display={"inline"} />
        </Box>
      </Flex>

      <Modal onClose={onClose} isOpen={isOpen} isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>
            <Center>Register</Center>
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <RegisterForm onRegistered={() => onClose()} />
          </ModalBody>
          <ModalFooter></ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}
