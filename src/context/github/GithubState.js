import React, { useReducer } from 'react';
import Axios from 'axios';
import GithubContext from './githubContext';
import GithubReducer from './githubReducer';

import {
  SEARCH_USER,
  SET_LOADING,
  GET_REPOS,
  GET_USER,
  CLEAR_USERS
} from '../types';

let githubClientId;
let githubClieantSecret;

if (process.env.NODE_ENV !== 'production') {
  githubClientId = process.env.REACT__APP_GITHUB_CLIENT_ID;
  githubClieantSecret = process.env.REACT_APP_GITHUB_CLIENT_SECRET;
} else {
  githubClientId = process.env.GITHUB_CLIENT_ID;
  githubClieantSecret = process.env.GITHUB_CLIENT_SECRET;
}

const GithubState = props => {
  const initialState = {
    users: [],
    user: {},
    repos: [],
    loading: false
  };

  const [state, dispatch] = useReducer(GithubReducer, initialState);
  // search user
  const searchUsers = async text => {
    setLoading();
    const res = await Axios.get(
      `https://api.github.com/search/users?q=${text}&client_id=${githubClientId}
      &client_secret=${githubClieantSecret}`
    );

    dispatch({
      type: SEARCH_USER,
      payload: res.data.items
    });
  };
  //get user
  const getUser = async username => {
    setLoading();
    const res = await Axios.get(
      `https://api.github.com/users/${username}?client_id=${githubClientId}
      &client_secret=${githubClieantSecret}`
    );

    dispatch({
      type: GET_USER,
      payload: res.data
    });
  };
  //get repos
  const getUserRepos = async username => {
    setLoading();
    const res = await Axios.get(
      `https://api.github.com/users/${username}/repos?per_page=5&sort=created:asc&client_id=${process.env.REACT__APP_GITHUB_CLIENT_ID}
      &client_secret=${process.env.REACT_APP_GITHUB_CLIENT_SECRET}`
    );

    dispatch({
      type: GET_REPOS,
      payload: res.data
    });
  };

  //clear user
  const clearUsers = () => dispatch({ type: CLEAR_USERS });
  //set loading
  const setLoading = () => dispatch({ type: SET_LOADING });
  return (
    <GithubContext.Provider
      value={{
        users: state.users,
        user: state.user,
        repos: state.repos,
        loading: state.loading,
        searchUsers,
        clearUsers,
        getUser,
        getUserRepos
      }}
    >
      {props.children}
    </GithubContext.Provider>
  );
};

export default GithubState;
