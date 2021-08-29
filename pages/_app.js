import "../styles/globals.scss";
import React from "react";
import Layout from "../components/Layout";
import { QueryClient, QueryClientProvider } from "react-query";
import { Hydrate } from "react-query/hydration";
import { StoreProvider } from "easy-peasy";
import { ReactQueryDevtools } from "react-query/devtools";
import store from "../store/store";

import socket from "../lib/socketIOInit";

function MyApp({ Component, pageProps }) {
  const [queryClient] = React.useState(() => new QueryClient());
  return (
    <StoreProvider store={store}>
      <QueryClientProvider client={queryClient}>
        <Layout>
          <ReactQueryDevtools />
          <Hydrate state={pageProps.dehydratedState}>
            <Component {...pageProps} socket={socket} />
          </Hydrate>
        </Layout>
      </QueryClientProvider>
    </StoreProvider>
  );
}

export default MyApp;
