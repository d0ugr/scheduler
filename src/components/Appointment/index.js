import React from "react";

import "./styles.scss";

import Header  from "./Header";
import Show    from "./Show";
import Empty   from "./Empty";
import Form    from "./Form";
import Status  from "./Status";
import Confirm from "./Confirm";

import useVisualMode from "../../hooks/useVisualMode";

const EMPTY         = "EMPTY";
const SHOW           = "SHOW";
const CREATE         = "CREATE";
const SAVING         = "SAVING";
const CONFIRM_DELETE = "CONFIRM_DELETE";
const DELETING       = "DELETING";



export default function Appointment(props) {

  //console.log("Appointment", props);

  const { mode, transition, back } = useVisualMode(props.interview ? SHOW : EMPTY);

  function saveInterview(name, interviewer) {
    //console.log("saveInterview:", name, interviewer);
    transition(SAVING);
    props.bookInterview({
      student: name,
      interviewer
    }).then(() => transition(SHOW))
      .catch((err) => {
        console.log("saveInterview: ERROR", err)
        //transition(ERROR);
      });
  }

  function deleteInterview() {
    //console.log("deleteInterview");
    transition(DELETING);
    props.deleteInterview()
      .then(() => transition(EMPTY))
      .catch((err) => {
        console.log("deleteInterview: ERROR", err)
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
          // onEdit={() => edit(props.id)}
          onDelete={() => transition(CONFIRM_DELETE)}
        />
      }
      {mode === CREATE &&
        <Form
          interviewers={props.interviewers}
          onSave={saveInterview}
          onCancel={back}
        />
      }
      {mode === SAVING &&
        <Status
          message={"Saving..."}
        />
      }
      {mode === CONFIRM_DELETE &&
        <Confirm
          message={"Are you super duper sure you want to nuke this interview?"}
          onConfirm={deleteInterview}
          onCancel={back}
        />
      }
      {mode === DELETING &&
        <Status
          message={"Deleting..."}
        />
      }
    </article>
  );

}
