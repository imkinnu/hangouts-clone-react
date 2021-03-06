import React from 'react';
import { connect } from 'react-redux';
import { StyleSheet, css } from 'aphrodite';
import GoogleLogin from 'react-google-login';

import {
  setUserToken,
  setUserId,
  setUserName,
} from '../actions';

const styles = StyleSheet.create({
  content: {
    fontFamily: 'Roboto',
    color: '#fff',
    textAlign: 'left',
    textShadow: 'black 0.1em 0.1em 0.2em',
    fontWeight: '300',
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translateX(-50%) translateY(-50%)',
  },
});

class Login extends React.Component {
  constructor() {
    super();
    this.onSuccess = this.onSuccess.bind(this);
    this.onFailure = this.onFailure.bind(this);
  }

  onSuccess(response) {
    const tokenId = response.tokenId;
    const googleId = response.profileObj.googleId;
    const email = response.profileObj.email;
    fetch('/token', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ 
        tokenId: tokenId,
        googleId: googleId,
      })
    }).then((response) => {
      if (response.status === 200) {
        return response.json();
      } else {
        alert('Authentication via Google was unsuccessful. Please try again!');
      }
    }).then((json) => {
      this.props.postSuccess(json.token, json.identity, email);
      const state = this.context.router.location.state;
      if (state && state.nextPathname) {
        this.context.router.push(state.nextPathname);
      } else {
        this.context.router.push('/main');
      }
    });
  }

  onFailure(response) {
    alert('Oops! There was an error while logging you in!');
  }

  render() {
    return (
      <div className={css(styles.content)}>
        <h1>Hi, there!</h1>
        <h2>Get started by logging in with your Google Account.</h2>
        <GoogleLogin
          clientId={process.env.REACT_APP_GOOGLE_CLIENT_ID}
          onSuccess={this.onSuccess}
          onFailure={this.onFailure}
        />
      </div>
    );
  }
}

Login.contextTypes = {
  router: React.PropTypes.object.isRequired,
};

export const mapDispatchToProps = (dispatch) => ({
  postSuccess: (token, id, username) => {
    dispatch(setUserToken(token));
    dispatch(setUserId(id));
    dispatch(setUserName(username));
  }
});

export default connect(null, mapDispatchToProps)(Login);
