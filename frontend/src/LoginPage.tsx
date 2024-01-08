/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';
import { set, useForm } from 'react-hook-form';
import Header from './Header';
import FooterTemplate from './FooterTemplate';
import { PostLogin, GetInfoEmail } from './PostLogin';
import React, { useState, useContext, useEffect } from 'react';
import { useLoginContext } from './LoggedInContext';
import Logout from './Logout';
import {
  RegisterPost,
  LoginForm,
  GetPurchasedAlbums,
  GetPurchasedSongs,
} from './JsonConverters';
import { Link, useSearchParams } from 'react-router-dom';
import configData from './config.json';
import { MyCartContext } from './CartContext';

function LoginPage({ setLoggedIn }: any) {
  const { register, handleSubmit, reset, getValues } = useForm<LoginForm>();
  const { loggedIn } = useLoginContext();
  const [notification, setNotification] = useState<String>('');
  const [queryParameters] = useSearchParams();
  const [success, setSuccess] = useState<boolean>(false);
  const [userEmail, setUserEmail] = useState<string>('');
  const [spinner, setSpinner] = useState(false);

  const context = useContext(MyCartContext);
  const {
    purchasedAlbumData,
    purchasedSongData,
    setPurchasedAlbums,
    setPurchasedSongs,
  } = context || {};

  useEffect(() => {
    if (queryParameters.get('success') === 'true') {
      setSuccess(true);
    }
    if (loggedIn) {
      //call the api to get user info
      setSuccess(false);
      const getUserEmail = async () => {
        let result = await GetInfoEmail();
        setUserEmail(result.email);
      };
      getUserEmail();
    } else {
      setSuccess(false);
      setNotification('');
    }
  }, [queryParameters, loggedIn]);

  const onSubmit = async (formData: LoginForm) => {
    setSpinner(true);
    if (formData.email === '' || formData.password === '') {
      setNotification('Please check your login details.');
      return;
    }
    const loginSuccess = await PostLogin(formData);
    if (loginSuccess === true) {
      setLoggedIn(true);
      setNotification('');

      let purchasedalbums = await GetPurchasedAlbums();
      if (setPurchasedAlbums) {
        setPurchasedAlbums(purchasedalbums);
      }

      let purchasedsongs = await GetPurchasedSongs();
      if (setPurchasedSongs) {
        setPurchasedSongs(purchasedsongs);
      }

      //clear form values
      reset();
      setSpinner(false);
    } else {
      setSpinner(false);
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
              {spinner ? (
                <div className="spinner-border text-info" role="status">
                  <span className="visually-hidden">Loading...</span>
                </div>
              ) : (
                <button type="submit" className="btn btn-info btn-login">
                  <span className="badge">LOGIN</span>
                </button>
              )}
            </form>
          </div>
          <div className="text-start">
            <br></br>
            <Logout setLoggedIn={setLoggedIn} />
          </div>
          <div className="text-dark normal-font-light no-underline py-3">
            <p className="text-start">
              Need to{' '}
              <Link className="a" to="/Register">
                Register
              </Link>
              {''}?
            </p>
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
