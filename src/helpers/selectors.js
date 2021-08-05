export function getAppointmentsForDay(state, day) {
  const filteredAppointment = [];
  const foundDay = state.days.filter((d) => d.name === day)[0];
  if (foundDay === undefined || state.days.length === 0) {
    return [];
  }
  foundDay.appointments.forEach((appointmentsId) => {
    filteredAppointment.push(state.appointments[appointmentsId]);
  });

  return filteredAppointment;
}

export function getInterview(state, interview) {
  if (interview === null) {
    return null;
  }
  let interviewerId = interview.interviewer;

  return {
    student: interview.student,
    interviewer: { ...state.interviewers[interviewerId] },
  };
}

export function getInterviewersForDay(state, day) {
  const filteredInterviewer = [];
  const todaysAppointments = getAppointmentsForDay(state, day);
  todaysAppointments.forEach((appointment) => {
    if (appointment.interview !== null) {
      const appointmentInterviewerId = appointment.interview.interviewer;
      filteredInterviewer.push(state.interviewers[appointmentInterviewerId]);
    }
    return filteredInterviewer;
  });

  //get interviewers for the day
  return filteredInterviewer;
}
