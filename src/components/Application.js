import React, { useEffect } from "react";
import Axios from "axios";

import DayList     from "./DayList";
import Appointment from "components/Appointment";
import * as select from "helpers/selectors";

import useStateObject from "../hooks/useStateObject";

import "components/Application.scss";



export default function Application(_props) {

  // The state of things:
  //    Default values are passed here.
  //    Components should have checks for nulls.
  const { state, updateState } = useStateObject({
    selectedDay:  null,
    days:         null,
    appointments: null,
    schedule:     null
  });

  // Load data from the API server on initial page load
  //    and save it in the state object:
  useEffect(() => {
    //console.log("useEffect: Page load");
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
    //console.log("useEffect: state.selectedDay:", state);
    updateSchedule();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ state.selectedDay ]);

  useEffect(() => {
    //console.log("useEffect: state.appointments:", state);
    updateSchedule();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ state.appointments ]);

  const updateSchedule = () => {
    //console.log("updateSchedule");
    updateState({
        schedule: select.getAppointmentsForDay(state, state.selectedDay).map((appointment, _index) => {
        return (
          <Appointment
            key={appointment.id}
            time={appointment.time}
            interview={select.getInterview(state, appointment.interview)}
            interviewers={select.getInterviewersForDay(state, state.selectedDay)}
            bookInterview={(interview) => bookInterview(appointment.id, interview)}
          />
        );
      })
    });
  };

  function bookInterview(id, interview) {
    //console.log("bookInterview: id, interview:", id, interview);
    const newAppointment = {
      ...state.appointments[id],
      interview: { ...interview }
    };
    return Axios.put(`/api/appointments/${id}`, newAppointment)
      .then((_res) => {
        //console.log(`PUT /api/appointments/${id}`, res);
        updateState({
          appointments: {
            ...state.appointments,
            [id]: newAppointment
          }
        });
      })
      .catch((err) => console.log(`PUT /api/appointments/${id}`, err));
  }

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
