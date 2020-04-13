import React from "react";

import DayListItem from "./DayListItem";



export default function DayList(props) {

  const dayListItems = props.days.map((dayData, index) => {
    return <DayListItem key={index} {...dayData} setDay={props.setDay} />;
  });

  return (
    <ul>{dayListItems}</ul>
  );

}



