import React from "react";

import InterviewerList from "../InterviewerList";
import Button          from "../Button";

import useStateObject from "../../hooks/useStateObject";



export default function Form(props) {

  // The state of things:
  //    Initial default values are set here.
  //    Components should have checks for nulls.
  const { state, updateState } = useStateObject({
    studentName:   props.name        || "",
    interviewerId: props.interviewer || null
  });

  // Return the form to render:
  return (
    <main className="appointment__card appointment__card--create">
      <section className="appointment__card-left">
        <form autoComplete="off" onSubmit={event => event.preventDefault()}>
          <input
            className="appointment__create-input text--semi-bold"
            type="text"
            name="studentName"
            value={state.studentName}
            placeholder="Enter student name"
            autoFocus
            onFocus={(event) => event.target.select()}
            onChange={(event) => updateState(event.target)}
          />
        </form>
        <InterviewerList
          interviewers={props.interviewers}
          interviewer={state.interviewerId}
          setInterviewer={(interviewerId) => updateState({ interviewerId })}
        />
      </section>
      <section className="appointment__card-right">
        <section className="appointment__actions">
          <Button danger
            onClick={props.onCancel}
          >Cancel</Button>
          <Button confirm
            onClick={() => props.onSave(state.studentName, state.interviewerId)}
          >Save</Button>
        </section>
      </section>
    </main>
  );

}
