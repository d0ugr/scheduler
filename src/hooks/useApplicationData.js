// useApplicationData.js
//
//    Custom hook that manages application state.

import { useEffect, useReducer } from "react";
import axios from "axios";

// import useStateObject from "./useStateObject";
// import * as select    from "helpers/selectors";

axios.defaults.baseURL = "http://localhost:8001/api";



// Default values for the application state:

const DEFAULT_STATE = {
  selectedDay:  1, // null
  days:         null,
  appointments: null
};

const SET_DAY              = "SET_DAY";
const SET_APPLICATION_DATA = "SET_APPLICATION_DATA";
const SET_INTERVIEW        = "SET_INTERVIEW";
const UPDATE_SPOTS         = "UPDATE_SPOTS";



// useApplicationData manages application state separately from
//    the Application component (which handles rendering).

export default function useApplicationData() {

  //console.log("useApplicationData");

  // The state of things:
  //    Initial default values are set here.
  //    Components should have checks for nulls.
  // const { state, updateState } = useStateObject(DEFAULT_STATE);
  const [ state, dispatch ] = useReducer(reducer, DEFAULT_STATE);

  function reducer(state, action) {
    switch (action.type) {
      case SET_DAY:
        return {
          ...state,
          selectedDay: (action.dayId || state.selectedDay)
        };
      case SET_APPLICATION_DATA:
        return {
          ...state,
          days:         [ ...(action.days         || state.days        ) ],
          appointments: { ...(action.appointments || state.appointments) },
          interviewers: { ...(action.interviewers || state.interviewers) }
        };
      case SET_INTERVIEW:
        return {
          ...state,
          appointments: {
            ...state.appointments,
            [action.id]: {
              ...state.appointments[action.id],
              interview: { ...action.interview }
            }
          }
        };
      case UPDATE_SPOTS:
        const newState = { ...state };
        try {
          const day = newState.days.find((day) => day.id === action.dayId);
          day.spots = day.appointments
            .reduce((spots, appointmentId) =>
              spots + (!state.appointments[appointmentId].interview ? 0 : 1),
              0
            );
        } catch (err) {}
        return newState;
      default:
        throw new Error(
          `useApplicationData: reducer: Unsupported action type: ${action.type}`
        );
    }
  }

  // Load data from the API server on initial page load
  //    and save it in the state object:
  useEffect(() => {
    //console.log("useApplicationData: useEffect[]: Page load");
    Promise.all([
      axios.get("/days"),
      axios.get("/appointments"),
      axios.get("/interviewers")
    ])
    .then((req) =>
      // updateState({
      //   days:         res[0].data,
      //   appointments: res[1].data,
      //   interviewers: res[2].data
      // })
      dispatch({
        type:         SET_APPLICATION_DATA,
        days:         req[0].data,
        appointments: req[1].data,
        interviewers: req[2].data
      })
    )
    .catch((err) => console.log("useApplicationData: useEffect[]: Promise.all error:", err));
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // setDay sets the currently selected day chosen in the sidebar.
  //    This will trigger an effect in Application that re-renders the schedule.

  function setDay(dayId) {
    // updateState({ selectedDay: dayId });
    dispatch({ type: SET_DAY, dayId });
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
        const days = [ ...state.days ];
        const appointments = {
          ...state.appointments,
          [id]: newAppointment
        };
        // select.updateSpotsForDay(appointments, state.days, state.selectedDay);
        // updateState({ days, appointments });
        dispatch({ type: SET_APPLICATION_DATA, days, appointments });
        dispatch({ type: UPDATE_SPOTS, dayId: state.selectedDay });
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
        const days         = [ ...state.days         ];
        const appointments = { ...state.appointments };
        appointments[id].interview = null;
        // select.updateSpotsForDay(appointments, days, state.selectedDay);
        // updateState({ days, appointments });
        dispatch({ type: SET_APPLICATION_DATA, days, appointments });
        dispatch({ type: UPDATE_SPOTS, dayId: state.selectedDay });
      })
      //.catch((err) => console.log(`DELETE /api/appointments/${id}`, err));
  }

  return [ state, setDay, bookInterview, cancelInterview ];

}



