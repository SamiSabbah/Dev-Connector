import { Fragment, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getProfiles } from '../../features/profileSlice';
import Spinner from '../layout/Spinner';
import ProfileItem from './ProfileItem';

const Profiles = () => {
  const dispatch = useDispatch();
  const loading = useSelector((state) => state.profile.loading);
  const profiles = useSelector((state) => state.profile.profiles);

  useEffect(() => {
    dispatch(getProfiles());
  }, [dispatch]);

  return (
    <section className="container">
      {loading ? (
        <Spinner />
      ) : (
        <Fragment>
          <h1 className="large text-primary">Developers</h1>
          <p className="lead">
            <i className="fab fa-connectdevelop"></i> Browse and connect with
            developers
          </p>
          <div className="profiles">
            {profiles.length > 0 ? (
              profiles.map((profile) => (
                <ProfileItem key={profile._id} profile={profile} />
              ))
            ) : (
              <h4>No profiles found...</h4>
            )}
          </div>
        </Fragment>
      )}
    </section>
  );
};

export default Profiles;
