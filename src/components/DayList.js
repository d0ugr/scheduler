import React from "react";

import DayListItem from "./DayListItem";



export default function DayList(props) {

  const dayListItems = props.days.map((dayData, _index) =>
    <DayListItem
      key={dayData.id}
      name={dayData.name}
      spots={dayData.spots}
      selected={props.selectedDay === dayData.name}
      setDay={props.setDay}
    />
  );

  return (
    <ul>{dayListItems}</ul>
  );

}



