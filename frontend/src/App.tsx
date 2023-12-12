/** @jsxImportSource @emotion/react */
//import { css } from '@emotion/react';
import './App.css';
import { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import FrontPageTemplate from './FrontPageTemplate';
import { AlbumData } from './ScaffoldData';
import AlbumsPage from './AlbumsPage';
import AlbumPage from './AlbumPage';
import LoginPage from './LoginPage';
import { MyLoginContext } from './LoggedInContext';
import { GetAlbums } from './JsonConverters';
import RegisterPage from './Register';
import PasswordReset from './PasswordReset';
import { CheckLoggedIn } from './PostLogin';
import AdminPage from './AdminPage';
import { CheckIsAdmin } from './IsAdminCheck';
import { CartProvider } from './CartContext';

function App() {
  const [albums, setLoadedAlbums] = useState<AlbumData[]>([]);
  const [loggedIn, setLoggedIn] = useState<boolean>(false); // create function to check if bearer token is still valid
  const [isAdmin, setIsAdmin] = useState<boolean>(false);

  useEffect(() => {
    const beginLoadAlbums = async () => {
      let loadedAlbums: AlbumData[] = await GetAlbums();
      setLoadedAlbums(loadedAlbums);
    };
    const LoggedInCheck = async () => {
      let loggedInCheck = await CheckLoggedIn();
      setLoggedIn(loggedInCheck);
    };
    const loggedInAdminCheck = async () => {
      let adminCheck = await CheckIsAdmin();
      setIsAdmin(adminCheck);
    };
    loggedInAdminCheck();
    beginLoadAlbums();
    LoggedInCheck();
  }, [isAdmin]);
  return (
    <CartProvider>
      <MyLoginContext.Provider value={{ loggedIn }}>
        <BrowserRouter>
          <div className="App ">
            <Routes>
              <Route path="PasswordReset" element={<PasswordReset />} />
              <Route path="" element={<FrontPageTemplate />} />
              <Route path="Albums" element={<AlbumsPage />} />
              {albums.map((albumInstance, i) => (
                <Route
                  key={i}
                  path={'Albums/' + albumInstance.kebabCase}
                  element={<AlbumPage data={albumInstance} />}
                />
              ))}
              <Route
                path="Login"
                element={<LoginPage setLoggedIn={setLoggedIn} />}
              />
              <Route
                path="Register"
                element={<RegisterPage setLoggedIn={setLoggedIn} />}
              />
              {isAdmin ? <Route path="Admin" element={<AdminPage />} /> : null}
            </Routes>
          </div>
        </BrowserRouter>
      </MyLoginContext.Provider>
    </CartProvider>
  );
}

export default App;
