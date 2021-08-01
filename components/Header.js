import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  ButtonGroup,
  Center,
  Textarea,
  Stack,
  Drawer,
  DrawerBody,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  Flex,
  useColorMode,
  Spinner,
  useDisclosure,
  FormControl,
  FormLabel,
  FormErrorMessage,
  FormHelperText,
  Input,
  Divider,
  Text,
  Fade,
  useToast,
  InputGroup,
  InputLeftElement,
} from "@chakra-ui/react";

import { FiLogOut, FiUserPlus, FiLogIn } from "react-icons/fi";
import { AiFillHome, AiOutlineSearch } from "react-icons/ai";
import AddQuestionCard from "../components/Forms/AddQuestionCard/AddQuestionCard.js";
import RegisterForm from "../components/Forms/RegisterForm/RegisterForm";
import "./../styles/Header.module.scss";
import HorizontalMenu from "../components/HorizontalMenu/HorizontalMenu";
import { useStoreState, useStoreActions } from "easy-peasy";
import CreateAccountButton from "./Forms/RegisterForm/CreateAccountButton";
import LoginButton from "./Forms/LoginForm/LoginButton";
import IdleTimer from "react-idle-timer";
import { useJwt } from "react-jwt";
import { useHistory } from "react-router-dom";
import NavbarContainer from "../components/BottomNavbar/NavbarContainer";
import Nav from "../components/BottomNavbar/Nav";
import { useQuery, useQueryClient, useMutation } from "react-query";
import * as api from "../api-services/api";
import FollowingQuestions from "../components/Question/FollowingQuestions/FollowingQuestions";
import AccountModal from "../components/Forms/Account/AccountModal";

export default function Header() {
  const queryClient = useQueryClient();
  const {
    data: listOfTags,
    isLoading,
    isError: isErrorFetchingTags,
    isSuccess,
    isFetching,
  } = useQuery("tags", api.getTags, {
    refetchOnWindowFocus: false,
  });

  const toast = useToast();
  const fetchFilteredPosts = useStoreActions(
    (actions) => actions.fetchFilteredPosts
  );
  const {
    fetchTags,
    setFilterPostsBy,
    fetchLatestPosts,
    getFollowingQuestions,
  } = useStoreActions((actions) => actions);

  const { filterPostsBy } = useStoreState((state) => state);

  if (isErrorFetchingTags) {
    toast({
      title: "Failed to get groups, try again later",
      status: "error",
      duration: 2000,
      isClosable: true,
    });
  }

  useEffect(async () => {
    getFollowingQuestions();
  }, []);

  const btnRef = React.useRef();

  return (
    <>
      <NavbarContainer>
        <Nav
          title={"Home"}
          icon={<AiFillHome color={"#ff9f1c"} display={"inline"} />}
        />
        {true ? <AccountModal /> : ""}

        <FollowingQuestions />

        {!true ? (
          <Nav
            title={"Login"}
            icon={<FiLogIn color={"#ff9f1c"} display={"inline"} />}
          >
            <LoginButton />
          </Nav>
        ) : (
          ""
        )}
        {!true ? (
          <Nav
            title={"Sign up"}
            icon={<FiUserPlus color={"#ff9f1c"} display={"inline"} />}
          >
            <CreateAccountButton />
          </Nav>
        ) : (
          ""
        )}
        {true ? (
          <Nav
            title={"Logout"}
            icon={<FiLogOut color={"#ff9f1c"} display={"inline"} />}
            onClick={() => {}}
          />
        ) : (
          ""
        )}
      </NavbarContainer>
      <Flex alignItems={"center"}>
        <Box fontSize={"2xl"} alignSelf={"flex-end"}>
          <Box
            as="span"
            p="1.5"
            fontSize="3xl"
            fontWeight="bold"
            mr={"-1"}
            top={0.5}
            position={"relative"}
          >
            M
          </Box>
          <Box as="span" color="white" bg={"blue.800"} p="1" borderRadius="8">
            eiopi
          </Box>
        </Box>
        {/* <Box flexGrow={2} ml={3}>
          <InputGroup>
            <InputLeftElement
              pointerEvents="none"
              children={<AiOutlineSearch color="gray.300" />}
            />
            <Input type="tel" placeholder="Search" />
          </InputGroup>
        </Box> */}
      </Flex>
      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="center"
        spacing={4}
        mt={2}
        borderRadius={8}
        pr={0}
        pl={0}
        direction={["column", "row"]}
      >
        <Box display={"flex"}>
          <Box margin={0.5}>
            <AddQuestionCard />
          </Box>
        </Box>
      </Stack>
      {isLoading ? (
        <Center>
          <Spinner size="sm" mb={2} />
        </Center>
      ) : (
        <HorizontalMenu
          fetchFilteredPosts={fetchFilteredPosts}
          listOfTags={listOfTags}
        />
      )}
      {filterPostsBy ? (
        <Center>
          <Text
            textAlign={"center"}
            borderRadius={"8"}
            p={"1"}
            mb={"2"}
            backgroundColor={"blue.800"}
            display={"inline-block"}
            className={"filter-title-button"}
            onClick={() => {
              setFilterPostsBy(null);
              fetchLatestPosts();
            }}
          >
            <Text
              as={"span"}
              fontSize={["xs", "sm", "md", "lg"]}
              mr={"-1"}
              className={"close"}
            >
              X
            </Text>{" "}
            {decodeURIComponent(filterPostsBy)}
          </Text>
        </Center>
      ) : (
        ""
      )}
    </>
  );
}
