import React, { useState } from "react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  useToast,
  Stack,
  Input,
  Button,
  Text,
  AlertDialog,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogOverlay,
  Textarea,
  Box,
  Center,
} from "@chakra-ui/react";
import Nav from "../../BottomNavbar/Nav";
import { BsFillQuestionCircleFill } from "react-icons/bs";
import { RiAccountCircleLine } from "react-icons/ri";
import { useMutation, useQuery, useQueryClient } from "react-query";
import * as api from "../../../api-services/api";

export default function AccountModal() {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [isOpenDialog, setIsOpenDialog] = React.useState(false);
  const [username, setUsername] = useState("");
  const [bio, setBio] = useState("");
  const [remain, setRemain] = useState(200);
  const cancelRef = React.useRef();

  //   const {
  //     data: fetchedUser,
  //     isLoading,
  //     isError,
  //     isSuccess,
  //     isFetching,
  //   } = useQuery(
  //     "Account",
  //     () => api.fetchUser({ userId: loggedInUser().userId }),
  //     {
  //       refetchOnWindowFocus: false,
  //       enabled: isOpen,
  //     }
  //   );
  const toast = useToast();

  const onInputChange = (e) => {
    setUsername(e.target.value);
  };

  const checkRemain = (e) => {
    let countedLetters = e.target.value.length;
    let remainedLetters = 200 - countedLetters;
    setRemain(remainedLetters);
    setBio(e.target.value);
  };

  const onCloseDialog = () => setIsOpenDialog(false);

  //   if (isError) {
  //     toast({
  //       title: "Failed to get user, try again later",
  //       status: "error",
  //       duration: 2000,
  //       isClosable: true,
  //     });
  //   }
  return (
    <>
      <Nav
        title={"Account"}
        icon={<RiAccountCircleLine color={"#ff9f1c"} display={"inline"} />}
        onClick={() => {
          //   onOpen();
          //   setUsername(fetchedUser?.username);
          //   setBio(fetchedUser?.bio);
        }}
      ></Nav>
      <Modal
        isOpen={isOpen}
        onClose={onClose}
        size={"xl"}
        closeOnOverlayClick={false}
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader pb={"0"}>Account</ModalHeader>
          <ModalCloseButton />

          <ModalBody>
            <Box
              position={"relative"}
              backgroundColor={"blackAlpha.300"}
              display={"inline-block"}
              borderRadius={"12"}
              mb={3}
            >
              <Text
                fontSize={["sm", "md", "lg"]}
                padding={2}
                fontWeight={"bold"}
              >
                {/* Agree rate {Math.ceil(fetchedUser?.agreeRate)}% */}
              </Text>
              <Box
                as={"span"}
                position={"absolute"}
                right={"-1"}
                bottom={"-1"}
                cursor={"pointer"}
                className={"show-help-message"}
              >
                <BsFillQuestionCircleFill />
                <Box
                  as={"span"}
                  position={"absolute"}
                  w={"150px"}
                  bg={"blackAlpha.300"}
                  textAlign={"center"}
                  borderRadius={"12px"}
                  fontSize={["xs", "sm"]}
                  p={"2"}
                  opacity={"0"}
                >
                  This means each opinion you gave got at least 3 agrees
                </Box>
              </Box>
            </Box>
            <form>
              <Text mb={1}>username</Text>
              <Input onChange={onInputChange} value={username} mb={3} />
              <Text mb={1}>bio</Text>
              <Box position={"relative"}>
                <Textarea resize={"none"} onChange={checkRemain} />
                <Box
                  mr={4}
                  color={remain < 0 ? "red.400" : ""}
                  position={"absolute"}
                  right={0}
                  bottom={3}
                >
                  {remain}
                </Box>
              </Box>

              <Button
                bgColor={"#ff9f1c"}
                color={"black"}
                colorScheme={"#ff9f1c"}
              >
                Update data
              </Button>
              <Text mt={3} mb={3}>
                Password
              </Text>

              <Button onClick={() => setIsOpenDialog(true)}>
                Change Password
              </Button>
            </form>
          </ModalBody>
          <ModalFooter justifyContent={"start"}>
            <Text fontWeight={"bold"} fontSize={["sm", "md"]}>
              You opinions
            </Text>
          </ModalFooter>
        </ModalContent>
      </Modal>
      <AlertDialog isOpen={isOpenDialog} onClose={onCloseDialog}>
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              Change Password
            </AlertDialogHeader>

            <AlertDialogBody>
              To change your password, please logout and reset your password.
            </AlertDialogBody>

            <AlertDialogFooter>
              <Button ref={cancelRef} onClick={onCloseDialog}>
                OK
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </>
  );
}
