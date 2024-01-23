/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';
import React from 'react';
import ETLogoPic from './PlaceholderData/Images/ETLogoPicB.jpg';
import { Link } from 'react-router-dom';
import { useLoginContext } from './LoggedInContext';

function FrontPageBody() {
  const { loggedIn } = useLoginContext();
  const [isLoaded, setIsLoaded] = React.useState(false);
  return (
    <>
      <div
        className="container"
        css={css`
          background: #ffffff;
          min-height: 85vh;
        `}
        style={{
          opacity: isLoaded ? 1 : 0,
          transition: 'opacity 0.01s ease-in-out',
        }}
      >
        <div className="row d-flex align-items-center">
          <div className="col-lg-6">
            <div className="text-left rounded p-3">
              <h1 className="display-4 big-text">Welcome!</h1>
              <h5 className="nav-link normal-font">
                I am a composer, sound designer and audio engineer.
              </h5>
              <h5 className="nav-link normal-font">
                If you are a customer of mine here you may login and gain access
                to your music.
              </h5>
              <br />
              {loggedIn ? (
                <Link
                  className="normal-font nav-link text-white "
                  to="/Account"
                >
                  <button className="btn btn-info btn-login" type="submit">
                    <span className="badge ">GO TO ACCOUNT</span>
                  </button>
                </Link>
              ) : (
                <Link className="normal-font nav-link text-white " to="/Login">
                  <button className="btn btn-info btn-login" type="submit">
                    <span className="badge ">LOGIN</span>
                  </button>
                </Link>
              )}
            </div>
          </div>

          <div className="col-lg-6 p-3 ">
            <div className="text-center">
              <img
                src={ETLogoPic}
                className="img-fluid align-top border rounded"
                alt=""
                onLoad={() => setIsLoaded(true)}
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default FrontPageBody;
