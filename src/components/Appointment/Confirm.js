// Confirm.js
//
// React component that prompts for confirmation.
// Currently only used for deletion.

import React from "react";

import Button from "../Button";

// Confirm component definition.
//
//    props.message     String:   Message to display describing the action being taken.
//    props.onConfirm   Function: Confirm button callback.
//    props.onCancel    Function: Cancel button callback.

export default function Confirm(props) {

  return (
    <main className="appointment__card appointment__card--confirm">
      <h1 className="text--semi-bold">{props.message}</h1>
      <section className="appointment__actions">
        <Button danger onClick={props.onCancel}>Cancel</Button>
        <Button danger onClick={props.onConfirm}>Confirm</Button>
      </section>
    </main>
  );

}
