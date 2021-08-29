import React, { useState } from "react";
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
import Nav from "../BottomNavbar/Nav";
import { userData } from "../../auth-services/auth";
import { BsFillBellFill } from "react-icons/bs";
import { MdNotificationsActive } from "react-icons/md";
import "animate.css";
import * as api from "../../api-services/api";
import { useMutation, useQuery, useQueryClient } from "react-query";

function NotificationsDrawer() {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();
  const isLoggedIn = useStoreState((state) => state.isLoggedIn);
  const [isNewNotifications, setIsNewNotifications] = useState(false);

  const { data, isLoading, isError, isSuccess, isFetching } = useQuery(
    "notifications",
    () => api.getNotifications({ userId: userData().id || "" })
  );

  if (isSuccess) {
  }

  return (
    <>
      {data && data.some((noti) => noti.isRead === false) ? (
        <Nav
          title={"Notifications"}
          icon={
            <Box
              className={
                "animate__animated animate__heartBeat animate__infinite"
              }
            >
              <MdNotificationsActive
                size={[30]}
                color={"#ff9f1c"}
                display={"inline"}
              />
            </Box>
          }
          onClick={() => {
            onOpen();
          }}
        ></Nav>
      ) : (
        <Nav
          title={"Notifications"}
          icon={
            <BsFillBellFill size={[30]} color={"#ff9f1c"} display={"inline"} />
          }
          onClick={() => {
            onOpen();
          }}
        ></Nav>
      )}
      <Drawer placement={"bottom"} onClose={onClose} isOpen={isOpen}>
        <DrawerOverlay />
        <DrawerContent>
          <DrawerBody p={4}>
            <Box as={"div"} ml={3} fontWeight={"bold"} fontSize={["md", "lg"]}>
              Your latest notifications
            </Box>

            <Box maxH={"300px"} overflowY={"scroll"}>
              {data &&
                data.map((noti) => {
                  return (
                    <Box
                      m={3}
                      p={3}
                      borderRadius={"lg"}
                      bg={"blackAlpha.400"}
                      cursor={"pointer"}
                      display={"flex"}
                      justifyContent={"space-between"}
                    >
                      <Text>{noti.message}</Text>
                      <Box>{noti.isRead ? "read" : "new"}</Box>
                    </Box>
                  );
                })}
            </Box>
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </>
  );
}

export default React.memo(NotificationsDrawer);
