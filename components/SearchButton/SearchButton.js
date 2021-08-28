import React, { useEffect, useState } from "react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  IconButton,
  Input,
  useDisclosure,
  Flex,
  Box,
  Text,
  Stack,
  Button,
  List,
  ListItem,
  Menu,
  MenuList,
  MenuItem,
  UnorderedList,
  Spinner,
  Center,
} from "@chakra-ui/react";
import { BsSearch } from "react-icons/bs";
import { AiOutlineEnter } from "react-icons/ai";
import { BiHash } from "react-icons/bi";
import Highlighter from "react-highlight-words";
import styles from "../../styles/SearchResultsMenuStyles.module.scss";

import Autocomplete from "react-autocomplete";

import * as api from "../../api-services/api";
import { useMutation, useQuery, useQueryClient } from "react-query";

import { useRouter } from "next/router";

let options = [];

export default function SearchButton() {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const queryClient = useQueryClient();
  const [searchValue, setSearchValue] = useState("");
  const router = useRouter();
  const [noDataFound, setNoDataFound] = useState(false);

  const { data, isLoading, isError, isSuccess, isFetching } = useQuery(
    "questionsToSearch",
    () =>
      api.getQuestions({ page: 0, limit: 30, filterByContent: searchValue }),
    {
      enabled: searchValue.length > 3 && !isLoading,
      cacheTime: Infinity,
    }
  );

  if (isSuccess) {
    if (options.length === 0) {
      options = [...queryClient.getQueryData("questionsToSearch").docs];
    }
  }

  const onResultSelect = (option) => {
    router.push(`/questions/${option.id}/${option.slug}?bgColor=#f44336`);
  };

  console.log(data);

  useEffect(() => {
    if (!isOpen) {
      queryClient.removeQueries("questionsToSearch");
    } else {
      setSearchValue("");
    }
  }, [isOpen]);

  return (
    <>
      <IconButton
        onClick={onOpen}
        icon={<BsSearch />}
        position={"fixed"}
        opacity={isOpen ? 0 : 1}
        right={1}
        top={1}
        w={["50px", "60px", "80px"]}
        h={["50px", "60px", "80px"]}
        zIndex={"999999999"}
        bg={"#2c3e50"}
        fontSize={[20, 40, 45]}
        _focus={{ border: 0 }}
        _active={{ backgroundColor: "#2c3e50" }}
        _hover={{ backgroundColor: "#2c3e50" }}
        type={"button"}
      />

      <Modal isOpen={isOpen} onClose={onClose} size={"xl"}>
        <ModalOverlay />
        <ModalContent>
          <Autocomplete
            getItemValue={(item) => item.content}
            items={data ? data.docs : []}
            shouldItemRender={(item, value) =>
              item.content.toLowerCase().indexOf(searchValue.toLowerCase()) >
                -1 ||
              item.content.toLowerCase().match(searchValue.toLowerCase())
            }
            renderInput={(props) => {
              return (
                <Input
                  outlineColor={"transparent"}
                  outlineOffset={"2px"}
                  border={0}
                  _focus={{ border: 0 }}
                  _active={{ border: 0 }}
                  minHeight={"68px"}
                  fontSize={["30px", "35px"]}
                  maxLength={50}
                  w={"100%"}
                  disabled={isLoading}
                  {...props}
                />
              );
            }}
            renderItem={(item, isHighlighted) => (
              <ListItem
                display={"flex"}
                fontSize={["20px", "30px"]}
                p={3}
                bg={isHighlighted ? "teal.600" : "gray.600"}
                m={3}
                flexDirection={"column"}
                borderRadius={"lg"}
                cursor={"pointer"}
                onSelect={(e) => console.log(e)}
              >
                <Box fontSize={["12px", "14px"]}>{item.tags}</Box>
                <Box>
                  <Highlighter
                    highlightClassName={styles["highlightTextStyle"]}
                    searchWords={searchValue.split(" ")}
                    autoEscape={true}
                    textToHighlight={item.content}
                  />
                </Box>
              </ListItem>
            )}
            renderMenu={(items, value, style) => (
              <List
                children={items}
                maxH={"600px"}
                overflow={"scroll"}
                overflowX={"hidden"}
              />
            )}
            value={searchValue}
            onChange={(e) => {
              setSearchValue(e.target.value);
            }}
            onSelect={(val, item) => {
              onResultSelect({ id: item._id, slug: item.slug });
              queryClient.removeQueries("questionsToSearch");
              onClose();
            }}
          />
          {data && data.docs.length === 0 && searchValue.length > 3 && (
            <Box p={7} fontSize={["md", "lg"]}>
              Hummm... it seems to be no body has asked about this 😐
            </Box>
          )}

          {isLoading && (
            <Center m={4}>
              <Spinner size={"lg"} />
            </Center>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}
