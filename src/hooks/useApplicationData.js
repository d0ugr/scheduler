// useApplicationData.js
//
// Custom hook that manages application state via useApplicationReducer
//    and performs network API requests.

import { useEffect, useReducer } from "react";
import axios from "axios";

import reducer, {
  SET_DAY,
  SET_APPLICATION_DATA,
  SET_INTERVIEW,
  UPDATE_SPOTS
} from "../reducers/application";
import SocketHandler from "../helpers/socket_handler";

// Default values for the application state:
const DEFAULT_STATE = {
  selectedDay:  1, // null
  days:         null,
  appointments: null
};

// Initialize the WebSocket handler:
//    This does not initiate a connection.
const socket = SocketHandler(process.env.REACT_APP_WEBSOCKET_URL);

// useApplicationData manages application state separately from
//    the Application component (which handles rendering).
//    Also provides functions that update the database via the API.

export default function useApplicationData() {

  // The state of things:
  //    Initial default values are set here.
  //    Components should have checks for nulls.
  // const { state, updateState } = useStateObject(DEFAULT_STATE);
  const [ state, dispatch ] = useReducer(reducer, DEFAULT_STATE);

  // Load data from the API server on initial page load
  //    and save it in the state object:
  useEffect(() => {
    Promise.all([
      axios.get("/days"),
      axios.get("/appointments"),
      axios.get("/interviewers")
    ])
    .then((req) => {
      // Update the application state:
      dispatch({
        type:         SET_APPLICATION_DATA,
        days:         req[0].data,
        appointments: req[1].data,
        interviewers: req[2].data
      })
      // Set up the WebSocket connection:
      socket
        .on("message", function(message, _event) {
          dispatch(message);
          dispatch({ type: UPDATE_SPOTS, dayId: state.selectedDay });
        })
        .on("error", function(event) {
          console.warn("socket.error", event);
        })
        .open();
    })
    .catch((err) => console.warn("useApplicationData: useEffect[]: Promise.all error:", err));
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // setDay sets the currently selected day chosen in the sidebar.
  //    This will trigger an effect in Application that re-renders the schedule.

  function setDay(dayId) {
    dispatch({ type: SET_DAY, dayId });
  }

  // bookInterview saves an interview appointment
  //    in the database via the API server.

  function bookInterview(id, interview) {
    return axios.put(`/appointments/${id}`, {
      ...state.appointments[id],
      interview: { ...interview }
    })
      .then((_res) => {
        dispatch({ type: SET_INTERVIEW, id, interview });
        dispatch({ type: UPDATE_SPOTS, dayId: state.selectedDay });
      })
  }

  // cancelInterview removes an interview appointment
  //    from the database via the API server.

  function cancelInterview(id) {
    return axios.delete(`/appointments/${id}`)
      .then((_res) => {
        dispatch({ type: SET_INTERVIEW, id, interview: null });
        dispatch({ type: UPDATE_SPOTS, dayId: state.selectedDay });
      })
  }

  return [ state, setDay, bookInterview, cancelInterview ];

}
