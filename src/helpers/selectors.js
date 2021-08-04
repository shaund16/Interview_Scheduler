export function getAppointmentsForDay(state, day) {
 const result = [];
  const foundDay = state.days.filter(d => d.name === day)[0]
  if (foundDay === undefined || state.days.length === 0){
    return [];
  }
  foundDay.appointments.forEach(appointmentsId => {
   result.push(state.appointments[appointmentsId]);
  })
  
 return result
};


export function getInterview(state, interview) {
  if (interview === null) {
    return null;
  }
  let interviewerId = interview.interviewer;

  return {
    student: interview.student,
    interviewer: { ...state.interviewers[interviewerId]},
  };
};