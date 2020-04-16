


export const getAppointmentsForDay = (state, dayId) =>
  ( ( ( (state && state.days) || []
      ).find((stateDay) => stateDay.id === dayId) || {}
    ).appointments || []
  ).map((appointmentId) => state.appointments[appointmentId])
;

export const getInterview = (state, interview) =>
  ( state && state.interviewers && interview && interview.interviewer && {
      ...interview,
      interviewer: { ...state.interviewers[interview.interviewer] }
    }
  )
;



