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
