import React, { useState } from "react";
import { useForm } from "react-hook-form";
import {
  FormErrorMessage,
  FormLabel,
  FormControl,
  Input,
  Button,
  Box,
  Center,
  Flex,
  useToast,
  Spinner,
  AlertDialog,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogOverlay,
} from "@chakra-ui/react";
import { ErrorMessage } from "@hookform/error-message";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useStoreState, useStoreActions } from "easy-peasy";
import { CopyToClipboard } from "react-copy-to-clipboard";
import dynamic from "next/dynamic";

const saveAs = dynamic(() => import("save-as"), { ssr: false });

const schema = yup.object().shape({
  username: yup.string().max(8).required(),
  password1: yup.string().min(8).required(),
  password2: yup
    .string()
    .oneOf([yup.ref("password1"), null], "Passwords must match"),
});

export default function RegisterForm(props) {
  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  const toast = useToast();
  const [isRegistering, setIsRegistering] = useState(false);

  const [isCredentialOpen, setIsCredentialOpen] = useState(false);

  const [credsUsername, setIsCredsUsername] = useState("");
  const [secretKeyOne, setSecretKeyOne] = useState("");
  const [secretKeyTwo, setSecretKeyTwo] = useState("");
  const [secretKeyThree, setSecretKeyThree] = useState("");

  const onClose = () => {
    let ans = window.confirm(
      "Are you sure that you kept this credentials somewhere safe ? \n\nneglecting them will maybe in the future lead you to lose your account."
    );
    if (ans) {
      setIsCredsUsername("");
      setSecretKeyOne("");
      setSecretKeyTwo("");
      setSecretKeyThree("");
      setIsCredentialOpen(false);
      props.onRegistered();
    }
  };
  const cancelRef = React.useRef();

  const signUp = useStoreActions((actions) => actions.register);

  const onSubmit = async (data, e) => {
    try {
      setIsRegistering(true);
      const creds = await signUp(data);
      setIsRegistering(false);
      setIsCredsUsername(creds.user.username);
      setSecretKeyOne(creds.user.secretStringOne);
      setSecretKeyTwo(creds.user.secretStringTwo);
      setSecretKeyThree(creds.user.secretStringThree);
      setIsCredentialOpen(true);
      reset({});
      toast({
        title: "Account created.",
        description: "We've created your account for you.",
        status: "success",
        duration: 2000,
        isClosable: true,
      });
    } catch (error) {
      setIsRegistering(false);
      let title = JSON.parse(error.request.response).message.includes("taken")
        ? JSON.parse(error.request.response).message
        : error.message;

      if (JSON.parse(error.request.response).message.includes("contain")) {
        title = "Password must contain at least one letter and one number";
      }
      toast({
        title: title,
        status: "error",
        duration: 2000,
        isClosable: true,
      });
    }
  };

  let username = watch("username");
  let password1 = watch("password1");
  let password2 = watch("password2");
  let canSubmit = username && password1 && password2;

  const onCredsCopy = () => {};
  const onCredsDownload = () => {
    let formHTML = document.getElementById("credentials");
    let blob = new Blob(
      [
        `username: ${credsUsername}\nsecret key 1: ${secretKeyOne}\nsecret key 2: ${secretKeyTwo}\nsecret key 3: ${secretKeyThree} \n\n****Warning****\n\nchanging anything in this file will corrupt it for import use`,
      ],
      {
        type: "text/plain;charset=utf-8",
      }
    );
    saveAs(blob, "meiopi-account-credentials.txt");
  };

  return (
    /* "handleSubmit" will validate your inputs before invoking "onSubmit" */
    <form onSubmit={handleSubmit(onSubmit)}>
      <Flex direction="column">
        {/* register your input into the hook by invoking the "register" function */}
        <Input
          name="username"
          placeholder="username"
          {...register("username")}
          m={1}
        />
        <Input
          name="password1"
          placeholder="password"
          m={1}
          type={"password"}
          {...register("password1")}
        />
        <Input
          name="password2"
          placeholder="confirm password"
          m={1}
          type={"password"}
          {...register("password2")}
        />
        {/* errors will return when field validation fails  */}
        <ErrorMessage
          errors={errors}
          name="username"
          m={1}
          render={({ message }) => (
            <Box p={1} bg={"red.400"} mr={0} ml={2}>
              {message}
            </Box>
          )}
        />
        <ErrorMessage
          errors={errors}
          name="password1"
          m={1}
          render={({ message }) => (
            <Box p={1} bg={"red.400"} mr={0} ml={2}>
              {message}
            </Box>
          )}
        />
        <ErrorMessage
          errors={errors}
          name="password2"
          m={1}
          render={({ message }) => (
            <Box p={1} bg={"red.400"} mr={0} ml={2}>
              {message}
            </Box>
          )}
        />

        <Button
          type={"submit"}
          mt={2}
          width="100%"
          m={1}
          disabled={!canSubmit || isRegistering}
          rightIcon={isRegistering && <Spinner size="sm" mt={1} />}
        >
          Create My Account
        </Button>
        <Box>
          <AlertDialog
            isOpen={isCredentialOpen}
            leastDestructiveRef={cancelRef}
            onClose={onClose}
            isCentered
            closeOnOverlayClick={false}
          >
            <AlertDialogOverlay>
              <AlertDialogContent>
                <AlertDialogHeader fontSize="md" fontWeight="bold">
                  Here is your credentials to reset your account details please
                  download them or keep them somewhere safe.
                </AlertDialogHeader>

                <AlertDialogBody>
                  <Box id={"credentials"}>
                    username
                    <Input value={credsUsername} readOnly mb={1} />
                    Secret Key 1
                    <Input value={secretKeyOne} readOnly mb={1} />
                    Secret Key 2
                    <Input value={secretKeyTwo} readOnly mb={1} />
                    Secret Key 3
                    <Input value={secretKeyThree} readOnly mb={1} />
                  </Box>
                  <Center>
                    <Button size={"sm"} mt={2} onClick={onCredsDownload}>
                      Download
                    </Button>
                    <CopyToClipboard
                      text={`username: ${credsUsername}\nsecret key 1: ${secretKeyOne}\nsecret key 2: ${secretKeyTwo}\nsecret key 3: ${secretKeyThree}`}
                      onCopy={() => {
                        toast({
                          title: "Copied",
                          description: "Now paste it somewehre safe 🔒",
                          status: "info",
                          duration: 3000,
                          isClosable: true,
                        });
                      }}
                    >
                      <Button size={"sm"} mt={2} ml={2}>
                        Copy
                      </Button>
                    </CopyToClipboard>
                  </Center>
                </AlertDialogBody>

                <AlertDialogFooter>
                  <Button ref={cancelRef} onClick={onClose}>
                    Close
                  </Button>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialogOverlay>
          </AlertDialog>
        </Box>
      </Flex>
    </form>
  );
}
