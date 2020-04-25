// DayList.js
//
// React component that shows the list of days
//    and spots remaining in the sidebar.

import React from "react";

import DayListItem from "./DayListItem";

// DayList component definition.
//
//    props.days   Array:   List of day items.

export default function DayList(props) {

  const dayListItems = (props.days || []).map((dayData, _index) =>
    <DayListItem
      key={dayData.id}
      name={dayData.name}
      spots={dayData.spots}
      selected={props.selectedDay === dayData.id}
      setDay={(_event) => props.setDay(dayData.id)}
    />
  );

  return (
    <ul>{dayListItems}</ul>
  );

}



