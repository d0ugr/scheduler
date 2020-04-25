// Header.js
//
// React component shown above each interview appointment in the schedule.
//    Displays the appointment time and a divider.

import React from "react";

// Header component definition.
//
//    props.time   String: Appointment time to show.

export default function Header(props) {

  return (
    <header className="appointment__time">
      <h4 className="text--semi-bold">{props.time}</h4>
      <hr className="appointment__separator" />
    </header>
  );

}
