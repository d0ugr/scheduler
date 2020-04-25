// Empty.js
//
// React component shown for an empty interview appointment time slot.

import React from "react";

// Empty component definition.
//
//    props.onAdd   Function: Add button callback.

export default function Empty(props) {

  return (
    <main className="appointment__add">
      <img
        className="appointment__add-button"
        src="images/add.png"
        alt="Add"
        onClick={props.onAdd}
      />
    </main>
  );

}
