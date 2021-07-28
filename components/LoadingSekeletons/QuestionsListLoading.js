import React from "react";
import { Skeleton, SkeletonText, Stack, Box, Flex } from "@chakra-ui/react";

function QuestionsListLoading() {
  const textHeight = 3;
  return (
    <Stack spacing={4}>
      <Box bg={"#f44336"} padding={4} borderRadius={15}>
        <Skeleton minH={textHeight} width={"10%"} mb={4} />
        <Skeleton minH={textHeight} width={"70%"} mb={2} />
        <Skeleton minH={textHeight} width={"100%"} mb={2} />
        <Skeleton minH={textHeight} width={"90%"} mb={2} />

        <Flex justifyContent={"space-between"} alignItems={"center"}>
          <Skeleton minH={textHeight} width={"20%"} mt={4} />
          <Skeleton width={"100px"} mt={4} minH={"40px"} />
        </Flex>
      </Box>
      <Box bg={"#ff9f1c"} padding={4} borderRadius={15}>
        <Skeleton minH={textHeight} width={"10%"} mb={4} />
        <Skeleton minH={textHeight} width={"100%"} mb={2} />
        <Skeleton minH={textHeight} width={"50%"} mb={2} />
        <Skeleton minH={textHeight} width={"60%"} mb={2} />
        <Skeleton minH={textHeight} width={"80%"} mb={2} />
        <Flex justifyContent={"space-between"} alignItems={"center"}>
          <Skeleton minH={textHeight} width={"20%"} mt={4} />
          <Skeleton width={"100px"} mt={4} minH={"40px"} />
        </Flex>
      </Box>
      <Box bg={"#64b5f6"} padding={4} borderRadius={15}>
        <Skeleton minH={textHeight} width={"10%"} mb={4} />
        <Skeleton minH={textHeight} width={"100%"} mb={2} />
        <Skeleton minH={textHeight} width={"70%"} mb={2} />
        <Skeleton minH={textHeight} width={"90%"} mb={2} />
        <Skeleton minH={textHeight} width={"50%"} mb={2} />
        <Flex justifyContent={"space-between"} alignItems={"center"}>
          <Skeleton minH={textHeight} width={"20%"} mt={4} />
          <Skeleton width={"100px"} mt={4} minH={"40px"} />
        </Flex>
      </Box>
      <Box bg={"#f44336"} padding={4} borderRadius={15}>
        <Skeleton minH={textHeight} width={"10%"} mb={4} />
        <Skeleton minH={textHeight} width={"90%"} mb={2} />
        <Skeleton minH={textHeight} width={"80%"} mb={2} />
        <Skeleton minH={textHeight} width={"70%"} mb={2} />
        <Skeleton minH={textHeight} width={"80%"} mb={2} />
        <Flex justifyContent={"space-between"} alignItems={"center"}>
          <Skeleton minH={textHeight} width={"20%"} mt={4} />
          <Skeleton width={"100px"} mt={4} minH={"40px"} />
        </Flex>
      </Box>
      <Box bg={"#ff9f1c"} padding={4} borderRadius={15}>
        <Skeleton minH={textHeight} width={"10%"} mb={4} />
        <Skeleton minH={textHeight} width={"100%"} mb={2} />
        <Skeleton minH={textHeight} width={"100%"} mb={2} />
        <Skeleton minH={textHeight} width={"90%"} mb={2} />
        <Skeleton minH={textHeight} width={"80%"} mb={2} />
        <Flex justifyContent={"space-between"} alignItems={"center"}>
          <Skeleton minH={textHeight} width={"20%"} mt={4} />
          <Skeleton width={"100px"} mt={4} minH={"40px"} />
        </Flex>
      </Box>
    </Stack>
  );
}

export default QuestionsListLoading;
