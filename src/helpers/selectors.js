// selectors.js
//
// Helper functions for managing appointments and interviews.



// getAppointmentsForDay returns an array of appointment objects for the given day.

export const getAppointmentsForDay = (state, dayId) => {
  try {
    return state.days
      .find((stateDay) => stateDay.id === dayId)
      .appointments.map((appointmentId) => state.appointments[appointmentId]);
  } catch (err) {
    return [];
  }
};

// // updateSpotsForDay returns the number of empty interview appointments for the given day.
// //    The appointments array can be specified in case you don't want to use the current state
// //    (i.e. before updating the state).

// export const updateSpotsForDay = (appointments, days, dayId) => {
//   try {
//     const day = days.find((day) => day.id === dayId);
//     day.spots = day.appointments
//       .filter((appointmentId) => !appointments[appointmentId].interview)
//       .length;
//   } catch (err) {
//     return [];
//   }
// };

// getInterviewersForDay returns an array of interviewer objects for the given day.

export const getInterviewersForDay = (state, dayId) => {
  try {
    return state.days
      .find((stateDay) => stateDay.id === dayId)
      .interviewers.map((interviewerId) => state.interviewers[interviewerId]);
  } catch (err) {
    return [];
  }
};

// getInterview returns a full interview object for an interview
//    object coming from the appointments API.

export const getInterview = (state, interview) => {
  try {
    return {
      student:     interview.student,
      interviewer: { ...state.interviewers[interview.interviewer] }
    };
  } catch (err) {
    return null;
  }
};



