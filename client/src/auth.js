import decode from 'jwt-decode';
import {EventEmitter} from 'events';
import React, {Component, PropTypes} from 'react';
import {browserHistory} from 'react-router';
import Auth0Lock from 'auth0-lock';


const NEXT_PATH_KEY = 'next_path';
const ID_TOKEN_KEY = 'id_token';
const ACCESS_TOKEN_KEY = 'access_token';
const PROFILE_KEY = 'profile';
const LOGIN_ROUTE = '/login';
const ROOT_ROUTE = '/';

const REACT_APP_AUTH0_CLIENT_ID = process.env.REACT_APP_AUTH0_CLIENT_ID;
const  REACT_APP_AUTH0_DOMAIN = process.env.REACT_APP_AUTH0_DOMAIN ;



if (!REACT_APP_AUTH0_CLIENT_ID || !REACT_APP_AUTH0_DOMAIN) {
  throw new Error('Please define `REACT_APP_AUTH0_CLIENT_ID` and `REACT_APP_AUTH0_DOMAIN` in your .env file');
}

const lock = new Auth0Lock(
  REACT_APP_AUTH0_CLIENT_ID,
  REACT_APP_AUTH0_DOMAIN, {
    auth: {
      redirectUrl: `${window.location.origin}${LOGIN_ROUTE}`,
      responseType: 'token'
    }
  }
);

const events = new EventEmitter();

lock.on('authenticated', authResult => {
  setIdToken(authResult.idToken);
  setAccessToken(authResult.accessToken);
  lock.getUserInfo(authResult.accessToken, (error, profile) => {
    if (error) { return setProfile({error}); }
    setProfile(profile);
    browserHistory.push(getNextPath());
    clearNextPath();
  });
});

export function login(options) {
  lock.show(options);

  return {
    hide() {
      lock.hide();
    }
  }
}

export function logout() {
  clearNextPath();
  clearIdToken();
  clearProfile();
  browserHistory.push(LOGIN_ROUTE);
}

export function requireAuth(nextState, replace) {
  if (!isLoggedIn()) {
    setNextPath(nextState.location.pathname);
    replace({pathname: LOGIN_ROUTE});
  }
}

export function connectProfile(WrappedComponent) {
  return class ProfileContainer extends Component {
    state = {
      profile: null
    };

    componentWillMount() {
      this.profileSubscription = subscribeToProfile((profile) => {
        this.setState({profile});
      });
    }

    componentWillUnmount() {
      this.profileSubscription.close();
    }

    render() {
      return (
        <WrappedComponent
          {...this.props}
          profile={this.state.profile}
          onUpdateProfile={this.onUpdateProfile}
        />
      );
    }

    onUpdateProfile = (newProfile) => {
      return updateProfile(this.state.profile.user_id, newProfile);
    }
  };
}

connectProfile.PropTypes = {
  profile: PropTypes.object,
  onUpdateProfile: PropTypes.func
};

export function fetchAsUser(input, init={}) {
  const headers = init.headers || {};

  return fetch(input, {
    ...init,
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${getIdToken()}`,
      ...headers
    }
  }).then((response) => {
    if (!response.ok) { throw new Error(response); }
    return response;
  });
}

function subscribeToProfile(subscription) {
  events.on('profile_updated', subscription);

  if (isLoggedIn()) {
    subscription(getProfile());

    lock.getUserInfo(getAccessToken(), (error, profile) => {
      if (error) { return setProfile({error}); }
      setProfile(profile);
    });
  }

  return {
    close() {
      events.removeListener('profile_updated', subscription);
    }
  };
}

async function updateProfile(userId, newProfile) {
  try {
    const response = await fetchAsUser(`https://${REACT_APP_AUTH0_DOMAIN}/api/v2/users/${userId}`, {
      method: 'PATCH',
      body: JSON.stringify(newProfile)
    });

    const profile = await response.json();
    setProfile(profile);
  } catch (error) {
    return error;
  }
}

function setProfile(profile) {
  localStorage.setItem(PROFILE_KEY, JSON.stringify(profile));
  events.emit('profile_updated', profile);
}

function getProfile() {
  return JSON.parse(localStorage.getItem(PROFILE_KEY));
}

function clearProfile() {
  localStorage.removeItem(PROFILE_KEY);
  events.emit('profile_updated', null);
}

function setIdToken(idToken) {
  localStorage.setItem(ID_TOKEN_KEY, idToken);
}

function setAccessToken(accessToken) {
  localStorage.setItem(ACCESS_TOKEN_KEY, accessToken);
}

function getIdToken() {
  return localStorage.getItem(ID_TOKEN_KEY);
}

function getAccessToken() {
  return localStorage.getItem(ACCESS_TOKEN_KEY);
}

function clearIdToken() {
  localStorage.removeItem(ID_TOKEN_KEY);
}

function setNextPath(nextPath) {
  localStorage.setItem(NEXT_PATH_KEY, nextPath);
}

function getNextPath() {
  return localStorage.getItem(NEXT_PATH_KEY) || ROOT_ROUTE;
}

function clearNextPath() {
  localStorage.removeItem(NEXT_PATH_KEY);
}

function isLoggedIn() {
  const idToken = getIdToken();
  return idToken && !isTokenExpired(idToken);
}

function getTokenExpirationDate(encodedToken) {
  const token = decode(encodedToken);
  if (!token.exp) { return null; }

  const date = new Date(0);
  date.setUTCSeconds(token.exp);

  return date;
}

function isTokenExpired(token) {
  const expirationDate = getTokenExpirationDate(token);
  return expirationDate < new Date();
}
