


export const getAppointmentsForDay = (state, day) =>
  (
    (
      ((state && state.days) || [])
      .find((stateDay) => stateDay.name === day) || {}
    )
    .appointments || []
  )
  .map((appointmentId) => state.appointments[appointmentId])
;



