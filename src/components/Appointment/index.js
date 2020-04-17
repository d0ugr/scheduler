import React from "react";

import "./styles.scss";

import Header from "./Header";
import Show   from "./Show";
import Empty  from "./Empty";
import Form   from "./Form";
import Status from "./Status";

import useVisualMode from "../../hooks/useVisualMode";

const EMPTY  = "EMPTY";
const SHOW   = "SHOW";
const CREATE = "CREATE";
const SAVING = "SAVING";



export default function Appointment(props) {

  //console.log("Appointment", props);

  const { mode, transition, back } = useVisualMode(props.interview ? SHOW : EMPTY);

  function save(name, interviewer) {
    //console.log("save:", name, interviewer);
    transition(SAVING);
    props.bookInterview({
      student: name,
      interviewer
    })
    .then(() => transition(SHOW))
    .catch((err) => {
      console.log("save: catch", err)
      //transition(ERROR);
    });
  }

  return (
    <article>
      <Header time={props.time} />
      {mode === EMPTY &&
        <Empty
          onAdd={() => transition(CREATE)}
        />
      }
      {mode === SHOW &&
        <Show
          student={props.interview.student}
          interviewerName={props.interview.interviewer.name}
        />
      }
      {mode === CREATE &&
        <Form
          interviewers={props.interviewers}
          onSave={save}
          onCancel={back}
        />
      }
      {mode === SAVING &&
        <Status
          message={"Saving..."}
        />
      }
    </article>
  );

}
