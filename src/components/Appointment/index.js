// index.js (Appointment)
//
// React component that shows an interview appointment.
//    This component has various modes that determine what is displayed,
//    and transitions between them (handled by the useVisualMode hook).

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

// Appointment component definition.
//
//    props.time              String:   Appointment time to show in the Header.
//    props.interview         Object:   Appointment information.
//    props.interviewers      Array:    List of interviewers available for the timeslot.
//    props.bookInterview     Function: Callback that adds or updates an appointment in the database.
//    props.cancelInterview   Function: Callback that deletes an appointment from the database.

export default function Appointment(props) {

  // Set up the mode state and transition handling hook.
  // Possible mode transitions:
  //    EMPTY -> CREATE -> SAVING -> SHOW | ERROR_SAVE -> EMPTY
  //    SHOW  -> EDIT   -> SAVING -> SHOW | ERROR_SAVE -> SHOW
  //    SHOW  -> CONFIRM_DELETE -> DELETING -> EMPTY | ERROR_DELETE -> SHOW
  const { mode, transition, back } = useVisualMode(props.interview ? vm.SHOW : vm.EMPTY);

  // React effect that avoids stale mode state:
  useEffect(() => {
    if (props.interview !== null && mode === vm.EMPTY) {
      transition(vm.SHOW);
    } else if (props.interview === null && mode === vm.SHOW) {
      transition(vm.EMPTY);
    }
  }, [ props.interview, mode, transition ]);

  // Called to handle saving an appointment:
  function save(name, interviewer) {
    transition(vm.SAVING);
    props.bookInterview({
      student: name,
      interviewer
    }).then(() => transition(vm.SHOW, true))
      .catch((_err) => {
        transition(vm.ERROR_SAVE, true);
      });
  }

  // Called to handle deleting an appointment:
  function destroy() {
    transition(vm.DELETING, true);
    props.cancelInterview()
      .then(() => transition(vm.EMPTY, true))
      .catch((_err) => {
        transition(vm.ERROR_DELETE, true);
      });
  }

  // Render the appropriate appointment view:
  return (
    <article data-testid="appointment">
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
