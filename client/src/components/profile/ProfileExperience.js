import moment from 'moment';

const ProfileExperience = ({
  experience: { company, title, location, current, to, from, description },
}) => {
  return (
    <div>
      <h3 className="text-dark">{company}</h3>
      <p>
        {moment(from).format('YYYY/MM/DD')} -{' '}
        {!to ? ' Now' : moment(to).format('YYYY/MM/DD')}
      </p>
      <p>
        <strong>Position: </strong> {title}
      </p>
      <p>
        <strong>Description: </strong> {description}
      </p>
    </div>
  );
};

export default ProfileExperience;
