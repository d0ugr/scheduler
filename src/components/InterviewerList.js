import React     from "react";
import PropTypes from "prop-types";

import "./InterviewerList.scss";

import InterviewerListItem from "./InterviewerListItem";



export default function InterviewerList(props) {

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
