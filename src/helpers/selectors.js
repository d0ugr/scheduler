


export const getAppointmentsForDay = (state, dayId) =>
  (
    (
      ((state && state.days) || [])
      .find((stateDay) => stateDay.id === dayId) || {}
    )
    .appointments || []
  )
  .map((appointmentId) => state.appointments[appointmentId])
;



