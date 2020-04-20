import React, { useEffect } from "react";

import "./styles.scss";

import Header  from "./Header";
import Show    from "./Show";
import Empty   from "./Empty";
import Form    from "./Form";
import Status  from "./Status";
import Confirm from "./Confirm";
import Error   from "./Error";

import useVisualMode, * as vm from "../../hooks/useVisualMode";



export default function Appointment(props) {

  //console.log("Appointment");

  const { mode, transition, back } = useVisualMode(props.interview ? vm.SHOW : vm.EMPTY);
  console.log("Appointment", mode, props.interview);

  useEffect(() => {
    console.log("Appointment: useEffect", mode, props.interview);
    if (props.interview !== null && mode === vm.EMPTY) {
      console.log("transition: SHOW");
      transition(vm.SHOW);
    } else if (props.interview === null && mode === vm.SHOW) {
      console.log("transition: EMPTY");
      transition(vm.EMPTY);
    }
  }, [ props.interview, mode, transition ]);

  function save(name, interviewer) {
    transition(vm.SAVING);
    props.bookInterview({
      student: name,
      interviewer
    }).then(() => transition(vm.SHOW, true))
      .catch((_err) => {
        //console.log("saveInterview:", err)
        transition(vm.ERROR_SAVE, true);
      });
  }

  function destroy() {
    transition(vm.DELETING, true);
    props.cancelInterview()
      .then(() => transition(vm.EMPTY, true))
      .catch((_err) => {
        //console.log("deleteInterview:", err)
        transition(vm.ERROR_DELETE, true);
      });
  }

  return (
    <article>
      <Header time={props.time} />
      {mode === vm.EMPTY &&
        <Empty
          onAdd={() => transition(vm.CREATE)}
        />
      }
      {mode === vm.SHOW &&
        <Show
          student={props.interview && props.interview.student}
          interviewerName={props.interview && props.interview.interviewer.name}
          onEdit={() => transition(vm.EDIT)}
          onDelete={() => transition(vm.CONFIRM_DELETE)}
        />
      }
      {mode === vm.CREATE &&
        <Form
          interviewers={props.interviewers}
          onSave={save}
          onCancel={back}
        />
      }
      {mode === vm.EDIT &&
        <Form
          name={props.interview.student}
          interviewer={props.interview.interviewer.id}
          interviewers={props.interviewers}
          onSave={save}
          onCancel={back}
        />
      }
      {mode === vm.SAVING &&
        <Status
          message={"Saving..."}
        />
      }
      {mode === vm.CONFIRM_DELETE &&
        <Confirm
          message={"Are you super duper sure you want to nuke this interview?"}
          onConfirm={destroy}
          onCancel={back}
        />
      }
      {mode === vm.DELETING &&
        <Status
          message={"Deleting..."}
        />
      }
      {mode === vm.ERROR_SAVE &&
        <Error
          message={"Server does not like to save."}
          onClose={back}
        />
      }
      {mode === vm.ERROR_DELETE &&
        <Error
          message={"Server does not like to delete."}
          onClose={back}
        />
      }
    </article>
  );

}
