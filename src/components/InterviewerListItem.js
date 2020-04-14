import React      from "react";
import classNames from "classnames";

import "./InterviewerListItem.scss";



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
