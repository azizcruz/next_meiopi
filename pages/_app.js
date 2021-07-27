import "../styles/globals.css";
import Layout from "../components/Layout";
import socketIOClient from "socket.io-client";
import { QueryClient, QueryClientProvider } from "react-query";
import { ReactQueryDevtools } from "react-query/devtools";
let socket = socketIOClient("http://localhost:3000");

const queryClient = new QueryClient();

function MyApp({ Component, pageProps }) {
  return (
    <Layout>
      <QueryClientProvider client={queryClient}>
        <ReactQueryDevtools />
        <Component {...pageProps} socket={socket} />
      </QueryClientProvider>
    </Layout>
  );
}

export default MyApp;
