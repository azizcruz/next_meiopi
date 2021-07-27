import { Box } from "@chakra-ui/react";
import QuestionsList from "../components/Question/QuestionsList/QuestionsList";

export default function Home(props) {
  return (
    <Box>
      <QuestionsList socket={props.socket} />
    </Box>
  );
}
