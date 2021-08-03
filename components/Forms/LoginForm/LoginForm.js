import React, { useEffect, useState } from "react";
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
  Spinner,
  useToast,
} from "@chakra-ui/react";
import { ErrorMessage } from "@hookform/error-message";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useStoreState, useStoreActions } from "easy-peasy";
import { useMutation, useQuery, useQueryClient } from "react-query";
import * as api from "../../../api-services/api";
import ResetPasswordLink from "./../ResetForm/ResetPasswordLink";
import cookie from "react-cookies";

const schema = yup.object().shape({
  username: yup.string().max(8).required(),
  password: yup.string().min(8).required(),
});

export default function LoginForm(props) {
  const queryClient = useQueryClient();
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

  const {
    isLoading,
    mutate: login,
    isError,
  } = useMutation((payload) => api.login(payload), {
    onSuccess: (data) => {
      reset({});

      cookie.save("signInUser", {
        username: data.user.username,
        token: `Bearer ${data.tokens.access.token}`,
        refresh: data.tokens.refresh.token,
      });

      toast({
        title: "Welcome back",
        status: "success",
        duration: 2000,
        isClosable: true,
      });
    },
  });

  if (isError) {
    toast({
      title: "Something went wrong, try again later",
      status: "error",
      duration: 2000,
      isClosable: true,
    });
  }

  const [isLogging, setIsLogging] = useState(false);

  let username = watch("username");
  let password = watch("password");
  let canSubmit = username && password;

  const onSubmit = async (data) => {
    login(data);
    props.onSignIn();
  };

  useEffect(() => {
    console.log(cookie.load("signInUser"));
  }, []);
  return (
    /* "handleSubmit" will validate your inputs before invoking "onSubmit" */
    <form onSubmit={handleSubmit(onSubmit)} id={"login-form"}>
      <Flex direction="column">
        {/* register your input into the hook by invoking the "register" function */}
        <Input
          name="username"
          placeholder="username"
          m={1}
          {...register("username")}
        />
        <Input
          name="password"
          placeholder="password"
          type={"password"}
          m={1}
          {...register("password")}
        />
        {/* errors will return when field validation fails  */}
        <ErrorMessage
          errors={errors}
          name="username"
          render={({ message }) => (
            <Box p={1} bg={"red.400"} mr={0} ml={2}>
              {message}
            </Box>
          )}
        />
        <ErrorMessage
          errors={errors}
          name="password"
          render={({ message }) => (
            <Box p={1} bg={"red.400"} mr={0} ml={2}>
              {message}
            </Box>
          )}
        />

        <ResetPasswordLink />
        <Button
          type={"submit"}
          mt={2}
          width="100%"
          m={1}
          disabled={!canSubmit || isLogging}
          rightIcon={isLogging && <Spinner size="sm" mt={1} />}
        >
          Login
        </Button>
      </Flex>
    </form>
  );
}
