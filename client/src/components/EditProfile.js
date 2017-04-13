import React, {Component} from 'react';
import {connectProfile} from '../auth';
import './EditProfile.css';

class EditProfile extends Component {
  static propTypes = {
    ...connectProfile.PropTypes
  };

  state = {
    error: null,
    saved: false,
    saving: false
  }

  render() {
    const {profile} = this.props;
    const {saving, saved} = this.state;
    const user_metadata = profile.user_metadata || {};

    return (
      <div className="EditProfile">
        <div className="EditProfile-heading">Your Profile</div>
        <div className="EditProfile-profile">
          <p><strong>Nickname:</strong> {profile.nickname}</p>
          <p><strong>Name:</strong> {profile.name}</p>
          <p><strong>Email:</strong> {profile.email}</p>
          <p><strong>Created At:</strong> {profile.created_at}</p>
          <p><strong>Updated At:</strong> {profile.updated_at}</p>
          <p><strong>Location:</strong> {user_metadata.location || 'unknown'}</p>
        </div>
        <div className="EditProfile-heading">Edit Profile</div>
        <form className="EditProfile-form" onSubmit={this.onSubmit} onChange={this.onClearSaved}>
          <fieldset className="EditProfile-fieldset" disabled={saving}>
            <label className="EditProfile-locationLabel" htmlFor="location">Location</label>
            <input
              ref={(ref) => this.locationInput = ref}
              className="EditProfile-locationInput"
              id="location"
              type="text"
              placeholder="City or State"
              defaultValue={user_metadata.location}
            />
            <div className="EditProfile-formControls">
              <button className="EditProfile-submitButton" type="submit">
                {saving ? 'Saving...' : 'Save'}
              </button>
              {saved && (
                <div className="EditProfile-saved">Saved</div>
              )}
            </div>
          </fieldset>
        </form>
      </div>
    );
  }

  onSubmit = (event) => {
    event.preventDefault();

    this.setState({saving: true}, async () => {
      const error = await this.props.onUpdateProfile({
        user_metadata: {
          location: this.locationInput.value
        }
      });

      this.setState({error, saved: !error, saving: false});
    });
  }

  onClearSaved = (event) => {
    this.setState({saved: false});
  }
}

export default connectProfile(EditProfile);
