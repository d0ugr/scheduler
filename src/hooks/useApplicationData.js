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



// Set the base URL for API calls:
axios.defaults.baseURL = `${window.location}/api`;

// Initialize the WebSocket handler:
//    This does not initiate a connection.
const socket = SocketHandler(process.env.REACT_APP_WEBSOCKET_URL);



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
          dispatch({ type: UPDATE_SPOTS, dayId: state.selectedDay });
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
    dispatch({ type: SET_DAY, dayId });
  }

  // bookInterview saves an interview appointment
  //    in the database via the API server.

  function bookInterview(id, interview) {
    //console.log("bookInterview: id, interview:", id, interview);
    return axios.put(`/appointments/${id}`, {
      ...state.appointments[id],
      interview: { ...interview }
    })
      .then((_res) => {
        //console.log(`PUT /api/appointments/${id}`, res);
        dispatch({ type: SET_INTERVIEW, interview });
        dispatch({ type: UPDATE_SPOTS, dayId: state.selectedDay });
      })
      //.catch((err) => console.log(`PUT /api/appointments/${id}`, err));
  }

  // cancelInterview removes an interview appointment
  //    from the database via the API server.

  function cancelInterview(id) {
    //console.log("cancelInterview: id:", id);
    return axios.delete(`/appointments/${id}`)
      .then((_res) => {
        //console.log(`DELETE /api/appointments/${id}`, res);
        dispatch({ type: SET_INTERVIEW, interview: null });
        dispatch({ type: UPDATE_SPOTS, dayId: state.selectedDay });
      })
      //.catch((err) => console.log(`DELETE /api/appointments/${id}`, err));
  }



  return [ state, setDay, bookInterview, cancelInterview ];

}



