import React, { useState } from "react";

import InterviewerList from "../InterviewerList";
import Button          from "../Button";



export default function Form(props) {

  // Default values for various states:
  //    Components should have checks for nulls.
  const defaultState = {
    studentName:   "",
    interviewerId: null
  };

  // The state of things:
  const [ state, setState ] = useState({
    studentName:   props.name        || "",
    interviewerId: props.interviewer || null
  });

  // Generic state updating function:
  //    If data is falsey, the state is reset to default.
  //    Data should otherwise be an object.  If it contains "name" and "value" properties,
  //    (i.e. from <input> attributes) those are used to set the value as a
  //    "name: value" property in the state object.
  //    Otherwise, the object is simply copied into the state object.
  //    Existing properties will be updated if they exist.
  const updateState = (data) => {
    setState((prev) => (data ? {
      ...prev,
      ...(data.name && data.value ? { [data.name]: data.value } : data)
    } : defaultState));
  };

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
          <Button
            danger
            onClick={() => {
              updateState(null);
              props.onCancel();
            }}
          >
            Cancel
          </Button>
          <Button
            confirm
            onClick={() =>
              props.onSave(state.studentName, state.interviewerId)
            }
          >
            Save
          </Button>
        </section>
      </section>
    </main>
  );

}
