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
  Stack,
  Text,
  useToast,
} from "@chakra-ui/react";
import { useStoreState, useStoreActions } from "easy-peasy";
import AccountModal from "./AccountModal";
import LoginButton from "../LoginForm/LoginButton";
import CreateAccountButton from "../RegisterForm/CreateAccountButton";
import { RiAccountCircleLine } from "react-icons/ri";
import Nav from "../../BottomNavbar/Nav";
import { FiLogOut } from "react-icons/fi";
import { logout } from "../../../auth-services/auth";

export default function AccountDrawer() {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();
  const isLoggedIn = useStoreState((state) => state.isLoggedIn);
  const setLoggedInUserData = useStoreActions(
    (actions) => actions.setLoggedInUserData
  );
  const setUserLogin = useStoreActions((actions) => actions.setUserLogin);

  return (
    <>
      <Nav
        title={"Account"}
        icon={
          <RiAccountCircleLine
            size={[30]}
            color={"#ff9f1c"}
            display={"inline"}
          />
        }
        onClick={() => {
          onOpen();
        }}
      ></Nav>
      <Drawer placement={"bottom"} onClose={onClose} isOpen={isOpen}>
        <DrawerOverlay />
        <DrawerContent>
          <DrawerBody overflowY={"scroll"} p={4}>
            <Stack>
              {isLoggedIn && (
                <Box>
                  <AccountModal />
                </Box>
              )}
              {!isLoggedIn && (
                <Box>
                  <LoginButton
                    onLogin={() => {
                      setUserLogin(true);
                      onClose();
                    }}
                  />
                </Box>
              )}

              {isLoggedIn && (
                <Box>
                  <Flex
                    onClick={onOpen}
                    justifyContent={"center"}
                    alignItems={"center"}
                    fontSize={["md", "xl"]}
                    backgroundColor={"blackAlpha.300"}
                    borderRadius={"lg"}
                    p={2}
                    cursor={"pointer"}
                    onClick={() => {
                      logout();
                      setUserLogin(false);
                      setLoggedInUserData({});
                      onClose();
                      toast({
                        title: `You logged out successfully`,
                        status: "success",
                        duration: 2000,
                        isClosable: true,
                      });
                    }}
                  >
                    <Text mr={2}>Log out</Text>
                    <Box>
                      <FiLogOut fontSize={["28px"]} display={"inline"} />
                    </Box>
                  </Flex>
                </Box>
              )}

              {!isLoggedIn && (
                <Box>
                  <CreateAccountButton />
                </Box>
              )}
            </Stack>
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </>
  );
}
