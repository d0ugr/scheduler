// Show.js
//
// React component that shows a booked interview appointment
//    in the schedule.

import React from "react";

// Show component definition.
//
//    props.student           String:   Student name.
//    props.interviewerName   String:   Interviewer name.
//    props.onEdit            Function: Edit button callback.
//    props.onDelete          Function: Delete button callback.

export default function Show(props) {

  return (
    <main className="appointment__card appointment__card--show">
      <section className="appointment__card-left">
        <h2 className="text--regular">{props.student}</h2>
        <section className="interviewer">
          <h4 className="text--light">Interviewer</h4>
          <h3 className="text--regular">{props.interviewerName}</h3>
        </section>
      </section>
      <section className="appointment__card-right">
        <section className="appointment__actions">
          <img
            className="appointment__actions-button"
            src="images/edit.png"
            alt="Edit"
            onClick={props.onEdit}
          />
          <img
            className="appointment__actions-button"
            src="images/trash.png"
            alt="Delete"
            onClick={props.onDelete}
          />
        </section>
      </section>
    </main>
  );

}
