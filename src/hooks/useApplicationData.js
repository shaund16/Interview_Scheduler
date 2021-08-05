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
      console.log(all);
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

    return axios
      .put(`/api/appointments/${id}`, appointment)
      .then((response) => {
        setState({
          ...state,
          appointments,
        });
      });
  }

  //Delete interview
  function cancelInterview(id, interview) {
    const appointment = {
      ...state.appointments[id],
      interview: null,
    };

    const appointments = {
      ...state.appointments,
      [id]: appointment,
    };

    return axios
      .delete(`/api/appointments/${id}`, appointment)
      .then((response) => {
        setState({
          ...state,
          appointments,
        });
      });
  }

  return { state, setDay, bookInterview, cancelInterview };
}
