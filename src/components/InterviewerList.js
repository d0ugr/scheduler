// InterviewerList.js
//
// React component that shows a list of interviewers
//    for an appointment.

import React     from "react";
import PropTypes from "prop-types";

import "./InterviewerList.scss";

import InterviewerListItem from "./InterviewerListItem";

// InterviewerList component definition.
//
//    props.interviewers     Array:    List of available interviewers.
//    props.interviewer      Number:   Currently selected interviewer ID
//    props.setInterviewer   Function: Callback to Form for setting the
//                                       interviewer for an appointment.

export default function InterviewerList(props) {

  // Type checking for props:
  InterviewerList.propTypes = {
    interviewer:    PropTypes.number,
    setInterviewer: PropTypes.func.isRequired
  };

  const interviewerList =
    (props.interviewers || []).map((interviewer, _index) =>
      <InterviewerListItem
        key={interviewer.id}
        name={interviewer.name}
        avatar={interviewer.avatar}
        selected={interviewer.id === props.interviewer}
        setInterviewer={(_event) => props.setInterviewer(interviewer.id)}
      />
    );

  return (
    <section className="interviewers">
      <h4 className="interviewers__header text--light">Interviewer</h4>
      <ul className="interviewers__list">{interviewerList}</ul>
    </section>
  );

}
