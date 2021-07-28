import React from "react";
import { ChakraProvider, Container } from "@chakra-ui/react";
import Header from "../components/Header";
import { QueryClientProvider, QueryClient } from "react-query";
import { ReactQueryDevtools } from "react-query/devtools";
import { StoreProvider } from "easy-peasy";
import store from "./../store/store";
import theme from "./../styles/theme";

const queryClient = new QueryClient();

export default function Layout({ children }) {
  return (
    <>
      <StoreProvider store={store}>
        <ChakraProvider theme={theme}>
          <Header />
          <Container maxW="container.xl">{children}</Container>
        </ChakraProvider>
      </StoreProvider>
    </>
  );
}
