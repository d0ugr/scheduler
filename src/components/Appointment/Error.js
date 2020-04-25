// Error.js
//
// React component shown when an error occurs for an action
//    being taken on an interview appointment.

import React from "react";

// Error component definition.
//
//    props.message   String:   Message to display describing the error that occurred.
//    props.onClose   Function: Close button callback.

export default function Error(props) {

  return (
    <main className="appointment__card appointment__card--error">
      <section className="appointment__error-message">
        <h1 className="text--semi-bold">Error</h1>
        <h3 className="text--light">{props.message}</h3>
      </section>
      <img
        className="appointment__error-close"
        src="images/close.png"
        alt="Close"
        onClick={props.onClose}
      />
    </main>
  );

}
