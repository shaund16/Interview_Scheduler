import { useState, useEffect } from 'react';
import axios from 'axios';

export default function useApplicationData(props) {
  const [state, setState] = useState({
    day: 'Monday',
    days: [],
    appointments: {},
    interviewers: [],
  });

  const setDay = (day) => setState({ ...state, day });

  useEffect(() => {
    // axios.get("/api/days").then((response) => setDays(response.data))
    Promise.all([
      axios.get('/api/days'),
      axios.get('/api/appointments'),
      axios.get('/api/interviewers'),
    ]).then((all) => {
      setState((prev) => ({
        ...prev,
        days: all[0].data,
        appointments: all[1].data,
        interviewers: all[2].data,
      }));
    });
  }, []);

  //Book an interview
  function bookInterview(id, interview) {
    const appointment = {
      ...state.appointments[id],
      interview: { ...interview },
    };

    const appointments = {
      ...state.appointments,
      [id]: appointment,
    };

    const days = state.days.map((day) => {
      if (day.name === state.day) {
        return { ...day, spots: updateSpots(state, appointments) };
      } else {
        return day;
      }
    });

    return axios
      .put(`/api/appointments/${id}`, appointment)
      .then((response) => {
        setState({
          ...state,
          appointments,
          days,
        });
        updateSpots(state, appointments);
      });
  }

  //Delete interview
  function cancelInterview(id) {
    const appointment = {
      ...state.appointments[id],
      interview: null,
    };

    const appointments = {
      ...state.appointments,
      [id]: appointment,
    };

    const days = state.days.map((day) => {
      if (day.name === state.day) {
        return { ...day, spots: updateSpots(state, appointments) };
      } else {
        return day;
      }
    });

    return axios.delete(`/api/appointments/${id}`).then((response) => {
      setState({
        ...state,
        appointments,
        days,
      });
      updateSpots(state, appointments);
    });
  }

  const updateSpots = (state, appointments) => {
    let totalSpots = 0;
    const foundDay = state.days.filter((d) => d.name === state.day)[0];
    foundDay.appointments.forEach((appointmentId) => {
      const appointment = appointments[appointmentId];
      if (!appointment.interview) {
        totalSpots++;
      }
    });
    return totalSpots;
  };

  return { state, setDay, bookInterview, cancelInterview };
}
