import React, {Component} from 'react';
import {connectProfile} from '../auth';
import {Link} from 'react-router';
import './Home.css';

class Home extends Component {
  static propTypes = {
    ...connectProfile.PropTypes
  };

  render() {

    return (
      <div className="Home">
        <div className="Home-intro">
          <h2>Welcome! You've now got a React app protected by Auth0 on Total.js</h2>
          <p>Explore your <Link to="/profile/edit">profile</Link> or check out the <a href="https://auth0.com/docs/quickstart/spa/react">Auth0 docs</a> for more info.</p>
        </div>
      </div>
    );
  }
}

export default connectProfile(Home);
