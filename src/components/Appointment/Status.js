// Status.js
//
// React component that shows a spinner and the current status
//    of an operation, such as saving or deleting.

import React from "react";

// Show component definition.
//
//    props.message   String: Status message to display.

export default function Status(props) {

  return (
    <main className="appointment__card appointment__card--status">
      <img
        className="appointment__status-image"
        src="images/status.png"
        alt="Loading"
      />
      <h1 className="text--semi-bold">{props.message}</h1>
    </main>
  );

}
