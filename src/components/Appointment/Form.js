import React, { useState } from "react";

import InterviewerList from "../InterviewerList";
import Button          from "../Button";



export default function Form(props) {

  const defaultState = {
    studentName:   "",
    interviewerId: null
  };

  const [ state, setState ] = useState({
    studentName:   props.name        || "",
    interviewerId: props.interviewer || null
  });

  const updateState = (data) => {
    setState((prev) => (data ? {
      ...prev,
      ...(data.name && data.value ? { [data.name]: data.value } : data)
    } : defaultState));
  };

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
          <Button danger onClick={() => {
            updateState(null);
            props.onCancel();
          }}>Cancel</Button>
          <Button confirm onClick={props.onSave}>Save</Button>
        </section>
      </section>
    </main>
  );

}
