import React, { useEffect } from "react";

import "./styles.scss";

import Header  from "./Header";
import Show    from "./Show";
import Empty   from "./Empty";
import Form    from "./Form";
import Status  from "./Status";
import Confirm from "./Confirm";
import Error   from "./Error";

import useVisualMode from "../../hooks/useVisualMode";

const EMPTY          = "EMPTY";
const SHOW           = "SHOW";
const CREATE         = "CREATE";
const EDIT           = "EDIT";
const SAVING         = "SAVING";
const CONFIRM_DELETE = "CONFIRM_DELETE";
const DELETING       = "DELETING";
const ERROR_SAVE     = "ERROR_SAVE";
const ERROR_DELETE   = "ERROR_DELETE";



export default function Appointment(props) {

  //console.log("Appointment");

  const { mode, transition, back } = useVisualMode(props.interview ? SHOW : EMPTY);

  useEffect(() => {
    transition(props.interview ? SHOW : EMPTY);
  }, [ props.interview ]);

  function save(name, interviewer) {
    transition(SAVING);
    props.bookInterview({
      student: name,
      interviewer
    }).then(() => transition(SHOW, true))
      .catch((_err) => {
        //console.log("saveInterview:", err)
        transition(ERROR_SAVE, true);
      });
  }

  function destroy() {
    transition(DELETING, true);
    props.cancelInterview()
      .then(() => transition(EMPTY, true))
      .catch((_err) => {
        //console.log("deleteInterview:", err)
        transition(ERROR_DELETE, true);
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
          onEdit={() => transition(EDIT)}
          onDelete={() => transition(CONFIRM_DELETE)}
        />
      }
      {mode === CREATE &&
        <Form
          interviewers={props.interviewers}
          onSave={save}
          onCancel={back}
        />
      }
      {mode === EDIT &&
        <Form
          name={props.interview.student}
          interviewer={props.interview.interviewer.id}
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
      {mode === CONFIRM_DELETE &&
        <Confirm
          message={"Are you super duper sure you want to nuke this interview?"}
          onConfirm={destroy}
          onCancel={back}
        />
      }
      {mode === DELETING &&
        <Status
          message={"Deleting..."}
        />
      }
      {mode === ERROR_SAVE &&
        <Error
          message={"Server does not like to save."}
          onClose={back}
        />
      }
      {mode === ERROR_DELETE &&
        <Error
          message={"Server does not like to delete."}
          onClose={back}
        />
      }
    </article>
  );

}
