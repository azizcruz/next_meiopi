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
} from "@chakra-ui/react";
import { FiLogIn } from "react-icons/fi";
import LoginForm from "./LoginForm";
import Nav from "../../BottomNavbar/Nav";

export default function CreateAccountButton(props) {
  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <>
      <Nav
        title={"Login"}
        icon={<FiLogIn color={"#ff9f1c"} display={"inline"} />}
        onClick={onOpen}
      ></Nav>
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
