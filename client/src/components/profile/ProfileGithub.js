import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getGithubReops } from '../../features/profileSlice';
import Spinner from '../layout/Spinner';

const ProfileGithub = ({ username }) => {
  const dispatch = useDispatch();
  const repos = useSelector((state) => state.profile.repos);

  useEffect(() => {
    dispatch(getGithubReops(username));
  }, [dispatch, username]);

  return (
    <div className="profile-github">
      <h2 className="text-primary my-1">Github Repos</h2>
      {repos === null ? (
        <Spinner />
      ) : repos.length > 0 ? (
        repos.map((repo) => (
          <div key={repo.id} className="repo bg-white p-1 mt-1">
            <div>
              <h4>
                <a
                  href={repo.html_url}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {repo.name}
                </a>
              </h4>
              <p>{repo.description}</p>
            </div>
            <div>
              <ul>
                <li className="badge badge-primary">
                  Starts: {repo.stargazers_count}
                </li>
                <li className="badge badge-dark">
                  Watchers: {repo.watchers_count}
                </li>
                <li className="badge badge-light">Forks: {repo.forks_count}</li>
              </ul>
            </div>
          </div>
        ))
      ) : (
        <h4>No Github repos for this profile</h4>
      )}
    </div>
  );
};

export default ProfileGithub;
