// useApplicationData.js
//
// Custom hook that manages application state
//    and performs network API requests.

import { useEffect, useReducer } from "react";
import axios from "axios";

// import * as select    from "../helpers/selectors";
import SocketHandler from "../helpers/socket_handler";



// Default values for the application state:
const DEFAULT_STATE = {
  selectedDay:  1, // null
  days:         null,
  appointments: null
};

// useReducer dispatch action types:
const SET_DAY              = "SET_DAY";
const SET_APPLICATION_DATA = "SET_APPLICATION_DATA";
const SET_INTERVIEW        = "SET_INTERVIEW";
const UPDATE_SPOTS         = "UPDATE_SPOTS";



// Set the base URL for API calls:
axios.defaults.baseURL = `${window.location}/api`;

// Initialize the WebSocket handler:
//    This does not initiate a connection.
const socket = SocketHandler(process.env.REACT_APP_WEBSOCKET_URL);



// updateState adds/updates properties in the given state object.
//
//    state   Object   State object to modify.
//    data    Object   Properties to update state with.
//
//    If data is not an object, nothing happens.
//    If it contains "name" and "value" properties,
//    (i.e. from <input> attributes) those are used to set the value as a
//    "name: value" property in the state object.
//    Otherwise, the object is simply copied into the state object.
//    Existing properties will be updated if they exist.
//
// Returns a copy of the state object with any updates.

const updateState = (state, data) => {
  try {
    return {
      ...state,
      ...(data.name && data.value ? { [data.name]: data.value } : data)
    };
  } catch (err) {
    return state;
  }
};



// useApplicationData manages application state separately from
//    the Application component (which handles rendering).
//    Also provides functions that update the database via the API.

export default function useApplicationData() {

  //console.log("useApplicationData");

  // The state of things:
  //    Initial default values are set here.
  //    Components should have checks for nulls.
  // const { state, updateState } = useStateObject(DEFAULT_STATE);
  const [ state, dispatch ] = useReducer(reducer, DEFAULT_STATE);

  // reducer is called by dispatch with the current state and action data in an object.
  //
  // Returns an object to update the state with.
  //    Returning the current state object causes React to do nothing
  //    (i.e. if an error occurs).

  function reducer(state, action) {
    //console.log("useApplicationData: reducer:", action.type);
    switch (action.type) {

      // Set general application data.
      //
      //    days           Array    Array of day information
      //                              (array of appointment IDs, array of interviewer IDs,
      //                              and number of available interview spots).
      //    appointments   Object   All interview appointment objects.
      //    interviewers   Object   All interviewer objects.

      case SET_APPLICATION_DATA:
        return updateState(state, {
          days:         [ ...(action.days         || state.days        ) ],
          appointments: { ...(action.appointments || state.appointments) },
          interviewers: { ...(action.interviewers || state.interviewers) }
        });

      // Set the currently selected day in the sidebar.
      //
      //    dayId   Number   Day ID to set.

      case SET_DAY:
        return updateState(state, {
          selectedDay: (action.dayId || state.selectedDay)
        });

      // Update an interview appointment data.
      //
      //    interview   Object   Interview data object, or null to clear it.

      case SET_INTERVIEW:
        return updateState(state, {
          appointments: {
            ...state.appointments,
            [action.id]: {
              ...state.appointments[action.id],
              interview: (action.interview ? { ...action.interview } : null)
            }
          }
        });

      // Update the number of interview appointment spots for a given day.
      //
      //    dayId   Number   Day ID to update the number of spots for.

      case UPDATE_SPOTS:
        try {
          const days = { ...state.days };
          try {
            const day = days.find((day) => day.id === action.dayId);
            day.spots = day.appointments
              .reduce((spots, appointmentId) =>
                spots + (!state.appointments[appointmentId].interview ? 0 : 1),
                0
              );
            return updateState(state, { days });
          // If the data is invalid, returning the existing state will
          //    cause React to do nothing:
          } catch (err) {
            return state;
          }
        } catch (err) {
          return state;
        }

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
    .then((req) => {
      // Update the application state:
      //updateState({
      //  days:         res[0].data,
      //  appointments: res[1].data,
      //  interviewers: res[2].data
      //})
      dispatch({
        type:         SET_APPLICATION_DATA,
        days:         req[0].data,
        appointments: req[1].data,
        interviewers: req[2].data
      })
      // Set up the WebSocket connection:
      socket
        //.on("open", function(event) {
        //  console.log("socket.open", event);
        //  socket.ping();
        //})
        //.on("close", function(event) {
        //  console.log("socket.close", event);
        //})
        .on("message", function(message, _event) {
          //console.log("socket.message", message, event);
          dispatch(message);
        })
        .on("error", function(event) {
          console.log("socket.error", event);
        })
        .open();
    })
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



