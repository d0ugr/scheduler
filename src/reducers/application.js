// application.js
//
// Reducer state implementation for the application.

import * as util from "../helpers/util";

// useReducer dispatch action types:
export const SET_DAY              = "SET_DAY";
export const SET_APPLICATION_DATA = "SET_APPLICATION_DATA";
export const SET_INTERVIEW        = "SET_INTERVIEW";
export const UPDATE_SPOTS         = "UPDATE_SPOTS";

// reducer is called by dispatch with the current state and action data in an object.
//
// Returns an object to update the state with.
//    Returning the current state object causes React to do nothing
//    (i.e. if an error occurs).

export default function reducer(state, action) {
  switch (action.type) {

    // Set general application data.
    //
    //    days           Array    Array of day information
    //                              (array of appointment IDs, array of interviewer IDs,
    //                              and number of available interview spots).
    //    appointments   Object   All interview appointment objects.
    //    interviewers   Object   All interviewer objects.

    case SET_APPLICATION_DATA:
      return util.updateState(state, {
        days:         [ ...(action.days         || state.days        ) ],
        appointments: { ...(action.appointments || state.appointments) },
        interviewers: { ...(action.interviewers || state.interviewers) }
      });

    // Set the currently selected day in the sidebar.
    //
    //    dayId   Number   Day ID to set.

    case SET_DAY:
      return util.updateState(state, {
        selectedDay: (action.dayId || state.selectedDay)
      });

    // Update an interview appointment data.
    //
    //    interview   Object   Interview data object, or null to clear it.

    case SET_INTERVIEW:
      return util.updateState(state, {
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
        const days = [ ...state.days ];
        const day  = days.find((day) => day.id === action.dayId);
        day.spots = day.appointments
          .reduce((spots, appointmentId) =>
            spots + (state.appointments[appointmentId].interview ? 0 : 1),
            0
          );
        return util.updateState(state, { days });
      } catch (err) {
        throw new Error(err);
      }

    default:
      throw new Error(
        `useApplicationData: reducer: Unsupported action type: ${action.type}`
      );
  }
}
