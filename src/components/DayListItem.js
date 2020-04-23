import React      from "react";
import classNames from "classnames";

import "./DayListItem.scss";



const formatSpots = function(spots) {
  return (
    !spots || (spots === 0)
    ? "no spots remaining"
    : `${spots} spot${spots === 1 ? "" : "s"} remaining`
  );
};

export default function DayListItem(props) {

  const dayListItemClasses = classNames("day-list__item", {
    "day-list__item--selected": props.selected,
    "day-list__item--full":     props.spots === 0
  });

  return (
    <li
      className={dayListItemClasses}
      onClick={props.setDay}
      data-testid="day"
    >
      <h2 className="text--regular">{props.name}</h2>
      <h3 className="text--light">{formatSpots(props.spots)}</h3>
    </li>
  );

}
