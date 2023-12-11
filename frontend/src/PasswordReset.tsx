/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';
import { useForm } from 'react-hook-form';
import Header from './Header';
import FooterTemplate from './FooterTemplate';
import { PostLogin, GetInfoEmail } from './PostLogin';
import React, { useState, useContext, useEffect } from 'react';
import { useLoginContext } from './LoggedInContext';
import Logout from './Logout';
import { LoginForm } from './JsonConverters';
import configData from './config.json';
import PasswordResetCodeInput from './PasswordResetCodeInput';

function PasswordReset() {
  const { register, handleSubmit, reset, getValues } = useForm<LoginForm>();
  const [notification, setNotification] = useState<String>(' ');

  const onSubmit = async (formData: any) => {
    if (formData.email === '') {
      setNotification('Please check your login details.');
      return;
    }
    // post to password reset api
    let email = getValues('email');
    try {
      const response = await postEmail(email);
      if (response.status === 200) {
        // Clear the form
        reset();
        // Set a success notification
        setNotification(
          'Password reset email sent successfully, please check your inbox.',
        );
      } else {
        // Set an error notification
        setNotification('Failed to send password reset email.');
      }
    } catch (error) {
      // Handle any errors
      setNotification(
        'An error occurred while sending the password reset email.',
      );
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
            <h3>Password Reset</h3>
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
              <br />
              <p>{notification}</p>
              <button type="submit" className="btn btn-info btn-login">
                <span className="badge">SUBMIT</span>
              </button>
            </form>
          </div>
          <div className="text-start">
            <br></br>
          </div>
          <PasswordResetCodeInput />
        </div>
      </div>
      <FooterTemplate />
    </>
  );
}

export default PasswordReset;

async function postEmail(email: string) {
  const response = await fetch(`${configData.SERVER_URL}/forgotPassword`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email }),
  });

  return response;
}
