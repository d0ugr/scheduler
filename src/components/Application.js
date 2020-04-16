import React, { useState, useEffect, useCallback } from "react";
import Axios from "axios";

import DayList     from "./DayList";
import Appointment from "components/Appointment";
import * as select from "helpers/selectors";

import "components/Application.scss";



export default function Application(_props) {

  const defaultState = {
    selectedDay:  null,
    days:         null,
    appointments: null,
    schedule:     null
  };

  const [ state, setState ] = useState(defaultState);

  const updateState = useCallback((data) => {
    setState((prev) =>
      (data ? {
        ...prev,
        ...(data.name && data.value ? { [data.name]: data.value } : data)
      } : defaultState)
    );
  }, [ defaultState ]);

  useEffect(() => {
    console.log("useEffect: Initial page load");
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

  useEffect(() => {
    console.log("useEffect: state.selectedDay, state.appointments");
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
