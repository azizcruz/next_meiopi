import React, { useState } from "react";
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
  Menu,
  MenuList,
  MenuItem,
} from "@chakra-ui/react";
import { BsSearch } from "react-icons/bs";
import { AiOutlineEnter } from "react-icons/ai";
import { BiHash } from "react-icons/bi";
import {
  AutoComplete,
  AutoCompleteInput,
  AutoCompleteItem,
  AutoCompleteList,
} from "@choc-ui/chakra-autocomplete";

import { useRouter } from "next/router";

export default function SearchButton() {
  const options = [{ option: "apple", link: "ygaysf" }];
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [searchValue, setSearchValue] = useState("");
  const router = useRouter();

  const onQuestionClick = (option) => {
    router.push(
      "/questions/61220949f072743342af2944/wswslmmslwmlsmws?bgColor=#f44336"
    );
  };
  return (
    <>
      <IconButton
        onClick={onOpen}
        icon={<BsSearch />}
        position={"fixed"}
        right={1}
        top={1}
        w={["50px", "60px", "80px"]}
        h={["50px", "60px", "80px"]}
        backgroundColor={"#2c3e50"}
        fontSize={[20, 40, 45]}
        _focus={{ border: 0 }}
        _active={{ backgroundColor: "#2c3e50" }}
        _hover={{ backgroundColor: "#2c3e50" }}
        type={"button"}
      />

      <Modal isOpen={isOpen} onClose={onClose} size={"xl"}>
        <ModalOverlay />
        <ModalContent>
          <Stack direction="column">
            <AutoComplete
              rollNavigation
              onSelectOption={(option) => {
                onClose();
              }}
              closeOnselect={true}
              emptyState={() => (
                <Box p={2} textAlign={"center"}>
                  No data found
                </Box>
              )}
            >
              <Box>
                <AutoCompleteInput
                  variant="filled"
                  autoFocus
                  _focus={{ border: 0 }}
                  backgroundColor={"transparent"}
                  m={0}
                  _hover={{
                    backgroundColor: "transparent",
                  }}
                  size={"lg"}
                />
                <AutoCompleteList w={"100%"} borderRadius={0}>
                  {options.map((option, oid) => (
                    <AutoCompleteItem
                      key={`option-${oid}`}
                      value={option.option}
                      textTransform="capitalize"
                      onClick={() => onQuestionClick(option)}
                    >
                      {option.option}
                    </AutoCompleteItem>
                  ))}
                </AutoCompleteList>
              </Box>
            </AutoComplete>
          </Stack>
        </ModalContent>
      </Modal>
    </>
  );
}
