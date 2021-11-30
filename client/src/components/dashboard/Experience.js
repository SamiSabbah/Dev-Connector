import { Fragment } from 'react';
import moment from 'moment';
import { deleteExperience } from '../../features/profileSlice';
import { useDispatch } from 'react-redux';

const Experience = ({ experience }) => {
  const dispatch = useDispatch();

  const experiences = experience.map((exp) => (
    <tr key={exp._id}>
      <td>{exp.company}</td>
      <td className="hide-sm">{exp.title}</td>
      <td>
        {moment(exp.from).format('YYYY/MM/DD')} -{' '}
        {exp.to === null ? ' Now' : moment(exp.to).format('YYYY/MM/DD')}
      </td>
      <td>
        <button
          className="btn btn-danger"
          onClick={() => {
            dispatch(deleteExperience(exp._id));
          }}
        >
          Deletes
        </button>
      </td>
    </tr>
  ));
  return (
    <Fragment>
      <h2 className="my-2">Experience Credentials</h2>
      <table className="table">
        <thead>
          <tr>
            <th>Company</th>
            <th className="hide-sm">Title</th>
            <th className="hide-sm">Years</th>
            <th />
          </tr>
        </thead>
        <tbody>{experiences}</tbody>
      </table>
    </Fragment>
  );
};

export default Experience;
