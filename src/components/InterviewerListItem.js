// InterviewerListItem.js
//
// React component that shows an interviewer avatar/name
//    in a list of interviewers.

import React      from "react";
import classNames from "classnames";

import "./InterviewerListItem.scss";

// InterviewerListItem component definition.
//
//    props.name             String:   Interviewer name.
//    props.avatar           String:   Interviewer mug shot.
//    props.selected         Boolean:  Whether or not this interviewer is selected.
//    props.setInterviewer   Function: Callback that selects the interviewer when clicked.

export default function InterviewerListItem(props) {

  const interviewerListItemClasses = classNames(
    "interviewers__item", {
    "interviewers__item--selected": props.selected
  });
  const interviewerListItemImageClasses = classNames(
    "interviewers__item-image", {
    "interviewers__item--selected-image": props.selected
  });

  return (
    <li
      className={interviewerListItemClasses}
      onClick={props.setInterviewer}
    >
      <img
        className={interviewerListItemImageClasses}
        src={props.avatar}
        alt={props.name}
      />
      {props.selected && props.name}
    </li>
  );

}
