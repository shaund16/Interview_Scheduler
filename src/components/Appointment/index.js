import React from 'react';
import 'components/Appointment/styles.scss';
import Header from 'components/Appointment/Header';
import Show from 'components/Appointment/Show';
import Empty from 'components/Appointment/Empty';
import useVisualMode from 'hooks/useVisualMode';
import Form from 'components/Appointment/Form';
import Status from 'components/Appointment/Status';
import Confirm from 'components/Appointment/Confirm';

const EMPTY = 'EMPTY';
const SHOW = 'SHOW';
const CREATE = 'CREATE';
const SAVING = 'SAVING';
const DELETING = 'DELETING';
const CONFIRM = 'CONFIRM';


const Appointment = (props) => {
  const { mode, transition, back } = useVisualMode(
    props.interview ? SHOW : EMPTY
  );

  //save function
  function save(name, interviewer) {
    const interview = {
      student: name,
      interviewer,
    };

    transition(SAVING);

    props.bookInterview(props.id, interview).then(() => {
      transition(SHOW);
    });
  };

  //delete function
  function deleted (name, interviewer) {
    const interview = {
      student: name,
      interviewer,
    };

    transition(CONFIRM, true)
    transition(DELETING);
    
    props.cancelInterview(props.id, interview)
    .then(() => {
      transition(EMPTY)
    })
  }

  return (
    <article className='appointment'>
      <Header time={props.time} />
      {mode === EMPTY && 
        <Empty 
        onAdd={() => transition(CREATE)} 

        />}
      {mode === SHOW && (
        <Show
          student={props.interview.student}
          interviewer={props.interview.interviewer}
          onDelete={() => transition(CONFIRM)}
        />
      )}
      {mode === CREATE && (
        <Form
          interviewers={props.interviewers}
          onSave={save}
          onCancel={() => back()}
        />
      )}
      {mode === CONFIRM && (
        <Confirm 
        message='Delete the appointment?'
        onConfirm={deleted}
        onCancel={() => transition(SHOW)}
        />
      )}
      {mode === SAVING && <Status message={'Saving...'} />}
      {mode === DELETING && <Status message={'Deleting...'} />}
    </article>
  );
};

export default Appointment;
