import React      from "react";
import classNames from "classnames";

import "./Button.scss";



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
