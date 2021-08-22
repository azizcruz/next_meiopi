import { useCookies } from "react-cookie";
import {
  Image,
  useDisclosure,
  Modal,
  ModalBody,
  ModalHeader,
  ModalCloseButton,
  ModalFooter,
  ModalContent,
  ModalOverlay,
  Button,
  Text,
  Input,
  Textarea,
  useToast,
  Switch,
  FormLabel,
  Tooltip,
  Spinner,
  IconButton,
  Box,
  Flex,
} from "@chakra-ui/react";
import React, { useState, useEffect } from "react";
import "./../../../styles/QuestionFormsStyles.module.scss";
import "react-widgets/styles.css";

import CustomCheckbox from "../../Forms/CustomCheckbox/CustomCheckbox";
import { useStoreState, useStoreActions } from "easy-peasy";
import _ from "lodash";
import serialize from "form-serialize";
import * as yup from "yup";
import { BiEdit } from "react-icons/bi";
import { useMutation, useQuery, useQueryClient } from "react-query";
import * as api from "../../../api-services/api";

let schema = yup.object().shape({
  content: yup.string().required(),
  tags: yup.string().required(),
  hasPoll: yup.boolean().optional().default(false),
});

export default function EditQuestionCard(props) {
  const queryClient = useQueryClient();
  const tags = queryClient.getQueryData("tags") || [];
  const {
    isLoading,
    mutate: editQuestion,
    isError,
    error,
  } = useMutation(api.editQuestion, {
    onSuccess: () => {
      onClose();
      toast({
        title: "Your question was updated",
        status: "success",
        duration: 2000,
        isClosable: true,
      });
    },
  });

  if (isError) {
    toast({
      title: "Something went wrong, try again later",
      status: "error",
      duration: 2000,
      isClosable: true,
    });
  }

  let [currentOptionsNumber, setCurrentOptionsNumber] = React.useState(
    props.poll ? props.poll.options.length : 2
  );
  let [pollIncluded, setPollIncluded] = React.useState(props.hasPoll);
  let [tagsString, setTagsString] = React.useState(props.tags);
  let [errors, setErrors] = React.useState({});
  const fetchedTags = useStoreState((state) => state.listOfTags);
  const tagsLoading = useStoreState((state) => state.tagsLoading);
  const userIsLoggedIn = useStoreState((state) => state.userIsLoggedIn);
  const signedInUser = useStoreState((state) => state.signedInUser);

  const [remain, setRemain] = useState(200 - props.content.length);
  const toast = useToast();

  const checkRemain = (e, defaultContent = false) => {
    let countedLetters = e.target.value.length;
    let remainedLetters = 200 - countedLetters;
    setRemain(remainedLetters);
  };

  let x = props.tags
    .split("#")
    .splice(1, 2)
    .map((x) => {
      return { label: "#" + x.trim(), isChecked: true };
    });

  let [listOfTags, setListOfTags] = React.useState(x);

  const { isOpen, onOpen, onClose } = useDisclosure();
  const btnRef = React.useRef();

  const addToHiddenInput = (listOfTags) => {
    let tagsInput = document.getElementById("tagsInput2");
    let str = "";

    listOfTags.map((el) => {
      if (el.isChecked) {
        if (str == "") str += el.label;
        else str += "-" + el.label;
      }
    });
    const countTags = (str, ch) => _.countBy(str)[ch] || 0;
    if (countTags(str, "#") >= 2) {
      str = str.split("-");
      str = str[0] + str[1];
    }
    setTagsString(str);
  };

  const setUpListOfTags = (label) => {
    let temp = listOfTags;
    let found = temp.some((el) => el.label === label.label);
    if (!found) {
      temp.push(label);
    } else {
      temp = temp.map((el) => {
        if (el.label === label.label) {
          el.isChecked = !el.isChecked;
          return el;
        }
        return el;
      });
    }
    setListOfTags([...temp]);
    addToHiddenInput(listOfTags);
  };

  const checkAddedTags = () => {
    return listOfTags.filter((tag) => tag.isChecked);
  };

  const onSubmit = (e) => {
    e.preventDefault();
    const form = e.currentTarget;
    const body = serialize(form, { hash: true, empty: true });
    if (!body.hasPoll) {
      body.hasPoll = false;
    }
    schema
      .validate(body)
      .then(async (data) => {
        let pollPayload = {};

        if (data.hasPoll) {
          let question = document.getElementById("poll-question-input").value;
          let options = document.querySelectorAll(".poll-option");

          if (question.length < 5) {
            throw new yup.ValidationError(
              "Question must be at least 12 characters",
              "Question is required",
              "question"
            );
          }

          if (options[0].value.length === 0 || options[1].value.length === 0) {
            throw new yup.ValidationError(
              "At least two options must be given",
              "At least two options must be given",
              "option"
            );
          }

          pollPayload.question = question;
          pollPayload.options = [];

          for (let i = 0; i < options.length; i++) {
            let option = options[i];
            pollPayload.options.push({ option: option.value });
          }

          let optionValues = pollPayload.options.map((option) => option.option);
          let hasDuplicates = optionValues.some(function (item, idx) {
            return optionValues.indexOf(item) != idx;
          });

          if (hasDuplicates) {
            throw new yup.ValidationError(
              "Duplicated options are not allowed",
              "Duplicated options are not allowed",
              "option"
            );
          }

          data.poll = { ...pollPayload };
        }

        editQuestion({ payload: data, postId: props.postId });
      })
      .catch((err) => {
        let errors = JSON.parse(JSON.stringify(err));
        console.log(err);
        setErrors(errors);
      });
  };

  const generatePollOptions = () => {
    let options = [];
    for (let i = 0; i < currentOptionsNumber; i++) {
      if (i < 6) {
        options.push(
          <Box>
            Option #{i + 1}
            <Input
              key={i}
              placeholder={`option #${i + 1}`}
              mb={"2"}
              className={`poll-option`}
              defaultValue={
                props.poll
                  ? props.poll.options[i] !== undefined
                    ? props.poll.options[i].option
                    : ""
                  : ""
              }
            />
          </Box>
        );
      }
    }

    return options;
  };

  useEffect(() => {
    return () => {};
  }, []);
  return (
    <>
      <IconButton
        fontSize={["xs", "sm", "md", "lg"]}
        minW={["25px", "40px"]}
        h={["25px", "40px"]}
        icon={<BiEdit />}
        onClick={onOpen}
      />

      <Modal
        onClose={() => {
          onClose();
        }}
        finalFocusRef={btnRef}
        isOpen={isOpen}
        scrollBehavior={"inside"}
        motionPreset="slideInBottom"
        size={"xl"}
      >
        <ModalOverlay />
        {true && (
          <Box position={"absolute"} top={2} right={2} zIndex={9999}>
            <Box as={"span"}>Updating your question</Box> <Spinner size="md" />
          </Box>
        )}
        <ModalContent>
          <ModalHeader
            display="flex"
            alignItems="center"
            justifyContent="center"
          >
            <Text mr={1}>Edit post</Text> <BiEdit />
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody minH={"325px"}>
            <Text>
              Post as {userIsLoggedIn ? signedInUser.username : "Anonymous"}
            </Text>
            <form onSubmit={onSubmit} id={"editPostForm"}>
              <Text mb="8px">Describe your problem</Text>
              <Textarea
                placeholder="Here is a sample placeholder"
                size="sm"
                rows={"5"}
                resize={"none"}
                autoFocus={true}
                isInvalid={false}
                name={"content"}
                onChange={checkRemain}
                defaultValue={props.content}
                onFocus={function (e) {
                  var val = e.target.value;
                  e.target.value = "";
                  e.target.value = val;
                }}
              />
              <Box
                mr={4}
                color={remain < 0 ? "red.400" : ""}
                position={"relative"}
                float={"right"}
                bottom={"35px"}
                left={"7px"}
              >
                {remain}
              </Box>

              {errors?.path === "content" && (
                <Text
                  bg={"red.400"}
                  color={"white"}
                  fontWeight={"bold"}
                  p={2}
                  mb={2}
                  mt={-2}
                >
                  {errors.message}
                </Text>
              )}

              <FormLabel htmlFor="email-alerts" mb="0">
                Include a poll ?
              </FormLabel>
              <Switch
                isChecked={pollIncluded}
                onChange={(e) => {
                  setPollIncluded(!pollIncluded);
                  setCurrentOptionsNumber(2);
                  console.log(e.target.value);
                }}
                name={"hasPoll"}
                value={pollIncluded}
                colorScheme={"green"}
                mt={2}
                mb={2}
              />

              {pollIncluded ? (
                <Box mb={2}>
                  Question
                  <Input
                    placeholder={"your question"}
                    mb={"2"}
                    id={"poll-question-input"}
                    defaultValue={props.poll.question}
                  />
                  {errors?.path === "question" && (
                    <Text
                      bg={"red.400"}
                      color={"white"}
                      fontWeight={"bold"}
                      p={2}
                      mb={2}
                      mt={-2}
                    >
                      {errors.message}
                    </Text>
                  )}
                  {generatePollOptions().map((option, key) => {
                    return <Box key={key}>{option}</Box>;
                  })}
                  {errors?.path === "option" && (
                    <Text
                      bg={"red.400"}
                      color={"white"}
                      fontWeight={"bold"}
                      p={2}
                      mb={2}
                      mt={-2}
                    >
                      {errors.message}
                    </Text>
                  )}
                  {currentOptionsNumber < 6 ? (
                    <Button
                      onClick={() =>
                        setCurrentOptionsNumber(currentOptionsNumber + 1)
                      }
                      mr={"2"}
                    >
                      +
                    </Button>
                  ) : (
                    ""
                  )}
                  {currentOptionsNumber > 2 ? (
                    <Button
                      onClick={() =>
                        setCurrentOptionsNumber(currentOptionsNumber - 1)
                      }
                    >
                      -
                    </Button>
                  ) : (
                    ""
                  )}
                </Box>
              ) : (
                ""
              )}

              <Text mb="8px">Tag groups (two groups maximum)</Text>

              <Input
                type={"text"}
                fontWeight={"bold"}
                name="tags"
                id="tagsInput2"
                value={tagsString}
                readOnly
              ></Input>

              {errors?.path === "tags" && (
                <Text
                  bg={"red.400"}
                  color={"white"}
                  fontWeight={"bold"}
                  p={2}
                  mb={2}
                >
                  {errors.message}
                </Text>
              )}

              {tagsLoading ? (
                "Loading"
              ) : (
                <Flex wrap={"wrap"} mt={2}>
                  {tags.map((tag, key) => {
                    if (
                      tagsString.indexOf(tag.name) === -1 &&
                      checkAddedTags().length >= 2
                    ) {
                      return (
                        <CustomCheckbox
                          key={key}
                          label={tag.name}
                          checkboxChange={(label) => setUpListOfTags(label)}
                          listOfTags={listOfTags}
                          cannotBeChecked={true}
                        />
                      );
                    } else {
                      return (
                        <CustomCheckbox
                          key={key}
                          label={tag.name}
                          checkboxChange={(label) => setUpListOfTags(label)}
                          checked={tagsString.includes(tag.name)}
                          listOfTags={listOfTags}
                        />
                      );
                    }
                  })}
                </Flex>
              )}

              <Button
                float={"right"}
                mb={"2"}
                mt={2}
                bg={"teal.400"}
                type={"submit"}
                color={"white"}
                _hover={{ backgroundColor: "teal" }}
                disabled={remain < 0 || remain === 300}
              >
                Confirm
              </Button>
            </form>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
}
