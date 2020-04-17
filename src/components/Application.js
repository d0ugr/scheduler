// Application.js
//
//    Main application component responsible for rendering everything.

import React from "react";

import DayList     from "./DayList";
import Appointment from "components/Appointment";
import * as select from "helpers/selectors";

import useApplicationData from "../hooks/useApplicationData";

import "components/Application.scss";



export default function Application(_props) {

  //console.log("Application");

  const [ state, setDay, bookInterview, cancelInterview ] = useApplicationData();

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
            setDay={setDay}
          />
        </nav>
        <img
          className="sidebar__lhl sidebar--centered"
          src="images/lhl.png"
          alt="Lighthouse Labs"
        />
      </section>
      <section className="schedule">{
        select.getAppointmentsForDay(state, state.selectedDay)
        .map((appointment, _index) =>
          <Appointment
            key={appointment.id}
            time={appointment.time}
            interview={select.getInterview(state, appointment.interview)}
            interviewers={select.getInterviewersForDay(state, state.selectedDay)}
            bookInterview={(interview) => bookInterview(appointment.id, interview)}
            cancelInterview={() => cancelInterview(appointment.id)}
          />
        )}
      </section>
    </main>
  );

}
