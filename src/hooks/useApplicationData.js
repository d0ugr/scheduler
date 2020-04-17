// useApplicationData.js
//
//    Manages application state.

import { useEffect } from "react";
import axios         from "axios";

import useStateObject from "./useStateObject";
import * as select    from "helpers/selectors";

axios.defaults.baseURL = "http://localhost:8001/api";



// Default values for the application state:

const DEFAULT_STATE = {
  selectedDay:  null,
  days:         null,
  appointments: null,
  schedule:     null
};



// useApplicationData manages application state separately from
//    the Application component (which handles rendering).

export default function useApplicationData() {

  //console.log("useApplicationData");

  // The state of things:
  //    Initial default values are set here.
  //    Components should have checks for nulls.
  const { state, updateState } = useStateObject(DEFAULT_STATE);

  // Load data from the API server on initial page load
  //    and save it in the state object:
  useEffect(() => {
    console.log("useApplicationData: useEffect: Page load");
    Promise.all([
      axios.get("/days"),
      axios.get("/appointments"),
      axios.get("/interviewers")
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

  // setDay sets the currently selected day chosen in the sidebar.
  //    This will trigger an effect in Application that re-renders the schedule.

  function setDay(dayId) {
    updateState({ selectedDay: dayId });
  }

  // bookInterview saves an interview appointment
  //    in the database via the API server.

  function bookInterview(id, interview) {
    //console.log("bookInterview: id, interview:", id, interview);
    const newAppointment = {
      ...state.appointments[id],
      interview: { ...interview }
    };
    return axios.put(`/appointments/${id}`, newAppointment)
      .then((_res) => {
        //console.log(`PUT /api/appointments/${id}`, res);
        const newDays = [ ...state.days ];
        const newAppointments = {
          ...state.appointments,
          [id]: newAppointment
        };
        select.updateSpotsForDay(newAppointments, state.days, state.selectedDay);
        updateState({
          days:         newDays,
          appointments: newAppointments
        });
      })
      //.catch((err) => console.log(`PUT /api/appointments/${id}`, err));
  }

  // cancelInterview removes an interview appointment
  //    from the database via the API server.

  function cancelInterview(id) {
    console.log("cancelInterview: id:", id);
    return axios.delete(`/appointments/${id}`)
      .then((_res) => {
        //console.log(`DELETE /api/appointments/${id}`, res);
        const newDays         = [ ...state.days         ];
        const newAppointments = { ...state.appointments };
        newAppointments[id].interview = null;
        select.updateSpotsForDay(newAppointments, newDays, state.selectedDay);
        updateState({
          days:         newDays,
          appointments: newAppointments
        });
      })
      //.catch((err) => console.log(`DELETE /api/appointments/${id}`, err));
  }

  return [ state, setDay, bookInterview, cancelInterview ];

}



