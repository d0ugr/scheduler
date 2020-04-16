import React, { useState, useEffect, useCallback } from "react";
import Axios from "axios";

import DayList     from "./DayList";
import Appointment from "components/Appointment";
import * as select from "helpers/selectors";

import "components/Application.scss";



export default function Application(_props) {

  // Default values for various states:
  //    Components should have checks for nulls.
  const defaultState = {
    selectedDay:  null,
    days:         null,
    appointments: null,
    schedule:     null
  };

  // The state of things:
  const [ state, setState ] = useState(defaultState);

  // Generic state updating function:
  //    If data is falsey, the state is reset to default.
  //    Data should otherwise be an object.  If it contains "name" and "value" properties,
  //    (i.e. from <input> attributes) those are used to set the value as a
  //    "name: value" property in the state object.
  //    Otherwise, the object is simply copied into the state object.
  //    Existing properties will be updated if they exist.
  const updateState = useCallback((data) => {
    setState((prev) =>
      (data ? {
        ...prev,
        ...(data.name && data.value ? { [data.name]: data.value } : data)
      } : defaultState)
    );
  }, [ defaultState ]);

  // Load data from the API server on initial page load
  //    and save it in the state object:
  useEffect(() => {
    //console.log("useEffect: Initial page load");
    Promise.all([
      Axios.get("/api/days"),
      Axios.get("/api/appointments"),
      Axios.get("/api/interviewers")
    ])
    .then((res) => {
      updateState({
        days:         res[0].data,
        appointments: res[1].data,
        interviewers: res[2].data
      })
    })
    .catch((err) => console.log(err));
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Update the schedule if the selected day or appointments data change:
  useEffect(() => {
    //console.log("useEffect: state.selectedDay, state.appointments");
    updateState({
      schedule: select.getAppointmentsForDay(state, state.selectedDay).map((appointment, _index) => {
        return (
          <Appointment
            key={appointment.id}
            time={appointment.time}
            interview={select.getInterview(state, appointment.interview)}
          />
        );
      })
    })
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ state.selectedDay, state.appointments ]);

  // Return application stuff to render:
  return (
    <main className="layout">
      <section className="sidebar">
        <img
          className="sidebar--centered"
          src="images/logo.png"
          alt="Interview Scheduler"
        />
        <hr className="sidebar__separator sidebar--centered" />
        <nav className="sidebar__menu">
          <DayList
            days={state.days}
            selectedDay={state.selectedDay}
            setDay={day => updateState({ selectedDay: day })}
          />
        </nav>
        <img
          className="sidebar__lhl sidebar--centered"
          src="images/lhl.png"
          alt="Lighthouse Labs"
        />
      </section>
      <section className="schedule">
        {state.schedule}
      </section>
    </main>
  );

}
