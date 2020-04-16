


// getAppointmentsForDay returns an array of appointment objects for the given day.

export const getAppointmentsForDay = (state, dayId) =>
  ( ( ( (state && state.days) || []
      ).find((stateDay) => stateDay.id === dayId) || {}
    ).appointments || []
  ).map((appointmentId) => state.appointments[appointmentId])
;

// getInterviewersForDay returns an array of interviewer objects for the given day.

export const getInterviewersForDay = (state, dayId) =>
  ( ( ( (state && state.days) || []
      ).find((stateDay) => stateDay.id === dayId) || {}
    ).interviewers || []
  ).map((interviewerId) => state.interviewers[interviewerId])
;

// getInterview returns a full interview object for an interview
//    object coming from the appointments API.

export const getInterview = (state, interview) =>
  ( state && state.interviewers && interview && interview.interviewer && {
      ...interview,
      interviewer: { ...state.interviewers[interview.interviewer] }
    }
  )
;



