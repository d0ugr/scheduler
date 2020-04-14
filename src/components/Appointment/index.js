import React      from "react";
import classNames from "classnames";

import "./styles.scss";



export default function Appointment(props) {

  let apptClasses = classNames("appointment", {
  });

  return <article className={apptClasses}></article>;

}
