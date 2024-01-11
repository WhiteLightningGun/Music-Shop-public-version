/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';
import { useForm } from 'react-hook-form';
import Header from './Header';
import FooterTemplate from './FooterTemplate';
import InfoTester from './InfoTester';
import React, { useState } from 'react';
import Logout from './Logout';
import { useNavigate } from 'react-router-dom';
import { RegisterPost, RegisterPostBody, LoginForm } from './JsonConverters';

function RegisterPage({ setLoggedIn }: any) {
  const { register, handleSubmit, reset, getValues } = useForm<LoginForm>();
  const [notification, setNotification] = useState<String>('');
  const [spinner, setSpinner] = useState(false);
  const navigate = useNavigate();

  const onSubmit = async (formData: LoginForm) => {
    setSpinner(true);
    if (!getValues('consent')) {
      setNotification('Please check the opt-in.');
      return;
    }
    sessionStorage.setItem('Bearer', '');
    localStorage.setItem('refresh', '');
    setLoggedIn(false);
    let newRegisterPostBody: RegisterPostBody = {
      email: formData.email,
      password: formData.password,
    };

    const registerResponse = await RegisterPost(newRegisterPostBody);
    if (registerResponse.status === 200) {
      setNotification('');
      //clear form values
      reset();
      //redirect to login page
      navigate('/login?success=true');
      //window.location.href = '/login?success=true';
      setSpinner(false);
    } else {
      const errorResponse = await registerResponse.json();
      const errorMessages = Object.values(errorResponse.errors)
        .flat()
        .join(' ');
      setNotification(errorMessages);
      setSpinner(false);
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
              {spinner ? (
                <div className="spinner-border text-info" role="status">
                  <span className="visually-hidden">Loading...</span>
                </div>
              ) : (
                <button type="submit" className="btn btn-info btn-login">
                  <span className="badge">REGISTER</span>
                </button>
              )}
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
