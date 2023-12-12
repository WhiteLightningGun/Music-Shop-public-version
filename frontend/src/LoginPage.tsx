/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';
import { useForm } from 'react-hook-form';
import Header from './Header';
import FooterTemplate from './FooterTemplate';
import { PostLogin, GetInfoEmail } from './PostLogin';
import React, { useState, useContext, useEffect } from 'react';
import { useLoginContext } from './LoggedInContext';
import Logout from './Logout';
import { RegisterPost, LoginForm } from './JsonConverters';
import { useSearchParams } from 'react-router-dom';
import configData from './config.json';

function LoginPage({ setLoggedIn }: any) {
  const { register, handleSubmit, reset, getValues } = useForm<LoginForm>();
  const { loggedIn } = useLoginContext();
  const [notification, setNotification] = useState<String>('');
  const [queryParameters] = useSearchParams();
  const [success, setSuccess] = useState<boolean>(false);
  const [userEmail, setUserEmail] = useState<string>('');

  useEffect(() => {
    if (queryParameters.get('success') === 'true') {
      setSuccess(true);
    }
    if (loggedIn) {
      //call the api to get user info

      const getUserEmail = async () => {
        let result = await GetInfoEmail();
        setUserEmail(result.email);
      };
      getUserEmail();
    }
  }, [queryParameters, loggedIn]);

  const onSubmit = async (formData: LoginForm) => {
    if (formData.email === '' || formData.password === '') {
      setNotification('Please check your login details.');
      return;
    }
    const loginSuccess = await PostLogin(formData);
    if (loginSuccess === true) {
      setLoggedIn(true);
      setNotification('');
      //clear form values
      reset();
    } else {
      setNotification('Please check your login details.');
    }
  };

  return (
    <>
      <Header />

      <div
        css={css`
          background: #ffffff;
          min-height: 85vh;
        `}
      >
        <div className="container">
          <br></br>
          <div className="text-dark normal-font-light no-underline py-1">
            <h3>Login Page</h3>
            <p>
              {success ? (
                <>
                  Thank you for registering, please enter your login
                  credentials.
                </>
              ) : (
                ''
              )}
              {loggedIn ? <>Welcome back {userEmail}</> : <></>}
            </p>
            <form className="text-start" onSubmit={handleSubmit(onSubmit)}>
              <div className="form-group">
                <label className="mb-2">Email address</label>
                <input
                  {...register('email')}
                  type="email"
                  name="email"
                  className="form-control"
                  placeholder="Enter email"
                  defaultValue={''}
                  autoComplete="email"
                />
              </div>
              <div className="form-group">
                <label className="my-2">Password</label>
                <input
                  {...register('password')}
                  type="password"
                  name="password"
                  className="form-control"
                  placeholder="Password"
                  defaultValue={''}
                />
              </div>
              <div className="form-group form-check my-2">
                <p className="small text-danger">{notification}</p>
              </div>
              <button type="submit" className="btn btn-info btn-login">
                <span className="badge">SUBMIT</span>
              </button>
            </form>
          </div>
          <div className="text-start">
            <br></br>
            <Logout setLoggedIn={setLoggedIn} />
          </div>
          <div className="text-dark normal-font-light no-underline py-3">
            <p className="text-start">
              Forgotten your credentials? Get a password reset{' '}
              <a href={`${configData.CLIENT_URL}/passwordReset`}>here.</a>
            </p>
          </div>
        </div>
      </div>

      <FooterTemplate />
    </>
  );
}

export default LoginPage;
