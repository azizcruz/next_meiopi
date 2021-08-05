import React from "react";
import { useRouter } from "next/router";

import QuestionDetail from "../../../components/Question/QuestionDetail/QuestionDetail";

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
    />
  );
}

export default QuestionDetailPage;
