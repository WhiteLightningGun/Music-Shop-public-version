/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';
import { useEffect, useState } from 'react';
import Header from './Header';
import FooterTemplate from './FooterTemplate';
import { AlbumData } from './ScaffoldData';
import Loading from './Loading';
import { Link } from 'react-router-dom';
import AccountBody from './AccountBody';
import { useLoginContext } from './LoggedInContext';
import { GetInfoEmail } from './PostLogin';

interface Props {
  albumData: AlbumData[];
}

function Account({ albumData }: Props) {
  const { loggedIn } = useLoginContext();
  const [userEmail, setUserEmail] = useState<string>('');
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    setLoading(true);
    if (loggedIn) {
      //call the api to get user info
      const getUserEmail = async () => {
        let result = await GetInfoEmail();
        setUserEmail(result.email);
        setLoading(false);
      };
      getUserEmail();
    } else {
      setLoading(false);
    }
  }, [loggedIn]);
  return (
    <>
      <Header />
      {loggedIn ? (
        loading ? (
          <Loading />
        ) : (
          <AccountBody userEmail={userEmail} albumData={albumData} />
        )
      ) : (
        <div
          css={css`
            background: #ffffff;
            min-height: 85vh;
          `}
        >
          <div className="container">
            <br></br>
            <div className="text-dark normal-font-light py-1">
              <h3 className="text-dark normal-font-light no-underline">
                Account
              </h3>
            </div>
            <div>
              <p className="text-dark normal-font-light no-underline py-1">
                You must be registered and&nbsp;
                <Link className="a" to="/Login">
                  logged in
                </Link>
                &nbsp;to view this page.
              </p>
            </div>
          </div>
        </div>
      )}

      <FooterTemplate />
    </>
  );
}
export default Account;
