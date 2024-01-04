/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';
import React from 'react';
import HeaderTemplateTwo from './Header';
import FooterTemplate from './FooterTemplate';
import ETLogoPic from './PlaceholderData/Images/ETLogoPicB.jpg';
import { Link } from 'react-router-dom';
import { useLoginContext } from './LoggedInContext';

function FrontPageTemplate() {
  const { loggedIn } = useLoginContext();
  return (
    <>
      <HeaderTemplateTwo />
      <div
        className="container"
        css={css`
          background: #ffffff;
          min-height: 85vh;
        `}
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
              <Link className="normal-font nav-link text-white " to="/Login">
                <button className="btn btn-info btn-login" type="submit">
                  <span className="badge ">
                    {loggedIn ? 'GO TO ACCOUNT' : 'LOGIN'}
                  </span>
                </button>
              </Link>
            </div>
          </div>

          <div className="col-lg-6 p-3 ">
            <div className="text-center">
              <img
                src={ETLogoPic}
                className="img-fluid align-top border rounded"
                alt=""
              />
            </div>
          </div>
        </div>
      </div>
      <FooterTemplate />
    </>
  );
}

export default FrontPageTemplate;
