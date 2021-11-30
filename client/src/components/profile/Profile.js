import { useDispatch, useSelector } from 'react-redux';
import { Fragment, useEffect } from 'react';
import { useParams } from 'react-router';
import { Link } from 'react-router-dom';

import Spinner from '../layout/Spinner';
import ProfileTop from './ProfileTop';
import ProfileAbout from './ProfileAbout';
import { getProfileById } from '../../features/profileSlice';
import ProfileExperience from './ProfileExperience';
import ProfileEducation from './ProfileEducation';
import ProfileGithub from './ProfileGithub';

const Profile = () => {
  const dispatch = useDispatch();
  const { id } = useParams();
  const auth = useSelector((state) => state.auth.isAuthenticated);
  const authLoding = useSelector((state) => state.auth.loading);
  const user = useSelector((state) => state.auth.user);
  const selectedProfile = useSelector((state) => state.profile.selectedProfile);
  const loading = useSelector((state) => state.profile.loading);

  useEffect(() => {
    dispatch(getProfileById(id));
  }, [dispatch, id]);

  return (
    <Fragment>
      {selectedProfile === null || loading ? (
        <Spinner />
      ) : (
        <Fragment>
          <Link to="/profiles" className="btn btn-ligth">
            Back To Profiles
          </Link>
          {auth && !authLoding && user._id === id && (
            <Link to="/edit-profile" className="btn btn-dark">
              Edit Profile
            </Link>
          )}
          <div className="profile-grid my-1">
            <ProfileTop profile={selectedProfile} />
            <ProfileAbout profile={selectedProfile} />
            <div className="profile-exp bg-white p-2">
              <h2 className="text-primary">Experience</h2>
              {selectedProfile.experience.length > 0 ? (
                <Fragment>
                  {selectedProfile.experience.map((experience) => (
                    <ProfileExperience
                      key={experience._id}
                      experience={experience}
                    />
                  ))}
                </Fragment>
              ) : (
                <h4>No experience credentials</h4>
              )}
            </div>

            <div className="profile-edu bg-white p-2">
              <h2 className="text-primary">Education</h2>
              {selectedProfile.education.length > 0 ? (
                <Fragment>
                  {selectedProfile.education.map((education) => (
                    <ProfileEducation
                      key={education._id}
                      education={education}
                    />
                  ))}
                </Fragment>
              ) : (
                <h4>No education credentials</h4>
              )}
            </div>

            {selectedProfile.githubusername && (
              <ProfileGithub username={selectedProfile.githubusername} />
            )}
          </div>
        </Fragment>
      )}
    </Fragment>
  );
};

export default Profile;
