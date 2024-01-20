/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';
import { set, useForm } from 'react-hook-form';
import Header from './Header';
import FooterTemplate from './FooterTemplate';
import React, { useState } from 'react';

interface ConfirmEmailForm {
  email: string;
}

function RequestEmailConfirm() {
  const [spinner, setSpinner] = useState(false);
  const [notification, setNotification] = useState<String>('');
  const { register, handleSubmit, reset, getValues } =
    useForm<ConfirmEmailForm>();
  const onSubmit = async (formData: ConfirmEmailForm) => {
    setNotification('');
    setSpinner(true);
    const response = await PostRequestEmailConfirm(formData.email);
    if (response.status === 200) {
      setNotification(response.message);
      setSpinner(false);
    } else {
      setNotification(response.message);
      setSpinner(false);
    }
    reset();
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
            <h3>Request New Email Confirmation</h3>
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
              <div className="form-group my-2">
                <p className="small text-danger">{notification}</p>
              </div>
              {spinner ? (
                <div className="spinner-border text-info" role="status">
                  <span className="visually-hidden">Loading...</span>
                </div>
              ) : (
                <button type="submit" className="btn btn-info btn-login">
                  <span className="badge">SUBMIT</span>
                </button>
              )}
            </form>
          </div>
        </div>
      </div>
      <FooterTemplate />
    </>
  );
}

export default RequestEmailConfirm;

async function PostRequestEmailConfirm(userEmail: string) {
  const body: ConfirmEmailForm = {
    email: userEmail,
  };

  const response = await fetch(
    `${process.env.REACT_APP_SERVER_URL}/resendConfirmationEmail`,
    {
      method: 'POST',
      body: JSON.stringify(body),
      headers: {
        'Content-type': 'application/json; charset=UTF-8',
      },
    },
  );
  if (response.status !== 200) {
    return {
      status: 400,
      message: `Error: ${response.status}`,
    };
  } else {
    return {
      status: 200,
      message: `Please check your email inbox for ${userEmail}.`,
    };
  }
}
