import "../styles/globals.scss";
import React from "react";
import Layout from "../components/Layout";
import { QueryClient, QueryClientProvider } from "react-query";
import { Hydrate } from "react-query/hydration";

import { ReactQueryDevtools } from "react-query/devtools";

import socket from "../lib/socketIOInit";

function MyApp({ Component, pageProps }) {
  const [queryClient] = React.useState(() => new QueryClient());
  return (
    <Layout>
      <QueryClientProvider client={queryClient}>
        <ReactQueryDevtools />
        <Hydrate state={pageProps.dehydratedState}>
          <Component {...pageProps} socket={socket} />
        </Hydrate>
      </QueryClientProvider>
    </Layout>
  );
}

export default MyApp;
