import React from "react";

import "./styles.scss";

import Header from "./Header";
import Show   from "./Show";
import Empty  from "./Empty";



export default function Appointment(props) {

  return (
    <article>
      <Header time={props.time} />
      {(
        props.interview
        ? <Show student={props.interview.student} interviewerName={props.interview.interviewer.name} />
        : <Empty />
      )}
    </article>
  );

}
