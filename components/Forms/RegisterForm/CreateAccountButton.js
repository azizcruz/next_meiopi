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
  Box,
} from "@chakra-ui/react";
import { AiOutlineUserAdd } from "react-icons/ai";
import RegisterForm from "./RegisterForm";
import Nav from "../../BottomNavbar/Nav";

export default function CreateAccountButton() {
  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <>
      <Nav
        title={"Sign up"}
        icon={<AiOutlineUserAdd color={"#ff9f1c"} display={"inline"} />}
        onClick={onOpen}
      ></Nav>

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
