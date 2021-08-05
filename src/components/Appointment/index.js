import React from 'react';
import 'components/Appointment/styles.scss';
import Header from 'components/Appointment/Header';
import Show from 'components/Appointment/Show';
import Empty from 'components/Appointment/Empty';
import useVisualMode from 'hooks/useVisualMode';
import Form from 'components/Appointment/Form';
import Status from 'components/Appointment/Status';
import Confirm from 'components/Appointment/Confirm';
import Error from 'components/Appointment/Error';

const EMPTY = 'EMPTY';
const SHOW = 'SHOW';
const CREATE = 'CREATE';
const SAVING = 'SAVING';
const DELETING = 'DELETING';
const CONFIRM = 'CONFIRM';
const EDIT = 'EDIT';
const ERROR_SAVE = 'ERROR_SAVE';
const ERROR_DELETE = 'ERROR_DELETE';


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
    

    props.bookInterview(props.id, interview)
    .then(() => transition(SHOW))
    .catch(error => transition(ERROR_SAVE, true));
  };

  //delete function
  function deleted (name, interviewer) {
    const interview = {
      student: name,
      interviewer,
    };

    transition(CONFIRM, true)
    transition(DELETING, true);
    
    props.cancelInterview(props.id, interview)
    .then(() => {
      transition(EMPTY)
    })
    .catch(error => transition(ERROR_DELETE, true));
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
          onEdit={() => transition(EDIT)}
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

      {mode === EDIT && (
        <Form 
          name={props.interview.student}
          interviewers={props.interviewers}
          interviewer={props.interview.interviewer.id}
          onSave={save}
          onCancel={back}
        />
      )}
      {mode === SAVING && <Status message={'Saving...'} />}
      {mode === DELETING && <Status message={'Deleting...'} />}
      
      {mode === ERROR_DELETE && 
      <Error 
      message={'Error Delete'} 
      onClose={() => {back(); back()}}
      />}
      
      {mode === ERROR_SAVE && 
      <Error 
      message={'Error Save'} 
      onClose={() => {back(); back()}} 
      />}
      
    </article>
  );
};

export default Appointment;
