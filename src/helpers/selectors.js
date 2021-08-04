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

