/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';
import { useForm } from 'react-hook-form';
import Header from './Header';
import FooterTemplate from './FooterTemplate';
import { PostLogin, GetInfoEmail } from './PostLogin';
import { useState, useContext, useEffect } from 'react';
import { useLoginContext } from './LoggedInContext';
import {
  LoginForm,
  GetPurchasedAlbums,
  GetPurchasedSongs,
} from './JsonConverters';
import { Link, useSearchParams } from 'react-router-dom';
import { MyCartContext } from './CartContext';
import LoginPageForm from './LoginPageLoginForm';
import LoginPageLoggedIn from './LoginPageLoggedIn';

function LoginPage({ setLoggedIn }: any) {
  const { register, handleSubmit, reset } = useForm<LoginForm>();
  const { loggedIn } = useLoginContext();
  const [notification, setNotification] = useState<String>('');
  const [queryParameters] = useSearchParams();
  const [success, setSuccess] = useState<boolean>(false);
  const [userEmail, setUserEmail] = useState<string>('');
  const [spinner, setSpinner] = useState(false);

  const context = useContext(MyCartContext);
  const { setPurchasedAlbums, setPurchasedSongs } = context || {};

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
    if (loginSuccess.status === 200) {
      setLoggedIn(true);
      setNotification('');

      let purchasedalbums = await GetPurchasedAlbums();
      if (setPurchasedAlbums) {
        setPurchasedAlbums(purchasedalbums);
        const purchasedAlbumsData = JSON.stringify(purchasedalbums);
        localStorage.setItem('purchasedAlbums', purchasedAlbumsData);
      }

      let purchasedsongs = await GetPurchasedSongs();
      if (setPurchasedSongs) {
        setPurchasedSongs(purchasedsongs);
        const purchasedSongsData = JSON.stringify(purchasedsongs);
        localStorage.setItem('purchasedSongs', purchasedSongsData);
      }

      //clear form values
      reset();
      setSpinner(false);
    } else if (loginSuccess.status === 401) {
      setSpinner(false);
      setNotification(loginSuccess.message);
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
              {loggedIn ? <>Welcome back {userEmail}</> : <>-</>}
            </p>
            {loggedIn ? (
              <LoginPageLoggedIn setLoggedIn={setLoggedIn} />
            ) : (
              <>
                {' '}
                <LoginPageForm
                  register={register}
                  handleSubmit={handleSubmit}
                  onSubmit={onSubmit}
                  notification={notification}
                  spinner={spinner}
                />
              </>
            )}
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
              <Link className="a" to="/passwordReset">
                here.
              </Link>
            </p>
            <p className="text-start">
              Do you need to confirm your email address?{' '}
              <Link className="a" to="/RequestEmailConfirmation">
                Request a new confirmation here.
              </Link>
            </p>
          </div>
        </div>
      </div>

      <FooterTemplate />
    </>
  );
}

export default LoginPage;
