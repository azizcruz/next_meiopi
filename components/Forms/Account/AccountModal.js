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
  Spinner,
  Center,
  Flex,
} from "@chakra-ui/react";
import Nav from "../../BottomNavbar/Nav";
import { BsFillQuestionCircleFill } from "react-icons/bs";
import { RiAccountCircleLine } from "react-icons/ri";
import { useMutation, useQuery, useQueryClient } from "react-query";
import * as api from "../../../api-services/api";
import { isAuthenticated, userData } from "../../../auth-services/auth";
import { useForm, Controller } from "react-hook-form";
import { ErrorMessage } from "@hookform/error-message";

export default function AccountModal() {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [isOpenDialog, setIsOpenDialog] = React.useState(false);
  const [bio, setBio] = useState("");
  const [remain, setRemain] = useState(200);
  const cancelRef = React.useRef();

  let canSubmit = username;

  const {
    data: fetchedUser,
    isLoading,
    isError,
    isSuccess,
    isFetching,
  } = useQuery("Account", () => api.fetchUser({ userId: userData().id }), {
    refetchOnWindowFocus: false,
    enabled: isOpen,
  });

  const {
    isLoading: updateUserLoading,
    mutate: updateUser,
    isError: isUpdateUserError,
  } = useMutation(api.updateUser, {
    onSuccess: () => {
      toast({
        title: "You have updated your data",
        status: "success",
        duration: 2000,
        isClosable: true,
      });
    },
    onError: (e) => {
      console.log(e.request);
    },
  });

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({
    username: fetchedUser ? fetchedUser.username : "",
    bio: fetchedUser ? fetchedUser.bio : "",
  });

  let username = watch("username");

  const toast = useToast();

  const checkRemain = (e) => {
    let countedLetters = e.target.value.length;
    let remainedLetters = 200 - countedLetters;
    setRemain(remainedLetters);
  };

  const onCloseDialog = () => setIsOpenDialog(false);

  const updateUserData = (data) => {
    data.userId = userData().id;
    updateUser(data);
  };

  if (isError) {
    toast({
      title: "Failed to get user, try again later",
      status: "error",
      duration: 2000,
      isClosable: true,
    });
  }

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
        <Text mr={2}>Profile</Text>
        <Box>
          <RiAccountCircleLine fontSize={["28px"]} display={"inline"} />
        </Box>
      </Flex>
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
                Agree rate {Math.ceil(fetchedUser?.agreeRate)}%
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
            <form onSubmit={handleSubmit(updateUserData)}>
              <Text>username</Text>
              <Input
                {...register("username", {
                  required: "Username is required",
                  maxLength: {
                    value: 8,
                    message: "Username must be 8 or less characters",
                  },
                })}
                defaultValue={fetchedUser?.username}
              />
              {errors.username && (
                <ErrorMessage
                  errors={errors}
                  name="username"
                  m={1}
                  render={({ message }) => (
                    <Box p={1} bg={"red.400"} mr={0} mb={3}>
                      {message}
                    </Box>
                  )}
                />
              )}

              <Text mb={1}>bio</Text>
              <Box position={"relative"}>
                <Textarea
                  {...register("bio", {
                    maxLength: {
                      value: 200,
                      message: "Biography must be 200 charachters or less",
                    },
                  })}
                  onChange={checkRemain}
                  resize={"none"}
                  defaultValue={fetchedUser?.bio}
                />

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

              {errors.bio && (
                <ErrorMessage
                  errors={errors}
                  name="bio"
                  m={1}
                  render={({ message }) => (
                    <Box p={1} bg={"red.400"} mb={3}>
                      {message}
                    </Box>
                  )}
                />
              )}
              <Button
                bgColor={"#ff9f1c"}
                color={"black"}
                colorScheme={"#ff9f1c"}
                mt={2}
                type={"submit"}
              >
                Update data
              </Button>

              {updateUserLoading && (
                <Box as={"span"} position={"relative"} left={3} top={3}>
                  <Spinner />
                </Box>
              )}
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
