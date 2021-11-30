import { Fragment } from 'react';
import { useSelector } from 'react-redux';

const Alert = () => {
  const alerts = useSelector((state) => state.alerts.alerts);

  return (
    <Fragment>
      {alerts &&
        alerts.length !== 0 &&
        alerts.map((alert) => (
          <div key={alert.id} className={`alert alert-${alert.alertType}`}>
            {alert.msg}
          </div>
        ))}
    </Fragment>
  );
};

export default Alert;
