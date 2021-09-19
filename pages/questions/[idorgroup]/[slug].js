import React from "react";
import { useRouter } from "next/router";

import QuestionDetail from "../../../components/Question/QuestionDetail/QuestionDetail";
import * as api from "../../../api-services/api";

function QuestionDetailPage(props) {
  const router = useRouter();
  const { idorgroup, slug } = router.query;
  const hash = router.asPath.split("#")[1];

  return (
    <QuestionDetail
      id={idorgroup}
      slug={slug}
      socket={props.socket}
      hash={`#${hash}`}
      router={router}
      openedPost={props.openedPost}
    />
  );
}

export async function getServerSideProps(context) {
  const openedPost = await api.getSingleQuestion({
    postId: context.params.idorgroup,
    slug: context.params.slug,
  });


  return {
    props: {
      openedPost: openedPost,
    }, // will be passed to the page component as props
  };
}

export default QuestionDetailPage;
