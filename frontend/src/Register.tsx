/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';
import { useForm } from 'react-hook-form';
import Header from './Header';
import FooterTemplate from './FooterTemplate';
import InfoTester from './InfoTester';
import React, { useState, useContext } from 'react';
import { useLoginContext } from './LoggedInContext';
import Logout from './Logout';
import { RegisterPost, RegisterPostBody, LoginForm } from './JsonConverters';
import { Navigate } from 'react-router-dom';

function RegisterPage({ setLoggedIn }: any) {
  const { register, handleSubmit, reset, getValues } = useForm<LoginForm>();
  const { loggedIn } = useLoginContext();
  const [notification, setNotification] = useState<String>('');

  const onSubmit = async (formData: LoginForm) => {
    if (!getValues('consent')) {
      setNotification('Please check the opt-in.');
      window.location.href = '/login?success=true';
      return;
    }
    sessionStorage.setItem('Bearer', '');
    localStorage.setItem('refresh', '');
    setLoggedIn(false);
    const registerSuccess = await RegisterPost(formData);
    if (registerSuccess === true) {
      setNotification('');
      //clear form values
      reset();
      //redirect to login page
      window.location.href = '/login?success=true';
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
            <h3>Register</h3>
            <p>{loggedIn ? 'true' : 'false'}</p>
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
                <input
                  {...register('consent')}
                  type="checkbox"
                  name="consent"
                  className="form-check-input"
                  id="exampleCheck1"
                />
                <label className="form-check-label fs-6">
                  I agree to my data being stored for the purposes of customer
                  communications and product delivery.
                </label>
                <p className="small text-danger">{notification}</p>
              </div>
              <button type="submit" className="btn btn-info btn-login">
                <span className="badge">REGISTER</span>
              </button>
            </form>
          </div>
          <div className="text-start">
            <InfoTester />
            <br></br>
            <Logout setLoggedIn={setLoggedIn} />
          </div>
        </div>
      </div>

      <FooterTemplate />
    </>
  );
}

export default RegisterPage;
