import React, { useEffect } from "react";
import { ChakraProvider, Container } from "@chakra-ui/react";
import Header from "../components/Header";
import {
  QueryClientProvider,
  QueryClient,
  useQuery,
  useMutation,
} from "react-query";
import theme from "./../styles/theme";
import * as api from "../api-services/api";
import cookies from "react-cookies";
import Axios from "axios";
import SearchButton from "./SearchButton/SearchButton";
import { useStoreActions } from "easy-peasy";

const queryClient = new QueryClient();

export default function Layout({ children }) {
  const setUserHashedIp = useStoreActions((action) => action.setUserHashedIp);
  const { data: ipData, isError: getIpDataError } = useQuery(
    "ipData",
    () => {
      return Axios.get("https://api.ipify.org?format=json").then(
        async (res) => {
          return res.data.ip;
        }
      );
    },
    {
      cacheTime: 1000,
      enabled: queryClient.getQueryData("hashedIp") ? false : true,
    }
  );

  const ip = ipData?.ip;

  const {
    data: hashedIpData,
    isError: hashedIpDataError,
    mutate,
  } = useMutation((payload) => api.getHashedIp(payload), {
    enabled: !!ipData,
    onSuccess: (data) => {
      queryClient.setQueryData("hashedIp", data.hashedIp);
      setUserHashedIp(data.hashedIp);
      cookies.save("visitorHashedIp", data.hashedIp);
    },
  });

  useEffect(() => {
    if (!!ipData) {
      mutate({ visitorIp: ipData });
    }
  }, [ipData]);

  return (
    <>
      <ChakraProvider theme={theme}>
        <SearchButton />
        <Header />
        <Container maxW="container.xl">{children}</Container>
      </ChakraProvider>
    </>
  );
}
