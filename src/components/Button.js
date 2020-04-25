// Button.js
//
// React component that shows a button.

import React      from "react";
import classNames from "classnames";

import "./Button.scss";

// Show component definition.
//
//    props.confirm    Boolean:  Sets a positive style.
//    props.danger     Boolean:  Sets a negative style.
//    props.disabled   Boolean:  Sets a disabled style.
//    props.onClick    Function: Button click callback.

export default function Button(props) {

  let buttonClasses = classNames("button", {
    "button--confirm": props.confirm,
    "button--danger":  props.danger
  });

  return (
    <button
      className={buttonClasses}
      disabled={props.disabled}
      onClick={props.onClick}
    >
      {props.children}
    </button>
  );

}
